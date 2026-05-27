"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useState, useEffect, useCallback } from "react";
import { api } from "../../../convex/_generated/api";
import { LoadingSpinner } from "./LoadingSpinner";
import streamClient from "@/lib/stream";
import { createToken } from "../../../actions/createToken";

const UserSyncWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createOrUpdateUser = useMutation(api.users.upsertUser);
    
  const syncUser = useCallback(async () => {
    if (!user?.id) return;

    // Loop protection: Agar user already sahi ID se connected hai toh dubara connect mat karo
    if (streamClient.userID === user.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const tokenProvider = async () => {
        if (!user?.id) throw new Error("User is not authenticated");
        const token = await createToken(user.id);
        return token;
      };
        
      // 1. Save user to Convex
      await createOrUpdateUser({
        userId: user.id,
        name: user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || "Unknown User",
        email: user.emailAddresses[0]?.emailAddress || "",
        imageUrl: user.imageUrl || "",
      });

      // 2. Connect to Stream Chat
      await streamClient.connectUser(
        {
          id: user.id,
          name: user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || "Unknown User",
          image: user.imageUrl || "",
        }, 
        tokenProvider
      );
      
    } catch (err: any) {
      console.error("User sync failed:", err);
      setError(err.message || "Failed to sync user data");
    } finally {
      setIsLoading(false);
    }
  }, [createOrUpdateUser, user]);
      
  const disconnectUser = useCallback(async () => {
    try {
      if (streamClient.userID) {
        await streamClient.disconnectUser();
      }
    } catch (err) {
      console.error("Failed to disconnect user:", err);
    }
  }, []);

  useEffect(() => {
    if (!isUserLoaded) return;

    if (user) {
      syncUser();
    } else {
      disconnectUser();
      setIsLoading(false);
    }

    return () => {
      // Clean up condition properly
      if (!user) {
        disconnectUser();
      }
    };
  }, [user, isUserLoaded, syncUser, disconnectUser]); // ❌ Isme se isLoading hata diya hai loop rokne ke liye
  
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white px-6 min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold mb-2">Sync Error</p>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <p className="text-gray-500 text-sm text-center">
            Please try restarting the app or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }

  if (!isUserLoaded || isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        message={!isUserLoaded ? "Loading user..." : "Syncing your data..."}
        className="min-h-screen"
      />
    );
  }

  return <>{children}</>;
};

export default UserSyncWrapper;