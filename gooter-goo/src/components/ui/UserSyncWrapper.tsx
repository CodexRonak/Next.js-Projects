"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import {LoadingSpinner} from "./LoadingSpinner";

const UserSyncWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded: isUserLoaded } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convex mutation
  const upsertUser = useMutation(api.users.upsertUser);

  // Sync user when Clerk user is loaded
  useEffect(() => {
    if (!isUserLoaded || !user) {
      return;
    }

    const syncUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await upsertUser({
          userId: user.id,
          name: user.fullName || user.firstName || "User",
          email: user.primaryEmailAddress?.emailAddress || "",
          imageUrl: user.imageUrl || "",
        });
      } catch (err: any) {
        console.error("User sync failed:", err);
        setError(err.message || "Failed to sync user data");
      } finally {
        setIsLoading(false);
      }
    };

    syncUser();
  }, [isUserLoaded, user, upsertUser]);

  // Error State
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white px-6 min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold mb-2">Sync Error</p>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <p className="text-gray-500 text-sm text-center">
            Please try restarting the app or contact support if the issue
            persists.
          </p>
        </div>
      </div>
    );
  }

  // Loading State
  if (!isUserLoaded || isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        message={!isUserLoaded ? "Loading user..." : "Syncing your data..."}
        className="min-h-screen"
      />
    );
  }

  // Main Content
  return <>{children}</>;
};

export default UserSyncWrapper;
