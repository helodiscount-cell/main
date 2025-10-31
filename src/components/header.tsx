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

const Header = () => {
  return (
    <div className="container mx-auto bg-background/50 backdrop-blur-sm flex items-center justify-end gap-4 p-4 sticky top-0 z-50">
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
  );
};

export default Header;
