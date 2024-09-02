import { HydrateClient } from "@/trpc/server";
import { getServerAuthSession } from "@/server/auth";
import GameManager from "@/components/GameManager";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <div className="flex h-screen flex-col gap-2 bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Navbar session={session}></Navbar>
        <main className="flex min-w-full flex-shrink flex-grow flex-col items-center justify-start gap-2 text-white">
          <div className="container flex min-w-full flex-col items-center justify-center gap-6 px-4">
            <GameManager session={session}></GameManager>
          </div>
        </main>
        <aside className=""></aside>
      </div>
    </HydrateClient>
  );
}
