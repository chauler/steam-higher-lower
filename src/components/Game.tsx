"use client";
import Image from "next/image";
import { GameDataType } from "@/server/api/routers/game";

export default function Game({
  gameData,
  selected,
  handleClick,
}: {
  gameData: GameDataType;
  selected: boolean;
  handleClick: (arg0: number) => unknown;
}) {
  return (
    <div className="flex h-96 min-h-48 w-1/3 min-w-96 flex-col items-center rounded-lg bg-slate-500/50 p-2 text-white md:h-[30rem]">
      <div className="relative w-full min-w-min max-w-full flex-grow rounded-lg">
        {gameData.image ? (
          <Image
            className="rounded-lg object-cover"
            src={gameData.image}
            alt={""}
            fill={true}
            priority={true}
          />
        ) : null}
      </div>
      <div className="flex-grow-0 py-2"></div>
      <p className="min-w-0 max-w-full flex-shrink flex-grow-0 truncate text-center text-2xl font-semibold md:text-[2rem]">
        {gameData.name}
      </p>
      <div className="flex-grow-0 py-2"></div>
      <div className="flex h-1/6 w-full items-center justify-center">
        {selected ? (
          <p className="w-full text-center text-2xl font-semibold text-white">
            {gameData.playerCount} players
          </p>
        ) : (
          <button
            className="h-full w-1/2 rounded-lg bg-slate-200 transition hover:-translate-y-0.5 active:scale-[1.02]"
            onClick={() => {
              handleClick(gameData.appid);
            }}
          >
            <p className="text-3xl font-bold text-slate-900">Select</p>
          </button>
        )}
      </div>
    </div>
  );
}
