import { LucideInstagram, Sparkles } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface InstagramConnectProps {
  handleConnectInstagram: () => void | Promise<void>;
  isConnecting: boolean;
}

// Renders Instagram connection panel with connect button
const InstagramConnect: React.FC<InstagramConnectProps> = ({
  handleConnectInstagram,
  isConnecting,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative overflow-hidden p-12">
        {/* Shows patterned overlay for connection area */}
        <div className="w-full border absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-size-[40px_40px]" />

        <div className="relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400">
            <Sparkles className="size-4" />
            <span>Connect Your Instagram Account</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            Get Started with{" "}
            <span className="bg-linear-to-r from-fuchsia-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
              Automation
            </span>
          </h2>

          <p className="text-muted-foreground mb-8 text-lg max-w-md">
            Connects your Instagram Business or Creator account to import and
            manage your posts conveniently from one place.
          </p>

          <Button
            onClick={handleConnectInstagram}
            disabled={isConnecting}
            size="lg"
            className="group px-8 py-6 text-base bg-linear-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 transition-all duration-300 w-full sm:w-auto"
          >
            {isConnecting ? (
              <>
                <Spinner className="size-4 mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <LucideInstagram className="mr-2 size-5" />
                Connect Instagram
              </>
            )}
          </Button>

          <p className="mt-6 text-sm text-muted-foreground">
            Secure OAuth connection • No password required
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstagramConnect;
