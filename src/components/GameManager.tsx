"use client";

import { useState } from "react";
import Game from "./Game";
import { api } from "@/trpc/react";

export type GameData = {
  name: string;
  image: string | null;
  appid: number;
  playerCount: number;
};

export default function GameManager() {
  async function HandleClick(id: number) {
    setSelected(true);
    setGameWin(
      () =>
        id ===
        [game1.data, game2.data].reduce((prev, current) => {
          return prev && prev.playerCount > (current?.playerCount ?? 0)
            ? prev
            : current;
        })?.appid,
    );
  }

  async function Refresh() {
    setSelected(false);
    let gamesToAdd: number[] = [];
    if (game1.data?.appid && game2.data?.appid) {
      gamesToAdd = [game1.data.appid, game2.data.appid];
    }
    setPrevGames([...prevGames, ...gamesToAdd]);
    await Promise.all([game1.refetch(), game2.refetch()]);
  }

  const [prevGames, setPrevGames] = useState<number[]>([]);
  const [selected, setSelected] = useState(false);
  const [gameWin, setGameWin] = useState(false);

  const game1 = api.game.getGame.useQuery(prevGames);
  const game2 = api.game.getGame.useQuery(
    game1.data?.appid ? [...prevGames, game1.data.appid] : [],
    {
      enabled: !!game1.data,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    },
  );

  return (
    <>
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        {selected && gameWin ? (
          "Winrar"
        ) : selected && !gameWin ? (
          "Loser"
        ) : (
          <>
            Dead <span className="text-[hsl(280,100%,70%)]">Game</span> Game
          </>
        )}
      </h1>
      <div className="flex flex-row items-center justify-center">
        {game1.data && game2.data ? (
          <Game
            gameData={game1.data}
            handleClick={HandleClick}
            selected={selected}
          ></Game>
        ) : null}
        <div className="self-end px-6 text-[5rem] font-bold text-slate-100">
          vs.
        </div>
        {game1.data && game2.data ? (
          <Game
            gameData={game2.data}
            handleClick={HandleClick}
            selected={selected}
          ></Game>
        ) : null}
      </div>
      <div>
        {selected ? (
          <button className="h-24 w-96 rounded-lg bg-slate-200">
            <p
              className="font-semibold text-slate-800"
              onClick={() => {
                void Refresh();
              }}
            >
              Select
            </p>
          </button>
        ) : null}
      </div>
    </>
  );
}
