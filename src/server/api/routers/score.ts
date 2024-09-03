import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { db } from "@/server/db";
import { desc, sql } from "drizzle-orm";
import { scores } from "@/server/db/schema";

export const scoreRouter = createTRPCRouter({
  postScore: protectedProcedure
    .input(z.object({ id: z.string(), score: z.number() }))
    .mutation(async ({ input: { id, score } }) => {
      await db
        .insert(scores)
        .values({ userId: id, score: score })
        .onConflictDoUpdate({
          target: scores.userId,
          set: { score: score },
          setWhere: sql`score < ${score}`,
        });
    }),
  getScore: publicProcedure.input(z.string()).query(async ({ input }) => {
    return (
      (
        await db.query.scores.findFirst({
          where: (score, { eq }) => eq(score.userId, input),
        })
      )?.score ?? 0
    );
  }),
  getScores: publicProcedure.query(async () => {
    return await db.query.scores.findMany({
      orderBy: [desc(scores.score)],
      limit: 10,
      with: {
        user: {
          columns: {
            name: true,
            image: true,
          },
        },
      },
    });
  }),
});
