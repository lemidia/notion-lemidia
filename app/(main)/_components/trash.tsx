"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Item from "./item";
import { Trash as TrashIcon } from "lucide-react";
import TrashBox from "./trashBox";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface TrashProps {
  isMobile: boolean;
  isCollapsed: boolean;
}

function Trash({ isMobile, isCollapsed }: TrashProps) {
  const archivedItems = useQuery(api.documents.getTrash);

  return (
    <Popover>
      <PopoverTrigger className="w-full mt-6">
        <Item
          label="Trash"
          icon={TrashIcon}
          {...(archivedItems?.length && { badge: archivedItems.length })}
        />
      </PopoverTrigger>
      {isMobile && isCollapsed ? null : (
        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          side={isMobile ? "bottom" : "right"}
          className="p-0 w-72 min-h-[190px] mx-2 border border-input overflow-hidden"
        >
          <TrashBox archivedItems={archivedItems} />
        </PopoverContent>
      )}
    </Popover>
  );
}

export default Trash;
