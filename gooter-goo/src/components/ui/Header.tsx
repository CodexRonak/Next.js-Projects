"use client"
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { Authenticated, Unauthenticated } from 'convex/react';
import { UserButton, SignInButton } from '@clerk/nextjs';
// import { Button } from '@base-ui/react';
import { Button } from './Button';


function Header() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");



  return (
    <header className="flex items-center text-center justify-between px-4 h16 sm:px-6">
      <Link href="/dashboard" className="font-extrabold uppercase tracking-widest">
        Gooter-Goo
      </Link>

      <div className="flex gap-2 py-1 justify-center">
        <Authenticated>
          {!isDashboard && (
            <Link href="/dashboard">
              <Button variant="outline" className= "text-center py-[3] cursor-pointer tracking-wide">Dashboard</Button>
            </Link>
          )}
          <UserButton />
        </Authenticated>

        <Unauthenticated>
          <SignInButton
            mode="modal"
            forceRedirectUrl="/dashboard"
            signUpForceRedirectUrl="/dashboard"
          >
            <Button className="cursor-pointer">Sign-In</Button>
          </SignInButton>
        </Unauthenticated>
      </div>
    </header>
  );
}

export default Header