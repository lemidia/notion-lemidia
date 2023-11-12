"use client";

import { cn } from "@/lib/utils";
import {
  ArrowLeftFromLine,
  MenuIcon,
  Plus,
  Search,
  Settings,
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

import { useSearchStore } from "@/hooks/useSearchStore";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import Navbar from "./navbar";
import Trash from "./trash";
import { Button } from "@/components/ui/button";
import { useNavigationStore } from "@/hooks/useNavigationStore";

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
  const { onCollapsed: onCollapsedGlobal, onExpand: onExpandGlobal } =
    useNavigationStore();

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
      onExpandGlobal();
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
      onCollapsedGlobal();
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
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col w-60 z-[99999] overflow-x-hidden",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div className="relative">
          {/* Collapsing sidebar button */}
          <div
            role="button"
            onClick={(e) => collapse(e)}
            className={cn(
              "p-1.5 text-muted-foreground hover:bg-neutral-200 hover:dark:bg-neutral-700 absolute top-3.5 right-3.5 opacity-0 transition group-hover/sidebar:opacity-100 flex items-center justify-center rounded-md",
              isMobile && "opacity-100"
            )}
          >
            <ArrowLeftFromLine className="h-5 w-5" />
          </div>
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={onSearchOpen} />
          <Item label="Settings" icon={Settings} onClick={onSettingsOpen} />
          <Item onClick={handleCreate} label="New Note" icon={Plus} />
        </div>

        {/* Separator */}
        <div className="mx-2 my-2 h-[1px] bg-muted-foreground/50 shrink-0" />

        {/* All the notes are rendered here inside */}
        <div>
          <DocumentList />
        </div>
        {/* Trash Popover */}
        <Trash isMobile={isMobile} isCollapsed={isCollapsed} />

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
          <nav className="bg-transparent px-2.5 min-h-[50px] flex items-center w-full">
            {isCollapsed && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="w-8 h-8 dark:hover:bg-neutral-700"
              >
                <MenuIcon
                  onClick={resetWidth}
                  role="button"
                  className="h-6 w-6 flex-shrink-0"
                />
              </Button>
            )}
          </nav>
        )}
      </div>
    </>
  );
}

export default Navigation;
