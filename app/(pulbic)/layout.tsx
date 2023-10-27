"use client";

import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";

function PublicLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={"icon"} />
      </div>
    );
  }

  return <div className="h-full dark:bg-[#1F1F1F]">{children}</div>;
}

export default PublicLayout;
