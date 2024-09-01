import Link from "next/link";
import { HydrateClient } from "@/trpc/server";
import { getServerAuthSession } from "@/server/auth";
import GameManager from "@/components/GameManager";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-start gap-8 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="self-end rounded-xl bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <GameManager></GameManager>
        </div>
      </main>
    </HydrateClient>
  );
}
