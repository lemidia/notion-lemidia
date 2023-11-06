"use client";

import CoverImage from "@/components/coverImage";
// import Editor from "@/components/editor";
import Toolbar from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

import dynamic from "next/dynamic";
import { useEffect } from "react";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface DocumentProps {
  params: {
    documentId: Id<"documents">;
  };
}

const Document = ({ params: { documentId } }: DocumentProps) => {
  const document = useQuery(api.documents.getById, { documentId: documentId });

  if (document === undefined) {
    return (
      <div className="pt-[50px]">
        <CoverImage.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10 pl-8">
          <div className="space-y-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <p>Note not found.</p>;
  }

  return (
    <div className="pt-[50px] pb-12 min-w-[300px] overflow-y-scroll">
      <CoverImage url={document.coverImage} storageId={document.storageId} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto w-full space-y-8">
        <Toolbar initialData={document} />
        <Editor documentId={documentId} initialContent={document.content} />
      </div>
    </div>
  );
};

export default Document;
