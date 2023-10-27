"use client";

import { useQuery } from "convex/react";
import { File } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "../components/ui/command";

import { useSearchStore } from "@/hooks/useSearchStore";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const documents = useQuery(api.documents.getSearch);

  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearchStore((store) => store.toggle);
  const isOpen = useSearchStore((store) => store.isOpen);
  const onClose = useSearchStore((store) => store.onClose);

  const onSelect = (id: Id<"documents">) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.fullName}'s Notion`} />
      <CommandList>
        <CommandEmpty>No results found. </CommandEmpty>
        <CommandGroup heading="Notes">
          {documents?.map((doc) => (
            <CommandItem
              key={doc._id}
              value={`${doc._id}-${doc.title}`}
              title={doc.title}
              onSelect={() => onSelect(doc._id)}
            >
              {doc.icon ? (
                <p className="mr-2 text-[18px]">{doc.icon}</p>
              ) : (
                <File className="w-4 h-4 mr-2" />
              )}
              <span>{doc.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommand;
