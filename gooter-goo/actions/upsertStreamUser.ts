"use server";

import { serverClient } from "@/lib/streamServer";

export async function upsertStreamUser(userId: string, name: string, imageUrl: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  await serverClient.upsertUser({
    id: userId,
    name,
    image: imageUrl,
  });
}
