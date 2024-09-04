import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { db } from "@/server/db";
import { notInArray, sql } from "drizzle-orm";
import { games } from "@/server/db/schema";

export interface GameDataType {
  name: string;
  playerCount: number;
  image: string | null;
  appid: number;
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
      return game[0] ? game[0] : undefined;
    }),
});
