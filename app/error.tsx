"use client";

import { Button } from "@/components/ui/button";
import { ConvexError, Value } from "convex/values";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Error = ({ error }: { error: Error | ConvexError<Value> }) => {
  const router = useRouter();

  const errorMessage =
    error instanceof ConvexError
      ? error.data.message
        ? error.data.message
        : error.data
        ? error.data
        : "Something went wrong!"
      : "Something went wrong!";

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-6 px-10">
      <Image
        src={"/error.png"}
        height={300}
        width={300}
        alt="Error"
        className="dark:hidden"
      />
      <Image
        src={"/error-dark.png"}
        height={300}
        width={300}
        alt="Error"
        className="hidden dark:block"
      />
      <h2 className="text-center text-semibold text-2xl">{errorMessage}</h2>

      <Button
        onClick={() => router.back()}
        variant={"secondary"}
        className="font-semibold"
      >
        Go Back
      </Button>
    </div>
  );
};

export default Error;
