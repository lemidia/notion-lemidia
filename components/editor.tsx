"use client";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";

import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";
import "@blocknote/core/style.css";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

interface EditorProps {
  documentId: Id<"documents">;
  initialContent?: string;
  preview?: boolean;
}

function Editor({ documentId, initialContent, preview }: EditorProps) {
  const [content, setContent] = useState(initialContent);
  const debouncedContent = useDebounce(content, 1000);

  const update = useMutation(api.documents.update);

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    if (isMounted && !preview) {
      update({ id: documentId, content: debouncedContent });
    }

    setIsMounted(true);
  }, [debouncedContent, documentId, update, preview]);

  const { resolvedTheme } = useTheme();
  const editor: BlockNoteEditor = useBlockNote({
    editable: !preview,
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    onEditorContentChange: (editor) => {
      setContent(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
  });

  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}

export default Editor;
