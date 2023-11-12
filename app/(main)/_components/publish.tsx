"use client";

import { Doc } from "@/convex/_generated/dataModel";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useOrigin } from "@/hooks/useOrigin";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Copy, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipButton } from "@/components/tooltipButtton";

interface PublishProps {
  initialData: Doc<"documents">;
}

function Publish({ initialData }: PublishProps) {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData._id}`;

  const onPublish = async () => {
    try {
      setIsSubmitting(true);
      const promise = update({
        id: initialData._id,
        isPublished: true,
      });

      toast.promise(promise, {
        loading: "Publishing note...",
        success: "Note published!",
        error: "Failed to publish note.",
      });

      await promise;
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUnPublish = async () => {
    try {
      setIsSubmitting(true);
      const promise = update({
        id: initialData._id,
        isPublished: false,
      });

      toast.promise(promise, {
        loading: "Unpublishing note...",
        success: "Note unpublished!",
        error: "Failed to unpublish note.",
      });

      await promise;
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <TooltipButton
          TooltipMessage={"Publish"}
          variant={"ghost"}
          size={"icon"}
          className="rounded-full w-8 h-8 dark:hover:bg-neutral-700"
        >
          <Globe
            className={`w-5 h-5 ${
              initialData.isPublished && "text-sky-400 animate-pulse"
            } `}
          />
        </TooltipButton>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-400 h-5 w-5 text-muted-foreground animate-pulse" />
              <p className="text-sm font-medium">This note is now public.</p>
            </div>
            <div className="flex items-center">
              <input
                value={url}
                type="text"
                className="flex-1 px-2 text-xs border rounded-l-md h-8  border-r-0"
                disabled
              />
              <Button
                onClick={onCopy}
                className="h-8 rounded-l-none"
                variant={"outline"}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <TooltipButton
              TooltipMessage={"Unpublish"}
              className="w-full text-sm"
              onClick={onUnPublish}
              size={"sm"}
              disabled={isSubmitting}
            >
              Unpublish
            </TooltipButton>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <Globe className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium mt-2">Publish this note</p>
            <span className="text-xs text-muted-foreground mt-2">
              Share your note with others.
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-sm mt-4"
              size={"sm"}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

Publish.Skeleton = function PublishSkeleton() {
  return <Skeleton className="h-8 w-8 rounded-full" />;
};

export default Publish;
