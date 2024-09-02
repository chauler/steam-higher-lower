"use client";
import { api } from "@/trpc/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function HighScoreList({
  open,
  setIsOpen,
}: {
  open: boolean;
  setIsOpen: (arg0: boolean) => void;
}) {
  const { data: scores } = api.score.getScores.useQuery(undefined, {
    refetchInterval: 5000,
  });

  return (
    <Sheet open={open} onOpenChange={setIsOpen}>
      <SheetContent
        onInteractOutside={() => {
          setIsOpen(false);
        }}
        side={"left"}
        className="border-0 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"
      >
        <SheetHeader>
          <SheetTitle className="text-[2rem] text-white">
            High Scores
          </SheetTitle>
        </SheetHeader>
        <div className="flex min-h-screen flex-col rounded-sm border">
          {scores && scores.length > 0
            ? scores.map((score, index) => {
                return (
                  <div
                    className={`${index % 2 ? "border-slate-500/5 bg-slate-500/95" : "border-slate-500/95 bg-slate-500/5"} border-y px-2 py-4 text-xl font-semibold`}
                    key={index}
                  >{`${score.user.name}: ${score.score}`}</div>
                );
              })
            : "No scores fetched"}
        </div>
      </SheetContent>
    </Sheet>
  );
}
