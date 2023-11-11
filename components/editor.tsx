"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";
import "@blocknote/core/style.css";
import { useEffect, useRef, useState } from "react";
import { useDebounce, useMediaQuery } from "usehooks-ts";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { useNavigationStore } from "@/hooks/useNavigationStore";
import { clearTimeout } from "timers";

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

  const isMobile = useMediaQuery("(max-width : 768px)");
  const { isCollapsed: isCollapsedGlobal } = useNavigationStore();

  useEffect(() => {
    if (isMounted && !preview) {
      update({ id: documentId, content: debouncedContent });
    }
  }, [debouncedContent, documentId, update, preview]);

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 500);
  }, []);

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

  if (!isMounted) return null;

  // For prevent editor rendering from being unexpected (overflow x-axis)
  // But Do not apply to Preview page
  if (isMobile && !isCollapsedGlobal && !preview) return null;

  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}

export default Editor;
