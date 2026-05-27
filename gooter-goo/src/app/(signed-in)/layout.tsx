"use client";

import React from "react";
import { Chat } from "stream-chat-react";
import streamClient from "@/lib/stream";
import UserSyncWrapper from "@/components/ui/UserSyncWrapper";
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
import "stream-chat-react/dist/css/v2/index.css"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserSyncWrapper>
      {/* Wrapper ke andar Chat ko aapka configured client de diya */}
      <Chat client={streamClient}>
        <SidebarProvider>
          {/* Shadcn UI Sidebar */}
          <AppSidebar />

          <SidebarInset>
            {/* Top Common Navbar / Header */}
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

            {/* Content Injection Panel */}
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="min-h-screen flex-1 rounded-xl bg-muted/50 p-6">
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </Chat>
    </UserSyncWrapper>
  );
};

export default Layout;