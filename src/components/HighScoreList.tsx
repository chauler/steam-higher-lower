import { api } from "@/trpc/server";

export default async function HighScoreList() {
  const scores = await api.score.getScores();
  return (
    <div className="flex min-h-screen flex-col gap-2 bg-slate-500/50">
      {scores.length > 0
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
