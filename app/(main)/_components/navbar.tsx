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
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 h-[50px] w-full flex items-center justify-between">
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
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 h-[50px] w-full flex items-center gap-x-4 overflow-hidden">
        {" "}
        {isCollapsed && (
          <MenuIcon
            onClick={onResetWidth}
            role="button"
            className="h-6 w-6 text-muted-foreground flex-shrink-0"
          />
        )}
        {document ? (
          <div className="flex items-center justify-between flex-1">
            <NavbarTitle initialData={document} />
            <div className="flex items-center gap-x-2">
              <Publish initialData={document} />
              <NavMenu documentId={document._id} />
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
