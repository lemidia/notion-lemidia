"use client";

import { useScrollTop } from "@/hooks/useScrollTop";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/themeToggle";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

export default function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-5",
        scrolled && "shadow-lg"
      )}
    >
      <Logo />
      <div className="flex items-center flex-1 justify-between md:flex-initial md:ml-auto md:gap-x-2">
        {isLoading && <Spinner size="icon" />}
        {!isLoading && !isAuthenticated && (
          <>
            <SignInButton mode="modal">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </SignInButton>
          </>
        )}
        {!isLoading && isAuthenticated && <UserButton afterSignOutUrl="/" />}
        <ModeToggle />
      </div>
    </div>
  );
}
