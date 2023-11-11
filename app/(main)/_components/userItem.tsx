"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  BadgeCheck,
  CalendarDays,
  ChevronsLeftRight,
  LogOut,
} from "lucide-react";

import { SignOutButton, useUser } from "@clerk/clerk-react";

export default function UserItem() {
  const { user } = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full">
        <div
          role="button"
          className="flex items-center text-sm p-4 w-full hover:bg-primary/5"
        >
          <div className="gap-x-2 flex items-center max-w-[150px]">
            <Avatar className="h-7 w-7">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <span className="text-start font-medium line-clamp-1">
              {user?.fullName}&apos;s Notion
            </span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex gap-x-5 p-3">
          <div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
          </div>
          <div className="flex-1 flex flex-col gap-y-2">
            <h5 className="text-sm font-semibold">
              {user?.fullName}&apos;s Notion
            </h5>
            <p className="text-sm mb-2">
              {user?.emailAddresses[0].emailAddress}
            </p>
            {user?.externalAccounts[0].provider && (
              <div className="text-xs text-muted-foreground flex gap-x-2">
                {" "}
                <BadgeCheck
                  className="w-4 h-4 text-sky-500"
                  strokeWidth={2.5}
                />
                <span>
                  Signed in via{" "}
                  <span className="capitalize">
                    {user?.externalAccounts[0].provider}
                  </span>
                </span>
              </div>
            )}
            {user?.createdAt && (
              <div className="text-xs text-muted-foreground flex gap-x-2">
                <CalendarDays className="w-4 h-4" /> Joined{" "}
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                }).format(new Date(user?.createdAt))}
              </div>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="w-full cursor-pointer">
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
