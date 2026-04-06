"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useState, useEffect, useCallback } from "react";
import { api } from "../../../convex/_generated/api";
import {LoadingSpinner} from "./LoadingSpinner";
import streamClient from "@/lib/stream";
import { createToken } from "../../../actions/createToken";

const UserSyncWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded: isUserLoaded } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convex mutation
    const createOrUpdateUser = useMutation(api.users.upsertUser);
    
    const syncUser = useCallback(async () => {
        if (!user?.id) return;

        try {

          setIsLoading(true);
          setError(null)

          const tokenProvider = async () => {
            if (!user?.id) {
              throw new Error("User is not authenticated");
            }

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

          await streamClient.connectUser(
            {
              id: user.id,
              name:
                user.fullName ||
                user.firstName ||
                user.emailAddresses[0]?.emailAddress ||
                "Unknown User",
              image: user.imageUrl || "",
            }, tokenProvider
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
      await streamClient.disconnectUser()
    } catch (err) {
      console.error ("Failed to disconnect user:" , err);
    }
  },[])

  useEffect(() => {
    if (!isUserLoaded) return;
    if (user) {
      syncUser();
    }
    else {
      disconnectUser();
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if(user) {
        disconnectUser
      }
    };
    
  }, [user, isUserLoaded, isLoading, disconnectUser]);
  
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
