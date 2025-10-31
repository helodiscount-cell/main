import { LucideInstagram } from "lucide-react";
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
    <div className="h-full flex flex-col items-center justify-center my-16">
      <div className="rounded-2xl shadow-lg dark:shadow-none border dark:border-gray-800 bg-white dark:bg-gray-900 p-8 w-full max-w-md flex flex-col items-center">
        <div className="bg-linear-to-br from-purple-500 to-pink-500 p-3 rounded-full mb-4">
          <LucideInstagram className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Connect your Instagram
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          Connect your Instagram account to import and manage your posts
          conveniently from one place.
        </p>
        <Button
          onClick={handleConnectInstagram}
          disabled={isConnecting}
          size="lg"
          className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md transition-all w-full"
        >
          {isConnecting ? (
            <>
              <Spinner className="size-4 mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <LucideInstagram className="mr-2" size={18} />
              Connect Instagram
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default InstagramConnect;
