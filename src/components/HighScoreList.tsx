"use client";
import { api } from "@/trpc/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Session } from "next-auth";
import Image from "next/image";

export default function HighScoreList({
  open,
  setIsOpen,
  session,
}: {
  open: boolean;
  setIsOpen: (arg0: boolean) => void;
  session: Session | null;
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
        className="border-0 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white md:min-w-96 md:max-w-[400px]"
      >
        <SheetHeader>
          <SheetTitle className="text-[2rem] text-white">
            High Scores
          </SheetTitle>
        </SheetHeader>
        <div className="flex min-h-screen w-96 max-w-full flex-col rounded-sm">
          {scores && scores.length > 0
            ? scores.map((score, index) => {
                return (
                  <div
                    className={`${session && session.user.id === score.userId ? "bg-slate-500/95" : "bg-slate-500/5"} flex items-center gap-2 border-x-[1px] border-y-[0.5px] px-2 py-4 text-xl font-semibold`}
                    key={index}
                  >
                    {score.user.image ? (
                      <Image
                        src={score.user.image}
                        height={64}
                        width={64}
                        alt={`${session ? session?.user.name + "'s " : null}profile picture`}
                        className="inline h-[32px] w-[32px] rounded-full md:h-[48px] md:w-[48px]"
                      ></Image>
                    ) : null}

                    {
                      <p className="min-w-0 flex-shrink truncate">{`${score.user.name}`}</p>
                    }
                    {<div className="flex-grow"></div>}
                    {`${score.score}`}
                  </div>
                );
              })
            : "No scores fetched"}
        </div>
      </SheetContent>
    </Sheet>
  );
}
