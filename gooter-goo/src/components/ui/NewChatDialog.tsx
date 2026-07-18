"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useChatContext } from "stream-chat-react";
import { Doc } from "../../../convex/_generated/dataModel";
import { useCreateNewChat } from "@/hooks/useCreateNewChat";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserSearch from "./UserSearch";
import { XIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button"; // Tumhara shadcn/custom button component
import { Input } from "@base-ui/react/input"; // Base UI ka exact Input primitive

interface NewChatDialogProps {
  children: React.ReactElement;
}

export function NewChatDialog({ children }: NewChatDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Doc<"users">[]>([]);
  const [groupName, setGroupName] = useState("");

  const createNewChat = useCreateNewChat();
  const { user } = useUser();
  const { setActiveChannel } = useChatContext();

  const handleSelectUser = (users: Doc<"users">) => {
    if (!selectedUsers.find((u) => u.userId === users.userId)) {
      setSelectedUsers((prev) => [...prev, users]);
    }
  };

  const removeUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.userId !== userId));
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedUsers([]);
      setGroupName("");
    }
  };

  const handleCreateChat = async () => {
    const totalMembers = selectedUsers.length + 1; // +1 for the current user
    const isGroupChat = totalMembers > 2;

    // ✅ FIXED: Backend API Object requirements ke anusar variables ko align kiya hai
    const channelName = await createNewChat({
      members: [user?.id as string, ...selectedUsers.map((u) => u.userId)],
      created_by: user?.id as string, // camelCase se badal kar snake_case kiya
      group_name: isGroupChat ? groupName.trim() || undefined : undefined, // camelCase se badal kar snake_case kiya
    });
    setActiveChannel(channelName);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children} />

      <DialogContent className="sm:max-w-125 max-h-[80vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Start a New Chat</DialogTitle>
          <DialogDescription>
            Select users to start a new conversation with
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-y-auto overflow-x-hidden">
          <UserSearch onSelectUser={handleSelectUser} className="w-full" />

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">
                Selected Users ({selectedUsers.length})
              </h4>

              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {selectedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2 bg-muted/50 border border-border rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Image
                        src={user.imageUrl}
                        alt={user.name}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeUser(user.userId)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group Name Input for Group Chats */}
          {selectedUsers.length > 1 && (
            <div className="space-y-2">
              <label
                htmlFor="groupName"
                className="text-sm font-medium text-foreground"
              >
                Group Name (Optional)
              </label>

              <Input
                id="groupName"
                type="text"
                placeholder="Enter a name for your group chat..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />

              <p className="text-xs text-muted-foreground">
                Leave empty to use default name: &quot;Group chat (
                {selectedUsers.length + 1} members)&quot;
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 mt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={selectedUsers.length === 0}
            onClick={handleCreateChat}
          >
            {selectedUsers.length > 1
              ? `Create Group Chat (${selectedUsers.length + 1} members)`
              : selectedUsers.length === 1
                ? "Start Chat"
                : "Create Chat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
