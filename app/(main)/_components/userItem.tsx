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

import { ChevronsLeftRight } from "lucide-react";

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
          <ChevronsLeftRight className=" rotate-90 ml-2 text-muted-foreground h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-2 pt-3 ">
          <p className="text-sm font-medium leading-none">
            {user?.emailAddresses[0].emailAddress}
          </p>
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondary p-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
            </div>
            <div className="space-y-1">
              <div className="text-sm line-clamp-2">
                {user?.fullName}&apos; Notion
              </div>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          asChild
          className="w-full text-muted-foreground cursor-pointer"
        >
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
