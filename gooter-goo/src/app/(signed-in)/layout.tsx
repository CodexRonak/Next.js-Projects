import UserSyncWrapper from '@/components/ui/UserSyncWrapper'
import streamClient from '@/lib/stream';
import React from 'react'

import { Chat } from "stream-chat-react";

const Layout = ({ children } : { children : React.ReactNode }) => {
  return (
    <UserSyncWrapper>
      <Chat client={streamClient}>
        {children}
      </Chat>
    </UserSyncWrapper>
  );
}

export default Layout