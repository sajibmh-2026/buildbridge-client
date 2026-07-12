"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { FiRefreshCw, FiHome, FiAlertTriangle } from "react-icons/fi";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-emerald-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-8">
          An unexpected error occurred. You can try reloading the page or go back
          to the home page.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={reset}>
            <FiRefreshCw className="mr-2 w-4 h-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline">
              <FiHome className="mr-2 w-4 h-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
