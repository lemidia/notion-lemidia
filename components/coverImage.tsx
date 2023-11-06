"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { RefreshCcw, X } from "lucide-react";
import { useCoverImageStore } from "@/hooks/useCoverImageStore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { useParams } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

interface CoverImageProps {
  url?: string;
  storageId?: string;
  preview?: boolean;
}

const CoverImage = ({ url, storageId, preview }: CoverImageProps) => {
  const { onOpen, onReplace } = useCoverImageStore();
  const { documentId } = useParams();

  console.log(url);

  const update = useMutation(api.documents.update);
  const deleteStorageId = useMutation(api.images.deleteStorageId);

  const onCoverImageRemove = async () => {
    if (!storageId) return;
    // Remove storageId for this documents
    await deleteStorageId({ storageId });
    await update({ id: documentId as Id<"documents">, storageId: "undefined" });

    // Legacy code

    // let status: string | undefined;
    // try {
    //   status = await update({
    //     id: documentId as Id<"documents">,
    //     coverImage: "undefined",
    //   });

    //   await edgestore.publicFiles.delete({
    //     url: url,
    //   });
    // } catch (err) {
    //   // if storage uploading was fail
    //   if (status) {
    //     await update({
    //       id: documentId as Id<"documents">,
    //       coverImage: url,
    //     });
    //   }
    // }
  };
  return (
    <div
      className={cn(
        "relative w-full group",
        !url && "h-[8vh]",
        url && "bg-muted h-[25vh] md:h-[30vh]"
      )}
    >
      {!!url && <Image src={url} fill alt="Cover" className="object-cover" />}
      {storageId && !preview && (
        <div className="md:opacity-0 opacity-100 group-hover:opacity-100  absolute bottom-3 right-3 flex items-center gap-x-3">
          <Button
            onClick={() => onReplace(storageId)}
            size={"sm"}
            variant={"secondary"}
            className="text-xs flex-shrink-0 px-2 sm:px-3 bg-secondary/70"
            aria-label="Change cover image"
          >
            <RefreshCcw className="w-5 h-5" />
            <span className="ml-2 hidden sm:inline">Change Cover</span>
          </Button>
          <Button
            onClick={() => onCoverImageRemove()}
            size={"sm"}
            variant={"secondary"}
            className="text-xs flex-shrink-0 px-2 sm:px-3 bg-secondary/70"
            aria-label="Remove cover image"
          >
            <X className="w-5 h-5" />
            <span className="ml-2 hidden sm:inline">Remove Cover</span>
          </Button>
        </div>
      )}
    </div>
  );
};

CoverImage.Skeleton = function CoverImageSkeleton() {
  return <Skeleton className="w-full h-[12vh]" />;
};

export default CoverImage;
