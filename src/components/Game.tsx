"use client";

import type { GameData } from "./GameManager";
import Image from "next/image";

export default function Game({
  gameData,
  selected,
  handleClick,
}: {
  gameData: GameData;
  selected: boolean;
  handleClick: (arg0: number) => unknown;
}) {
  return (
    <div className="flex h-48 min-h-48 w-1/3 min-w-96 flex-col items-center rounded-lg bg-slate-500/50 p-2 text-white md:h-[30rem]">
      <div className="relative h-1/2 w-full min-w-min max-w-full flex-grow rounded-lg">
        {gameData.image ? (
          <Image
            className="rounded-lg object-contain"
            src={gameData.image}
            alt={""}
            fill={true}
          />
        ) : null}
      </div>
      <p className="text-2xl font-semibold md:text-[2rem]">{gameData.name}</p>
      <div className="flex-grow"></div>
      {selected ? (
        gameData.playerCount
      ) : (
        <button
          className="h-1/6 w-1/2 rounded-lg bg-slate-200"
          onClick={() => {
            handleClick(gameData.appid);
          }}
        >
          <p className="font-semibold text-slate-800">Select</p>
        </button>
      )}
    </div>
  );
}
