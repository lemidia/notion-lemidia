"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { BadgeCheck, CalendarDays } from "lucide-react";

import { SignOutButton, useUser } from "@clerk/clerk-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function UserItem() {
  const { user } = useUser();
  return (
    <Popover>
      <PopoverTrigger className="w-full" asChild>
        <button className="flex items-center text-sm p-4 w-full hover:bg-primary/5">
          <div className="gap-x-2 flex items-center max-w-[150px]">
            <Avatar className="h-7 w-7">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <span className="text-start font-medium line-clamp-1">
              {user?.fullName}&apos;s Notion
            </span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex gap-x-5">
          <div>
            <Avatar className="h-10 w-10">
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

        <Button asChild className="w-full h-9 uppercase font-medium mt-5">
          <SignOutButton />
        </Button>
      </PopoverContent>
    </Popover>
  );
}
