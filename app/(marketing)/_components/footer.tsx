import React from "react";
import Logo from "./logo";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="flex items-center w-full p-6 bg-background z-50 dark:bg-[#1F1F1F]">
      <Logo />
      <div className="md:ml-auto flex w-full justify-between md:justify-end items-center gap-x-2 text-muted-foreground">
        <Button variant={"ghost"} size={"sm"}>
          Privacy Policy
        </Button>
        <Button variant={"ghost"} size={"sm"}>
          Terms & Conditions
        </Button>
      </div>
    </footer>
  );
}
