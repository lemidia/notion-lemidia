"use client";

import { Id } from "@/convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ImagePlus, MoreVertical, SmilePlus, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCoverImageStore } from "@/hooks/useCoverImageStore";
import IconPicker from "@/components/icon-picker";
import { TooltipButton } from "@/components/tooltipButton";
import { PopoverTrigger } from "@/components/ui/popover";

interface MenuProps {
  documentId: Id<"documents">;
  storageId?: string;
  icon?: string;
  isArchived: boolean;
}

function NavMenu({ documentId, storageId, icon, isArchived }: MenuProps) {
  const router = useRouter();
  const { user } = useUser();
  const archive = useMutation(api.documents.archive);

  const update = useMutation(api.documents.update);

  const { onOpen } = useCoverImageStore();

  const onArchive = () => {
    const promise = archive({ id: documentId });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to move note to trash.",
    });
  };

  const handleIconChange = (icon: string) => {
    update({ id: documentId, icon: icon });
  };

  return (
    <>
      <DropdownMenu>
        <TooltipButton tooltipMessage={"More"} asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="rounded-full w-8 h-8 flex lg:hidden dark:hover:bg-neutral-700"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipButton>
        <DropdownMenuContent
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-60 flex flex-col items-stretch"
          align="end"
          alignOffset={8}
          forceMount
        >
          <DropdownMenuItem
            onClick={onOpen}
            disabled={!!storageId}
            className="h-[34px] font-normal"
          >
            <ImagePlus className="h-4 w-4 mr-2" /> Add Cover
          </DropdownMenuItem>
          <IconPicker onChange={handleIconChange}>
            <PopoverTrigger asChild>
              <Button
                className="p-2 h-[34px] bg-background text-white hover:bg-muted w-full justify-start text-primary font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={!!icon}
              >
                <SmilePlus className="h-4 w-4 mr-2" /> Add Emoji
              </Button>
            </PopoverTrigger>
          </IconPicker>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isArchived}
            onClick={onArchive}
            className="text-orange-600 focus:text-orange-600 font-semibold"
          >
            <Trash className="h-4 w-4 mr-2" /> Soft Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* for Desktop */}
      <div className="hidden lg:flex items-center gap-x-1.5">
        <TooltipButton tooltipMessage={"Add Cover"} asChild>
          <Button
            disabled={!!storageId}
            onClick={onOpen}
            variant={"ghost"}
            size={"icon"}
            aria-label="add cover"
            className="rounded-full w-8 h-8 dark:hover:bg-neutral-700"
          >
            <ImagePlus className="h-5 w-5" />
          </Button>
        </TooltipButton>

        <IconPicker onChange={handleIconChange}>
          <TooltipButton tooltipMessage={"Add Emoji"} asChild>
            <PopoverTrigger asChild>
              <Button
                disabled={!!icon}
                variant={"ghost"}
                size={"icon"}
                aria-label="add emoji"
                className="rounded-full w-8 h-8 dark:hover:bg-neutral-700"
              >
                <SmilePlus className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
          </TooltipButton>
        </IconPicker>

        <div className="h-6 w-[1.3px] rounded-md bg-muted-foreground" />

        <TooltipButton tooltipMessage={"Soft Delete"} asChild>
          <Button
            disabled={isArchived}
            onClick={onArchive}
            variant={"ghost"}
            size={"icon"}
            aria-label="soft delete"
            className="rounded-full w-8 h-8 hover:text-orange-600 dark:hover:bg-neutral-700"
          >
            <Trash className="h-5 w-5" />
          </Button>
        </TooltipButton>
      </div>
    </>
  );
}

NavMenu.Skeleton = function NavMenuSkeleton() {
  return <Skeleton className="h-8 w-8 rounded-full" />;
};

export default NavMenu;
