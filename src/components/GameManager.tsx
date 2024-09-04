"use client";

import { useEffect, useRef, useState } from "react";
import Game from "./Game";
import { api } from "@/trpc/react";
import type { Session } from "next-auth";

export type GameData = {
  name: string;
  image: string | null;
  appid: number;
  playerCount: number;
};

export default function GameManager({ session }: { session: Session | null }) {
  const postNewScore = api.score.postScore.useMutation();
  const utils = api.useUtils();
  async function HandleClick(id: number) {
    setSelected(true);
    const win =
      id ===
      [game1.data, game2.data].reduce((prev, current) => {
        return prev && prev.playerCount > (current?.playerCount ?? 0)
          ? prev
          : current;
      })?.appid;
    setGameWin(win);
    setStreak((streak) => (win ? streak + 1 : 0));
  }

  async function Refresh() {
    setSelected(false);
    let gamesToAdd: number[] = [];
    if (game1.data?.appid && game2.data?.appid) {
      gamesToAdd = [game1.data.appid, game2.data.appid];
    }
    setPrevGames(
      prevGames.length < 20 ? [...prevGames, ...gamesToAdd] : [...gamesToAdd],
    );
    await utils.game.getGame.ensureData(prevGames);
    await utils.game.getGame.ensureData(
      nextGame1.data?.appid ? [...prevGames, nextGame1.data.appid] : [],
    );
    setGame1(
      nextGame1.data ? { data: { ...nextGame1.data } } : { data: undefined },
    );
    setGame2(
      nextGame2.data ? { data: { ...nextGame2.data } } : { data: undefined },
    );
    void Promise.all([nextGame1.refetch(), nextGame2.refetch()]);
  }

  const [prevGames, setPrevGames] = useState<number[]>([]);
  const [selected, setSelected] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [gameWin, setGameWin] = useState(false);
  const [streak, setStreak] = useState(0);

  const [game1, setGame1] = useState<{
    data:
      | {
          name: string;
          image: string | null;
          appid: number;
          playerCount: number;
        }
      | undefined;
  }>({ data: undefined });
  const [game2, setGame2] = useState<{
    data:
      | {
          name: string;
          image: string | null;
          appid: number;
          playerCount: number;
        }
      | undefined;
  }>({ data: undefined });

  useEffect(() => {
    async function SetScore() {
      if (session?.user.id) {
        const existingScore = await utils.score.getScore.ensureData(
          session.user.id,
        );
        if (existingScore !== undefined && streak > existingScore) {
          postNewScore.mutate({ id: session?.user.id, score: streak });
        }
      }
    }
    void SetScore();
  }, [streak]);

  const nextGame1 = api.game.getGame.useQuery(prevGames, {
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
  const nextGame2 = api.game.getGame.useQuery(
    nextGame1.data?.appid ? [...prevGames, nextGame1.data.appid] : [],
    {
      enabled: !!nextGame1.data,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    },
  );

  useEffect(() => {
    async function SetUpGames() {
      if (nextGame1.data && nextGame2.data) {
        setGame1({
          data: {
            ...nextGame1.data,
          },
        });
        setGame2({ data: { ...nextGame2.data } });
      }
      let gamesToAdd: number[] = [];
      if (nextGame1.data?.appid && nextGame2.data?.appid) {
        gamesToAdd = [nextGame1.data?.appid, nextGame2.data?.appid];
      }
      setPrevGames(
        prevGames.length < 20 ? [...prevGames, ...gamesToAdd] : [...gamesToAdd],
      );
      setSelected(false);
    }

    if (refresh && nextGame1.isSuccess && nextGame2.isSuccess) {
      setRefresh(false);
      void SetUpGames();
    }
  }, [refresh, nextGame1.isFetching, nextGame2.isFetching]);

  return (
    <>
      <h1 className="flex min-h-40 flex-col gap-2 text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        {selected && gameWin ? (
          "Winrar"
        ) : selected && !gameWin ? (
          "Loser"
        ) : (
          <>
            <div>
              Higher <span className="text-[hsl(280,100%,70%)]">or</span> Lower
            </div>
            <div className="self-center text-[3rem]">Steam Edition</div>
          </>
        )}
      </h1>
      <div className="flex min-w-full flex-col items-center justify-center md:flex-row">
        {game1.data && game2.data ? (
          <Game
            gameData={game1.data}
            handleClick={HandleClick}
            selected={selected}
          ></Game>
        ) : (
          <div className="min-h-48 min-w-96"></div>
        )}
        <div className="self-center px-6 text-[5rem] font-bold text-slate-100 md:self-end">
          vs.
        </div>
        {game1.data && game2.data ? (
          <Game
            gameData={game2.data}
            handleClick={HandleClick}
            selected={selected}
          ></Game>
        ) : (
          <div className="min-h-[30rem] min-w-96"></div>
        )}
      </div>
      <div>
        {selected ? (
          <button
            className="h-24 w-96 rounded-lg bg-slate-200 transition hover:-translate-y-0.5 active:scale-[1.02]"
            onClick={() => {
              setRefresh(true);
            }}
          >
            <p className="text-3xl font-bold text-slate-800">
              {gameWin ? "Continue" : "Play Again"}
            </p>
          </button>
        ) : null}
      </div>
      <div className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        {selected && streak ? `${streak} game streak!` : null}
      </div>
    </>
  );
}
