"use client";
import { api } from "@/trpc/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

export default function HighScoreList() {
  const { data: scores } = api.score.getScores.useQuery(undefined, {
    refetchInterval: 5000,
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <div
        className="absolute left-0 min-h-screen min-w-12 bg-gradient-to-l from-transparent to-black/50"
        onMouseEnter={() => {
          setIsSheetOpen(true);
        }}
      ></div>
      <Sheet open={isSheetOpen}>
        <SheetContent
          onInteractOutside={() => {
            setIsSheetOpen(false);
          }}
          onMouseLeave={() => {
            setIsSheetOpen(false);
          }}
          side={"left"}
          className="border-0 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"
        >
          <SheetHeader>
            <SheetTitle className="text-white">High Scores</SheetTitle>
          </SheetHeader>
          <div className="flex min-h-screen flex-col gap-2">
            {scores && scores.length > 0
              ? scores.map((score, index) => {
                  return (
                    <div
                      className="border-y border-white"
                      key={index}
                    >{`${score.user.name}: ${score.score}`}</div>
                  );
                })
              : "No scores fetched"}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
