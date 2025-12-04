"use client";

import React from "react";
import { ModeToggle } from "./ui/mode-toggle";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import MainLogo from "./icon";
import Link from "next/link";

const Header = () => {
  return (
    <div className="w-full flex items-center gap-4 p-4 fixed top-0 z-50 justify-between">
      <Link href="/" className="mx-8">
        <MainLogo />
      </Link>
      <div className="flex gap-4 mx-8">
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
              <button className="px-4 py-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
              <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
