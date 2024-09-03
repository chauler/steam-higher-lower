"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Session } from "next-auth";
import Link from "next/link";
import HighScoreList from "./HighScoreList";
import { useState } from "react";

export default function Navbar({ session }: { session: Session | null }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-max w-screen min-w-full">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
              <NavigationMenuLink
                className={
                  navigationMenuTriggerStyle() +
                  " bg-transparent text-slate-100 transition-transform hover:-translate-y-0.5"
                }
              >
                {session ? "Sign Out" : "Sign In"}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <button
              className={
                navigationMenuTriggerStyle() +
                " bg-transparent text-white transition-transform hover:-translate-y-0.5"
              }
              onClick={() => {
                setIsOpen((val) => !val);
              }}
            >
              High Scores
            </button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <HighScoreList
        open={isOpen}
        setIsOpen={setIsOpen}
        session={session}
      ></HighScoreList>
    </div>
  );
}
