"use client";

import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface IconPickerProps {
  onChange: (icon: string) => void;
  children: React.ReactNode;
  asChild?: boolean;
}

const themeMap = {
  dark: Theme.DARK,
  light: Theme.LIGHT,
};

function IconPicker({ onChange, children, asChild }: IconPickerProps) {
  const { resolvedTheme } = useTheme();

  const theme = themeMap[(resolvedTheme || "light") as keyof typeof themeMap];

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="p-0 w-full border-none shadow-none">
        <EmojiPicker
          height={350}
          theme={theme}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
}

export default IconPicker;
