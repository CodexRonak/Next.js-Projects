import UserSyncWrapper from '@/components/ui/UserSyncWrapper'
import React from 'react'

const Layout = ({ children } : { children : React.ReactNode }) => {
  return (
    <UserSyncWrapper>{ children }</UserSyncWrapper>
  )
}

export default Layout