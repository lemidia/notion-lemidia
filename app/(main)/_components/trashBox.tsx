"use client";

import ConfirmModal from "@/components/modals/confirmModal";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Search, Trash, Undo, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface TrashBoxProps {
  archivedItems?: Doc<"documents">[];
}

function TrashBox({ archivedItems }: TrashBoxProps) {
  const router = useRouter();
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);
  const clearTrash = useMutation(api.documents.clearTrash);

  const [search, setSearch] = useState("");

  const filteredDocuments = archivedItems?.filter((document) =>
    document.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

  const onClick = (documentId: Id<"documents">) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    e.stopPropagation();
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    });
  };

  const onRemove = async (documentId: Id<"documents">) => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "Removing note...",
      success: "Note removed!",
      error: "Failed to remove note.",
    });

    // TODO:
    // After removing mutation, do query whether there is a note whose id matches current "documentId" params of the URL. In other words check whether a user currently is accessing the delete note on the page.
    // If there is no matching note that means that note has been permanently removed from DB, then redirect user to "/document" page for preventing a user accessing and editing for that note anymore.

    router.replace("/documents");
  };

  const onClearTrash = async () => {
    const promise = clearTrash();

    toast.promise(promise, {
      loading: "Clear trash...",
      success: "Trash cleared!",
      error: "Failed to clear trash.",
    });

    router.replace("/documents");
  };

  // Fetching related items...
  if (archivedItems === undefined) {
    return (
      <div className="h-[190px] flex items-center justify-center">
        <Spinner size={"lg"} />
      </div>
    );
  }

  return (
    <>
      <div className="text-sm min-h-[170px] max-h-[220px] flex flex-col">
        <div className="flex items-center gap-x-2 bg-background">
          <Search className="h-6 w-6" />
          <Input
            value={search}
            placeholder="Filter by note title..."
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 px-2 focus-visible:ring-1 focus-visible:ring-offset-0 bg-muted text-muted-foreground text-base"
          />
        </div>
        <div className="mt-2 flex-1 overflow-y-scroll">
          <p className="hidden last:block text-[13px] text-center text-muted-foreground">
            No notes in trash box.
          </p>
          {filteredDocuments?.map((document) => (
            <div
              key={document._id}
              role="button"
              onClick={() => onClick(document._id)}
              className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary p-1"
            >
              {document.icon && (
                <span className="text-lg mr-0.5">{document.icon}</span>
              )}
              <span className="truncate pl-1 text-muted-foreground font-medium">
                {document.title}
              </span>

              <div className="flex items-center ml-auto">
                <div
                  role="button"
                  className="rounded-sm p-2 text-muted-foreground hover:bg-primary/10"
                  onClick={(e) => onRestore(e, document._id)}
                >
                  <Undo className="h-4 w-4 text-muted-foreground" />
                </div>
                <ConfirmModal onConfirm={() => onRemove(document._id)}>
                  <div
                    role="button"
                    className="rounded-sm p-2 text-muted-foreground hover:bg-primary/10"
                  >
                    <X
                      className="h-4 w-4 text-muted-foreground"
                      strokeWidth={2.6}
                    />
                  </div>
                </ConfirmModal>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!search && archivedItems.length > 0 && (
        <ConfirmModal onConfirm={onClearTrash} asChild>
          <Button
            disabled={!!search || archivedItems.length === 0}
            className="bg-red-500 hover:bg-red-500/90 text-white font-bold w-full mt-2"
          >
            Clear {archivedItems.length} item
            {archivedItems.length > 1 && "s"}
          </Button>
        </ConfirmModal>
      )}
    </>
  );
}

export default TrashBox;
