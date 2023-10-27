"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function Heading() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-4 flex flex-col items-center">
      <h1 className="text-3xl sm:text-5xl md:tet-6xl font-bold">
        Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
        <span className="underline">Notion</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Notion is the connected workspace where better faster work happens.
      </h3>
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href={"/documents"}>
            Enter Notion <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      )}
    </div>
  );
}

export default Heading;
