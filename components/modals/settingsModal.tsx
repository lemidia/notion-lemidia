"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useSettingsStore } from "@/hooks/useSettingsStore";
import { Label } from "../ui/label";
import { ModeToggle } from "../themeToggle";

function SettingsModal() {
  const { isOpen, onClose } = useSettingsStore();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader className="border-b pb-4">
          <DialogTitle>My Settings</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex flex-col gap-y-1">
            <Label className="text[14px] text-muted-foreground">
              Appearance
            </Label>
            <span>Customize how Notion looks on your device. </span>
          </div>

          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsModal;
