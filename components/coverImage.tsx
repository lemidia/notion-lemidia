"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImageStore } from "@/hooks/useCoverImageStore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { useParams } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

const CoverImage = ({ url, preview }: CoverImageProps) => {
  const { onOpen, onReplace } = useCoverImageStore();
  const { documentId } = useParams();

  const { edgestore } = useEdgeStore();

  const update = useMutation(api.documents.update);

  const onCoverImageRemove = async (url: string) => {
    let status: string | undefined;
    try {
      status = await update({
        id: documentId as Id<"documents">,
        coverImage: "undefined",
      });

      await edgestore.publicFiles.delete({
        url: url,
      });
    } catch (err) {
      // if storage uploading was fail
      if (status) {
        await update({
          id: documentId as Id<"documents">,
          coverImage: url,
        });
      }
    }
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
      {url && !preview && (
        <div className="md:opacity-0 opacity-100 group-hover:opacity-100  absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => onReplace(url)}
            size={"sm"}
            variant={"outline"}
            className="text-xs flex-shrink-0"
          >
            <ImageIcon className="mr-2 w-5 h-5" />
            Change Cover
          </Button>
          <Button
            onClick={() => onCoverImageRemove(url)}
            size={"sm"}
            variant={"outline"}
            className="text-xs flex-shrink-0"
          >
            <X className="mr-2 w-5 h-5" />
            Remove Cover
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
