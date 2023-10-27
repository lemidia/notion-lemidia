"use client";

import ConfirmModal from "@/components/modals/confirmModal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProps {
  documentId: Id<"documents">;
}

function Banner({ documentId }: BannerProps) {
  const router = useRouter();
  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const onRemove = async () => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "Removing note...",
      success: "Note removed!",
      error: "Failed to remove note.",
    });

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
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>This note is in the Trash.</p>
      <Button
        size={"sm"}
        onClick={onRestore}
        variant={"default"}
        className="text-white bg-transparent hover:bg-primary/10 border border-white p-1.5 px-2 h-auto"
      >
        Restore Note
      </Button>
      <ConfirmModal onConfirm={() => onRemove()}>
        <Button
          size={"sm"}
          variant={"default"}
          className="text-white bg-black/90 hover:bg-black/70 border p-1.5 px-2 h-auto"
        >
          Remove Forever
        </Button>
      </ConfirmModal>
    </div>
  );
}

export default Banner;
