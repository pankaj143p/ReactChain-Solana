"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { useAuthStore } from "../store/authStore";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { token, setAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, [setAuth]);

  if (token === null) {
    // Initial load
    return <Skeleton className="w-full h-screen" />;
  }

  if (!token) {
    router.push("/");
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect and authenticate your wallet to continue.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
