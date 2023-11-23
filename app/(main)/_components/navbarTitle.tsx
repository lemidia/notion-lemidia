"use client";

import { TooltipButton } from "@/components/tooltipButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "usehooks-ts";

interface NavbarTitleProps {
  initialData: Doc<"documents">;
}

function NavbarTitle({ initialData }: NavbarTitleProps) {
  const update = useMutation(api.documents.update);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData.title || "Untitled");
  const debouncedInput = useDebounce(title, 500);
  const inputRef = useRef<HTMLInputElement>(null);

  // For preventing update when component mounted
  const [isMounted, setIsMounted] = useState(false);

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      disableInput();
    }
  };

  useEffect(() => {
    if (isMounted) {
      update({
        id: initialData._id,
        title: debouncedInput.trim() || "Untitled",
      });
    }

    setIsMounted(true);
  }, [debouncedInput, initialData._id, update]);

  return (
    <div className="flex items-center gap-x-0.5 rounded-md min-w-0">
      {!!initialData.icon && <p className="text-xl">{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onChange={onChange}
          onBlur={disableInput}
          value={title}
          onKeyDown={onKeyDown}
          className="h-7 px-1.5 focus-visible:ring-transparent ring-offset-transparent font-semibold text-base"
        />
      ) : (
        <TooltipButton tooltipMessage={"Modify Title"} asChild>
          <Button
            onClick={enableInput}
            variant={"ghost"}
            className="font-semibold h-7 px-1.5 dark:hover:bg-neutral-700 text-base min-w-0"
          >
            <p className="truncate">{initialData?.title}</p>
          </Button>
        </TooltipButton>
      )}
    </div>
  );
}

NavbarTitle.Skeleton = function NavbarTitleSkeleton() {
  return <Skeleton className="h-6 w-20 rounded-md" />;
};

export default NavbarTitle;
