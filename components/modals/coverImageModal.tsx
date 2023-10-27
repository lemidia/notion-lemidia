"use client";

import { useEffect, useRef, useState } from "react";
import { SingleImageDropzone } from "../singleImageDropzone";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { useCoverImageStore } from "@/hooks/useCoverImageStore";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

function CoverImageModal() {
  const { documentId } = useParams();
  const update = useMutation(api.documents.update);
  const { isOpen, onClose: modalClose, urlToBeReplaced } = useCoverImageStore();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { edgestore } = useEdgeStore();

  const edgestoreResRef = useRef<any>();

  // When modal closed, sets file to undefined
  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    modalClose();
  };

  const onChange = async (file?: File) => {
    if (!file) {
      setFile(undefined);
      return;
    }

    setIsSubmitting(true);
    setFile(file);

    edgestoreResRef.current = undefined;

    try {
      edgestoreResRef.current = await edgestore.publicFiles.upload({
        file,
        ...(urlToBeReplaced && {
          options: { replaceTargetUrl: urlToBeReplaced },
        }),
      });

      await update({
        id: documentId as Id<"documents">,
        coverImage: edgestoreResRef.current.url,
      });
    } catch (err) {
      // When failed to upload the url to Convex DB then we do rollback operation on edgestore storage uploading just above
      if (edgestoreResRef.current?.url && !urlToBeReplaced) {
        await edgestore.publicFiles.delete({
          url: edgestoreResRef.current.url,
        });
        // When failed to operate on replacing a file on Convex DB then we remove file
      } else if (edgestoreResRef.current?.url && urlToBeReplaced) {
        await edgestore.publicFiles.delete({
          url: edgestoreResRef.current.url,
        });
      }
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-2xl text-center font-semibold">Cover Image</h2>
        </DialogHeader>
        <div className="flex justify-center mt-2">
          <SingleImageDropzone
            disabled={isSubmitting}
            width={300}
            height={250}
            value={file}
            onChange={onChange}
            dropzoneOptions={{ maxSize: 1024 * 1024 * 2 }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CoverImageModal;
