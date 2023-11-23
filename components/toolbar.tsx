"use client";

import { Doc } from "@/convex/_generated/dataModel";
import IconPicker from "./icon-picker";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextareaAutosize from "react-textarea-autosize";
import { PopoverTrigger } from "./ui/popover";
import { useDebounce } from "usehooks-ts";
import { TooltipButton } from "./tooltipButton";

interface ToolbarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}

function Toolbar({ initialData, preview }: ToolbarProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);
  const debouncedValue = useDebounce(value, 400);
  const [isMounted, setIsMounted] = useState(false);

  const update = useMutation(api.documents.update);

  useEffect(() => {
    if (isMounted) {
      update({
        id: initialData._id,
        title: debouncedValue.trim() || "Untitled",
      });
    }

    setIsMounted(true);
  }, [debouncedValue, initialData._id, update]);

  const enableInput = () => {
    if (preview) return;

    setValue(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.setSelectionRange(0, inputRef.current?.value.length);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onInputChange = (value: string) => {
    setValue(value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      disableInput();
    }
  };

  const onDeleteIcon = () => {
    update({
      id: initialData._id,
      icon: "undefined",
    });
  };

  const onIconSelect = (icon: string) => {
    update({ id: initialData._id, icon: icon });
  };

  return (
    <div className="pl-[54px] relative">
      {!initialData.icon && <div className="py-8" />}

      {/* Note has an Emoji and is viewable publicly */}
      {!!initialData.icon && preview && (
        <p className="text-6xl py-5">{initialData.icon}</p>
      )}

      {/* Note has an Emoji and is NOT viewable publicly */}
      {!!initialData.icon && !preview && (
        <div className="group flex items-center gap-x-2.5 py-5">
          <div className="flex items-center gap-x-2 group/icon">
            <IconPicker onChange={onIconSelect}>
              <TooltipButton tooltipMessage={"Press to modify Emoji"} asChild>
                <PopoverTrigger asChild>
                  <p className="text-6xl hover:opacity-75 transition">
                    {initialData.icon}
                  </p>
                </PopoverTrigger>
              </TooltipButton>
            </IconPicker>
            <Button
              onClick={onDeleteIcon}
              className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground"
              variant={"outline"}
              size="icon"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInputChange(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
        />
      ) : (
        <>
          {preview && (
            <h1 className="pb-[11.5px] text-5xl font-bold break-words text-foreground/80 inline-block">
              {initialData.title}
            </h1>
          )}

          {!preview && (
            <TooltipButton tooltipMessage={"Press to modify title"} asChild>
              <h1
                onClick={enableInput}
                className="pb-[11.5px] text-5xl font-bold break-words text-foreground/80 inline-block"
              >
                {initialData.title}
              </h1>
            </TooltipButton>
          )}
        </>
      )}
    </div>
  );
}

export default Toolbar;
