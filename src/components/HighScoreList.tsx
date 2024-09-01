"use client";
import { api } from "@/trpc/react";

export default function HighScoreList() {
  const { data: scores } = api.score.getScores.useQuery(undefined, {
    refetchInterval: 5000,
  });

  return (
    <div className="flex min-h-screen flex-col gap-2 bg-slate-500/50">
      {scores && scores.length > 0
        ? scores.map((score, index) => {
            return (
              <div
                className="border-y border-black"
                key={index}
              >{`${score.user.name}: ${score.score}`}</div>
            );
          })
        : "No scores fetched"}
    </div>
  );
}
