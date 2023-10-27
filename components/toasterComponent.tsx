"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

function ToasterComponent() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="bottom-right"
      theme={resolvedTheme ? (resolvedTheme as "light" | "dark") : "system"}
    />
  );
}

export default ToasterComponent;
