import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { db } from "@/server/db";

export interface GameDataType {
  name: string;
  playerCount: number;
  image: string;
}

interface GameInfo {
  data: {
    name: string;
    header_image: string;
  };
}

interface PlayerCount {
  response: {
    player_count: number;
  };
}

type GameInfoJSON = Record<string, GameInfo>;

export const gameRouter = createTRPCRouter({
  getPlayerStats: publicProcedure
    .input(z.object({ appid: z.number() }))
    .query(async ({ input }) => {
      const [gameInfoRaw, playerCountRaw] = await Promise.all([
        fetch(
          `http://store.steampowered.com/api/appdetails/?appids=${input.appid}&filters=basic`,
        ),
        fetch(
          `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${input.appid}`,
        ),
      ]);
      const [gameInfo, playerCount]: [GameInfoJSON, PlayerCount] =
        (await Promise.all([gameInfoRaw.json(), playerCountRaw.json()])) as [
          GameInfoJSON,
          PlayerCount,
        ];
      return {
        name: gameInfo[input.appid]?.data.name,
        playerCount: playerCount.response.player_count,
        image: gameInfo[input.appid]?.data.header_image,
      } as GameDataType;
    }),
});
