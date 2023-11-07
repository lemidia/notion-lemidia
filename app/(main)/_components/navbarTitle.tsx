"use client";

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
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      disableInput();
    }
  };

  useEffect(() => {
    if (isMounted) {
      update({
        id: initialData._id,
        title: debouncedInput || "Untitled",
      });
    }

    setIsMounted(true);
  }, [debouncedInput]);

  return (
    <div className="flex items-center gap-x-1 overflow-x-hidden">
      {!!initialData.icon && <p className="text-lg">{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onChange={onChange}
          onBlur={disableInput}
          value={title}
          onKeyDown={onKeyDown}
          className="h-7 px-2 focus-visible:ring-transparent w-96"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant={"ghost"}
          size={"sm"}
          className="font-semibold h-auto p-1 hover:bg-primary/10 overflow-x-hidden"
        >
          <p className="truncate">{initialData?.title}</p>
        </Button>
      )}
    </div>
  );
}

NavbarTitle.Skeleton = function NavbarTitleSkeleton() {
  return <Skeleton className="h-6 w-20 rounded-md" />;
};

export default NavbarTitle;
