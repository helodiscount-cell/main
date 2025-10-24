"use client";

import { useEffect, useRef } from "react";
import { SignedIn } from "@clerk/nextjs";
import { useApi } from "@/hooks/use-api";

export default function EnsureUser() {
  const hasRunRef = useRef(false);

  const { execute } = useApi();

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    execute("/users/ensure", "POST", {});
  }, []);

  return <SignedIn>{null}</SignedIn>;
}
