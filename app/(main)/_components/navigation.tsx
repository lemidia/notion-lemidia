"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./userItem";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import Item from "./item";
import { toast } from "sonner";
import DocumentList from "./documentList";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import TrashBox from "./trashBox";
import { useSearchStore } from "@/hooks/useSearchStore";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import Navbar from "./navbar";

function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const isMobile = useMediaQuery("(max-width : 768px)");

  // convex client related stuff
  const create = useMutation(api.documents.create);

  const isResizingRef = useRef<boolean>(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  // For Search Dialog open
  const onSearchOpen = useSearchStore((store) => store.onOpen);
  // For Settings Dialog open
  const onSettingsOpen = useSettingsStore((store) => store.onOpen);

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "ew-resize";
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
    document.body.style.cursor = "auto";
  };

  // open side bar on mobile & reset side bar size on desktop
  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0px" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0px";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0px");

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleCreate = async () => {
    const promise = create({ title: "Untitled" });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "new note created!",
      error: "Fail to create a new note.",
    });

    const documentId = await promise;

    router.push(`/documents/${documentId}`);
  };

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && params.documentId) {
      collapse();
    }
  }, [pathname, isMobile]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col w-60 z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        {/* Collapsing sidebar button */}
        <div
          role="button"
          onClick={(e) => collapse(e)}
          className={cn(
            "p-0.5 text-muted-foreground rounded-sm hover:bg-neutral-200 hover:dark:bg-neutral-600 absolute top-2 right-3 opacity-0 transition group-hover/sidebar:opacity-100",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={onSearchOpen} />
          <Item label="Settings" icon={Settings} onClick={onSettingsOpen} />
          <Item onClick={handleCreate} label="New Note" icon={PlusCircle} />
        </div>

        {/* Separator */}
        <div className="mx-2 my-2 h-[1.5px] bg-muted-foreground/50 shrink-0" />

        {/* All the notes are rendered here inside */}
        <div>
          <DocumentList />
        </div>
        {/* Popover */}
        <Popover>
          <PopoverTrigger className="w-full mt-6">
            <Item label="Trash" icon={Trash} />
          </PopoverTrigger>
          {isMobile && isCollapsed ? null : (
            <PopoverContent
              side={isMobile ? "bottom" : "right"}
              className="p-2 w-72 min-h-[190px] mx-2"
            >
              <TrashBox />
            </PopoverContent>
          )}
        </Popover>

        {/* For adjusting width of Sidebar */}
        <div
          onClick={resetWidth}
          onMouseDown={handleMouseDown}
          className={cn(
            "opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0",
            isMobile && "hidden"
          )}
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "fixed top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full",
          isMobile && !isCollapsed && "invisible overflow-x-hidden"
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className="bg-transparent px-3 min-h-[50px] flex items-center w-full">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
}

export default Navigation;
