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
    <div className="flex h-96 min-h-96 w-96 min-w-96 flex-col items-center rounded-lg bg-slate-500/50 p-2 text-white">
      <div className="relative h-1/2 w-full min-w-min max-w-full">
        {gameData.image ? (
          <Image
            className="rounded-lg object-fill"
            src={gameData.image}
            alt={""}
            fill={true}
          />
        ) : null}
      </div>
      <p className="text-[2rem] font-semibold">{gameData.name}</p>
      <div className="flex-grow font-semibold">
        {selected ? gameData.playerCount : null}
      </div>
      <button
        className="h-1/6 w-1/2 rounded-lg bg-slate-200"
        onClick={() => {
          handleClick(gameData.appid);
        }}
      >
        <p className="font-semibold text-slate-800">Select</p>
      </button>
    </div>
  );
}
