"use client";

import { Doc } from "@/convex/_generated/dataModel";
import IconPicker from "./icon-picker";
import { Button } from "./ui/button";
import { Image as ImageIcon, Smile, X } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImageStore } from "@/hooks/useCoverImageStore";

interface ToolbarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}

function Toolbar({ initialData, preview }: ToolbarProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const update = useMutation(api.documents.update);

  const { onOpen } = useCoverImageStore();

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
    <div className="pl-[54px] group relative">
      {/* Note has an Emoji and is NOT viewable publicly */}
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
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
      {/* Note has an Emoji and is viewable publicly */}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker onChange={onIconSelect} asChild>
            <Button
              className="text-muted-foreground text-xs bg-transparent"
              variant={"outline"}
              size={"sm"}
            >
              <Smile className="mr-2 h-4 w-4" /> Add Icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            className="text-muted-foreground text-xs bg-transparent"
            variant={"outline"}
            size={"sm"}
            onClick={onOpen}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Cover
          </Button>
        )}
      </div>
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
