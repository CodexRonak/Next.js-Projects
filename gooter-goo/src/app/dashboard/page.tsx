"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";

// Stream Chat Client (best practice: ek alag file mein banao, jaise lib/stream-client.ts)
const chatClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!   // .env.local mein daal do
);

export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();

  // User ko Stream se connect karo
  useEffect(() => {
    if (!isSignedIn || !user?.id || !isLoaded) return;

    const connectUser = async () => {
      try {
        await chatClient.connectUser(
          {
            id: user.id,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            image: user.imageUrl,
          },
          // Development ke liye (production mein proper token backend se lao)
          chatClient.devToken(user.id)
        );
      } catch (error) {
        console.error("Stream connect error:", error);
      }
    };

    connectUser();

    // Cleanup on unmount
    return () => {
      chatClient.disconnectUser();
    };
  }, [isSignedIn, user, isLoaded]);

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Chat client={chatClient}>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          {/* Top bar */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
              <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
              <p>Yahan apna saara dashboard content daal do...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Chat>
  );
}