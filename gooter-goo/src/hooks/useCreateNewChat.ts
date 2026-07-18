import streamClient from "@/lib/stream";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { upsertStreamUser } from "../../actions/upsertStreamUser";

export const useCreateNewChat = () => {
  const allConvexUsers = useQuery(api.users.getAllUsers) || [];

  const createNewChat = async ({
    members,
    created_by,
    group_name,
  }: {
    members: string[];
    created_by: string;
    group_name?: string;
  }) => {
    const isGroupChat = members.length > 2;

    // First: Upsert all members to StreamChat via server action
    for (const memberId of members) {
      // Find user in Convex to get name/image
      const convexUser = allConvexUsers.find((u) => u.userId === memberId);
      if (convexUser) {
        await upsertStreamUser(
          convexUser.userId,
          convexUser.name,
          convexUser.imageUrl,
        );
      }
    }

    // Create New Channel
    const channelId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    try {
      const channelData: {
        members: string[];
        created_by_id: string;
        name?: string;
      } = {
        members,
        created_by_id: created_by,
      };

      if (isGroupChat) {
        channelData.name =
          group_name || `Group Chat (${members.length} members)`;
      }

      const channel = streamClient.channel(
        isGroupChat ? "team" : "messaging",
        channelId,
        channelData,
      );

      // Channel initialize aur event subscription
      await channel.watch({
        presence: true,
      });

      return channel;
    } catch (error) {
      console.error("Error creating channel:", error);
      throw error;
    }
  };

  return createNewChat;
};
