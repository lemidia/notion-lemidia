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

  return (
    <div className="w-full bg-rose-500 text-center p-2 text-white flex items-center gap-x-2 justify-center">
      <p className="font-medium">This note is in the Trash.</p>

      {/* <ConfirmModal onConfirm={() => onRemove()}>
        <Button
          size={"sm"}
          variant={"default"}
          className="text-white bg-black/90 hover:bg-black/70 border p-1.5 px-2 h-auto"
        >
          Remove Forever
        </Button>
      </ConfirmModal> */}
    </div>
  );
}

export default Banner;
