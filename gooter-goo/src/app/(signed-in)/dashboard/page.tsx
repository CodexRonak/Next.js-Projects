"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  useChatContext,
  Window,
} from "stream-chat-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/Button";
import { LogOutIcon, VideoIcon } from "lucide-react";

function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const { channel, setActiveChannel } = useChatContext();
  const { setOpen } = useSidebar();

  const handleCall = () => {
    if (!channel?.id) return;
    router.push(`/dashboard/video-call/${channel.id}`);
    setOpen(false);
  };

  const handleLeaveChat = async () => {
    if (!channel || !user?.id) {
      console.log("No active channel or user found");
      return;
    }

    // confirmation dialog before leaving the chat
    const confirm = window.confirm("Are you sure you want to leave this chat?");
    if (!confirm) return;
    try {
      // Remove current user from the channel members list
      await channel.removeMembers([user.id]);

      //Clear active channel
      setActiveChannel(undefined);

      //Redirect to dashboard after leaving the chat
      router.push("/dashboard");
    } catch (error) {
      console.error("Error leaving chat:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {channel ? (
        <Channel className="flex flex-col h-full">
          <Window className="flex flex-col h-full">
            {/* Channel Top Header Section */}
            <div className="flex items-center justify-between p-4 border-b shrink-0">
              {channel.data?.member_count === 1 ? (
                <ChannelHeader title="Everyone else has left this chat!" />
              ) : (
                <ChannelHeader />
              )}

              {/* Right Side Video Call Action Button */}
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleCall}>
                  <VideoIcon className="w-4 h-4" />
                  Video Call
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLeaveChat}
                  className="text-red-500 hover:bg-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <LogOutIcon className="w-4 h-4" />
                  Leave Chat
                </Button>
              </div>
            </div>
            <MessageList className="flex-1 overflow-y-auto" />

            <div className="shrink-0 p-2 border-t">
              <MessageInput />
            </div>
          </Window>
          <Thread />
        </Channel>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
            No chat selected
          </h2>
          <p className="text-muted-foreground">
            Select a chat from the sidebar or start a new conversation
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
