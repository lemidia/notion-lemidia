"use client";

import { Id } from "@/convex/_generated/dataModel";

interface MenuProps {
  documentId: Id<"documents">;
}

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
import { MoreHorizontal, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function NavMenu({ documentId }: MenuProps) {
  const router = useRouter();
  const { user } = useUser();
  const archive = useMutation(api.documents.archive);
  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const onArchive = () => {
    const promise = archive({ id: documentId });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to move note to trash.",
    });
  };

  const onRemove = async () => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "Removing note...",
      success: "Note removed!",
      error: "Failed to remove note.",
    });

    await promise;

    // If promise has been fulfilled, below code will run
    router.replace("/documents");
  };

  const onRestore = () => {
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="rounded-full w-8 h-8"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
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
  );
}

NavMenu.Skeleton = function NavMenuSkeleton() {
  return <Skeleton className="h-8 w-8 rounded-full" />;
};

export default NavMenu;
