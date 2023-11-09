"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import {
  Ban,
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  expanded?: boolean;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
}

function Item({
  id,
  documentIcon,
  active,
  isSearch,
  level = 0,
  onExpand,
  expanded,
  label,
  onClick,
  icon: Icon,
}: ItemProps) {
  const { user } = useUser();
  const router = useRouter();
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  // Api : Create a new note
  const create = useMutation(api.documents.create);
  const onCreate = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    if (!id) return;

    if (level >= 3) {
      toast.error("Note creation levels are limited to a maximum of 4 depth");
      return;
    }

    const promise = create({ parentDocument: id, title: "Untitled" });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });

    // When promise do rejection then we do nothing below
    const createdDocumentId = await promise;

    if (!expanded) {
      onExpand?.();
    }

    router.push(`/documents/${createdDocumentId}`);
  };

  // Api : Do Soft-Delete the note and also do all the child notes of that recursively by marking its field of 'Archive' as true
  const archive = useMutation(api.documents.archive);

  const onArchive = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;

    const promise = archive({ id: id });

    toast.promise(promise, {
      loading: "Moving trash...",
      success: "Note moved to trash!",
      error: "Failed to moved to trash.",
    });
  };

  return (
    <div
      role="button"
      onClick={onClick}
      className={cn(
        "group h-8 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
    >
      {!!id && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onExpand?.();
          }}
          role="button"
          className="p-0.5 rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
        >
          <ChevronIcon className="h-5 w-5 shrink-0 text-muted-foreground/70" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px] pl-0.5">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] mr-1 text-muted-foreground" />
      )}

      <span className="truncate text-sm">{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          CMD+K
        </kbd>
      )}

      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div
                onClick={(e) => e.stopPropagation()}
                className="p-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                role="button"
              >
                <MoreHorizontal className="h-5 w-5 text-muted-foreground/60" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-muted-foreground p-2 py-1.5 text-xs">
                Last edited by : {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Note creation not allowed from level 3 or deep */}
          <div
            role="button"
            onClick={onCreate}
            className="p-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            {level >= 3 ? (
              <Ban className="h-5 w-5 text-muted-foreground/60" />
            ) : (
              <Plus className="h-5 w-5 text-muted-foreground/60" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

Item.skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      className="flex gap-x-3 h-8 items-center"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
    >
      <Skeleton className="h-5 w-5" />
      <Skeleton className="h-5 w-[30%]" />{" "}
    </div>
  );
};

export default Item;
