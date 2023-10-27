"use client";

import CoverImage from "@/components/coverImage";
import { ModeToggle } from "@/components/themeToggle";
// import Editor from "@/components/editor";
import Toolbar from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface DocumentProps {
  params: {
    documentId: Id<"documents">;
  };
}

// If a note is not published or is set to archived then only user that owns the note can see it.
const Preview = ({ params: { documentId } }: DocumentProps) => {
  const document = useQuery(api.documents.getById, { documentId: documentId });

  if (document === undefined) {
    return (
      <>
        <CoverImage.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10 pl-8">
          <div className="space-y-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="pb-10 overflow-x-hidden h-full relative">
      <div className="absolute top-3 right-3 md:top-4 md:right-4 z-[99999]">
        <ModeToggle />
      </div>
      <CoverImage url={document.coverImage} preview />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto w-full space-y-8">
        <Toolbar initialData={document} preview />
        <Editor
          documentId={documentId}
          initialContent={document.content}
          preview
        />
      </div>
    </div>
  );
};

export default Preview;
