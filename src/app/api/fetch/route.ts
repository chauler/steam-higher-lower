import z from "zod";
import "dotenv/config";
import { db } from "@/server/db";
import { games } from "@/server/db/schema";
import dynamic from "next/dynamic";
import { FetchWithRetry } from "@/util/util";

const TopListData = z.object({
  response: z.object({
    ranks: z
      .object({
        rank: z.number(),
        appid: z.number(),
        concurrent_in_game: z.number(),
        peak_in_game: z.number(),
      })
      .array(),
  }),
});
type TopListDataType = z.infer<typeof TopListData>;

const GameInfo = z.object({
  data: z.object({
    name: z.string(),
    header_image: z.string(),
  }),
});
type GameInfoType = z.infer<typeof GameInfo>;
type GameInfoJSON = Record<string, GameInfoType>;

const PlayerCount = z.object({
  response: z.object({
    player_count: z.number(),
  }),
});
type PlayerCountType = z.infer<typeof PlayerCount>;

export async function GET(request: Request) {
  let overallGameData;
  try {
    const res = await fetch(
      "https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1/",
    );

    const parseResult = TopListData.safeParse(await res.json());
    if (parseResult.error) {
      console.log("Bad fetch");
      return new Response("Error, bad fetch");
    }

    const topGameData: TopListDataType = parseResult.data;
    const storedGames = await db.query.games.findMany({
      columns: { appid: true },
    });

    const overallGameList = [
      ...new Set([...topGameData.response.ranks, ...storedGames]),
    ];

    overallGameData = await Promise.all(
      overallGameList.map(async ({ appid }) => {
        try {
          const [gameInfoRaw, playerCountRaw] = await Promise.all([
            FetchWithRetry(
              `http://store.steampowered.com/api/appdetails/?appids=${appid}&filters=basic`,
            ),
            FetchWithRetry(
              `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}`,
            ),
          ]);

          const [gameInfoJSON, playerCountJSON] = (await Promise.all([
            gameInfoRaw.json(),
            playerCountRaw.json(),
          ])) as [GameInfoJSON, PlayerCountType];

          const gameInfoParseResult = GameInfo.safeParse(
            gameInfoJSON[appid.toString()],
          );
          const playerCountParseResult = PlayerCount.safeParse(playerCountJSON);

          if (gameInfoParseResult.error || playerCountParseResult.error) {
            if (gameInfoParseResult.error) {
              return {};
            } else if (playerCountParseResult.error) {
              return {};
            }
            console.log("Error parsing game info");
          }

          const gameInfo = gameInfoParseResult.data.data;
          return {
            appid: appid,
            playerCount: playerCountParseResult.data.response.player_count,
            name: gameInfo.name,
            image: gameInfo.header_image,
          };
        } catch {
          return {};
        }
      }),
    );
  } catch {}
  if (!overallGameData) {
    return;
  }
  overallGameData = overallGameData.filter((game) => game.appid !== undefined);

  await Promise.all(
    overallGameData.map((game) => {
      return db
        .insert(games)
        .values(game)
        .onConflictDoUpdate({
          target: games.appid,
          set: { playerCount: game.playerCount },
        });
    }),
  );

  return new Response(JSON.stringify(overallGameData));
}

export const config = { dynamic: "force-dynamic" };
