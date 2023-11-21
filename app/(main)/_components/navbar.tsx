"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import NavbarTitle from "./navbarTitle";
import Banner from "./banner";
import NavMenu from "./navMenu";
import Publish from "./publish";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

function Navbar({ isCollapsed, onResetWidth }: NavbarProps) {
  const params = useParams();
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });

  // loading
  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1f1f1f] px-2.5 h-[50px] w-full flex items-center justify-between">
        <NavbarTitle.Skeleton />
        <div className="flex items-center gap-x-2">
          <Publish.Skeleton />
          <NavMenu.Skeleton />
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={cn(
          "bg-background/80 dark:bg-[#1f1f1f]/80 backdrop-blur-sm px-2.5 h-[50px] w-full flex items-center gap-x-3 min-w-0"
        )}
      >
        {isCollapsed && (
          <Button
            variant={"ghost"}
            size={"icon"}
            className="w-8 h-8 dark:hover:bg-neutral-700"
          >
            <MenuIcon
              onClick={onResetWidth}
              role="button"
              className="h-6 w-6 flex-shrink-0"
            />
          </Button>
        )}
        {document ? (
          <div className="flex items-center justify-between flex-1 min-w-0">
            <NavbarTitle initialData={document} />
            <div className="flex items-center gap-x-2">
              <Publish initialData={document} />
              <NavMenu
                documentId={document._id}
                storageId={document.storageId}
                icon={document.icon}
                isArchived={document.isArchived}
              />
            </div>
          </div>
        ) : (
          <p className="font-semibold font-sm">Note not found</p>
        )}
      </nav>
      {document?.isArchived && <Banner documentId={document._id} />}
    </>
  );
}

export default Navbar;
