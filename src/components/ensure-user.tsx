"use client";

import { useEffect, useRef } from "react";
import { SignedIn } from "@clerk/nextjs";

export default function EnsureUser() {
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    void fetch("/api/users/ensure", { method: "POST" });
  }, []);

  return <SignedIn>{null}</SignedIn>;
}
