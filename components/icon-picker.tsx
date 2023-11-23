"use client";

import { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";

import dynamic from "next/dynamic";

const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

import { Popover, PopoverContent } from "@/components/ui/popover";

interface IconPickerProps {
  onChange: (icon: string) => void;
  children: React.ReactNode;
}

const themeMap = {
  dark: Theme.DARK,
  light: Theme.LIGHT,
};

function IconPicker({ onChange, children }: IconPickerProps) {
  const { resolvedTheme } = useTheme();

  const theme = themeMap[(resolvedTheme || "light") as keyof typeof themeMap];

  return (
    <Popover>
      {children}
      <PopoverContent
        className="p-0 w-full border-none shadow-none"
        forceMount
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <EmojiPicker
          autoFocusSearch={false}
          height={350}
          theme={theme}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
}

export default IconPicker;
