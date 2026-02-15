"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const LogoutPage = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Disconnect Instagram first while we still have an active session
        const { instagramService } =
          await import("@/lib/api/services/instagram/oauth");
        await instagramService.oauth.disconnect();
      } catch (e) {
        console.error("Failed to disconnect Instagram during logout:", e);
      } finally {
        // Always sign out of Clerk regardless of disconnect success
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
