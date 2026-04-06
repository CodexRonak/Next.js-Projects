"use server";

import { serverClient } from "@/lib/streamServer";

export async function createToken(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const token = serverClient.createToken(userId);
  return token;
}
