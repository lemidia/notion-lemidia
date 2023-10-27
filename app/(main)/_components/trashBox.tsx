"use client";

import ConfirmModal from "@/components/modals/confirmModal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

function TrashBox() {
  const router = useRouter();
  const params = useParams();
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const documents = useQuery(api.documents.getTrash);
  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) =>
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

  if (documents === undefined) {
    return (
      <div className="h-[200px] flex items-center justify-center p-4">
        <Spinner size={"lg"} />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-2">
        <Search className="h-5 w-5" />
        <Input
          value={search}
          placeholder="Filter by note title..."
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-1 focus-visible:ring-offset-0 bg-muted text-muted-foreground"
        />
      </div>
      <div className="mt-2">
        <p className="hidden last:block text-xs text-center text-muted-foreground">
          No Notes found.
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => onClick(document._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center justify-between text-primary p-1"
          >
            <span className="truncate pl-1">{document.title}</span>

            <div className="flex items-center">
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
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrashBox;
