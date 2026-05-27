import streamClient from "@/lib/stream";

export const useCreateNewChat = () => {
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

    // Check for existing 1-on-1 chat
    if (!isGroupChat) {
      const existingChannels = await streamClient.queryChannels(
        {
          type: "messaging",
          members: { $eq: members },
        },
        [{ created_at: -1 }], 
        { limit: 1 }
      );

      if (existingChannels.length > 0) {
        const channel = existingChannels[0];
        const channelMembers = Object.keys(channel.state.members);
        if (
          channelMembers.length === 2 && 
          members.length === 2 && 
          members.every((member) => channelMembers.includes(member))
        ) {
          console.log("Existing 1-on-1 channel found:");
          return channel;
        }
      }
    }

    // Create New Channel (Ab yeh function scope ke andar hai)
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
        channelData.name = group_name || `Group Chat (${members.length} members)`; 
    }

      const channel = streamClient.channel(
        isGroupChat ? "team" : "messaging",
        channelId,
        channelData
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