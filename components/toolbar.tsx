"use client";

import { Doc } from "@/convex/_generated/dataModel";
import IconPicker from "./icon-picker";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextareaAutosize from "react-textarea-autosize";

interface ToolbarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}

function Toolbar({ initialData, preview }: ToolbarProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const update = useMutation(api.documents.update);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.setSelectionRange(0, inputRef.current?.value.length);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onInputChange = (value: string) => {
    setValue(value);
    update({
      id: initialData._id,
      title: value || "Untitled",
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
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
      {/* Note has an Emoji and is viewable publicly */}
      {!!initialData.icon && preview && (
        <p className="text-6xl py-5">{initialData.icon}</p>
      )}
      {!preview && (
        <div className="group flex items-center gap-x-2.5 py-5">
          {/* Note has an Emoji and is NOT viewable publicly */}
          {!!initialData.icon && (
            <div className="flex items-center gap-x-2 group/icon">
              <IconPicker onChange={onIconSelect}>
                <p className="text-6xl hover:opacity-75 transition">
                  {initialData.icon}
                </p>
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
          )}
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
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words text-foreground/80"
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
}

export default Toolbar;
