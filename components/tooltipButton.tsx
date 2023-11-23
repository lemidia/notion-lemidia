"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipButtonProps {
  children: React.ReactNode;
  tooltipMessage: string | number;
  asChild?: boolean;
}

export function TooltipButton({
  children,
  tooltipMessage,
  asChild,
}: TooltipButtonProps) {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipMessage}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
