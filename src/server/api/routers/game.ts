import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { db } from "@/server/db";
import { notInArray, sql } from "drizzle-orm";
import { games } from "@/server/db/schema";
import { getPlaiceholder } from "plaiceholder";

export interface GameDataType {
  name: string;
  playerCount: number;
  image: string | null;
  appid: number;
  placeholder: string | null;
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
  getGame: publicProcedure
    .input(z.number().array().optional())
    .query(async ({ input }) => {
      const game = await db
        .select()
        .from(games)
        .orderBy(sql`RANDOM()`)
        .limit(1)
        .where(notInArray(games.appid, input ? input : []));
      if (game[0]) {
        const returnedGame: GameDataType = { ...game[0], placeholder: null };
        const src = returnedGame.image;
        if (src) {
          try {
            const buffer = await fetch(src).then(async (res) => {
              return Buffer.from(await res.arrayBuffer());
            });
            const { base64 } = await getPlaiceholder(buffer);
            returnedGame.placeholder = base64;
            return returnedGame;
          } catch {}
        }
      }
      return undefined;
    }),
});
