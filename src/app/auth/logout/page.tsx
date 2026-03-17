"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cleanupOnLogout } from "./actions";

const LogoutPage = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Server action: clears Clerk metadata + disconnects Instagram server-side.
        // Running server-side guarantees metadata is wiped even if Instagram cleanup fails.
        await cleanupOnLogout();
      } catch (e) {
        console.error("Failed to cleanup during logout:", e);
      } finally {
        // Always sign out of Clerk regardless of cleanup success
        await signOut();
        router.push("/");
      }
    };

    handleLogout();
  }, [signOut, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm font-medium text-muted-foreground">
        Signing you out safely...
      </p>
    </div>
  );
};

export default LogoutPage;
