"use client";

import { RefreshInstaDialog } from "@/components/auth/RefreshInstaDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AddKeywords from "@/components/dashboard/automations/AddKeywords";
import PublicReplyToComments from "@/components/dashboard/automations/PublicReplyToComments";
import { Play, RefreshCw } from "lucide-react";
import Image from "next/image";
import phoneImg from "@/assets/png/phone.png";
import SendDm from "@/components/dashboard/automations/SendDm";
import { useState } from "react";
import { toast } from "sonner";
import { use } from "react";

// ---------------------------------------------------------------------------
// Payload config — defines how each widget contributes to the final payload
// ---------------------------------------------------------------------------
type Reply = { id: string; text: string };

type AutomationFormState = {
  keywords: string[];
  dmMessage: string;
  publicReplyEnabled: boolean;
  publicReplies: Reply[];
};

function buildPayload(
  postId: string,
  form: AutomationFormState,
): Record<string, unknown> {
  return {
    postId,
    triggers: form.keywords,
    matchType: "CONTAINS",
    actionType: "DM",
    replyMessage: form.dmMessage,
    useVariables: true,
    // Only include commentReplyWhenDm when the toggle is on AND there's at least one reply
    ...(form.publicReplyEnabled && form.publicReplies.length > 0
      ? {
          commentReplyWhenDm: form.publicReplies.map((r) => r.text).join(" | "),
        }
      : {}),
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const Page = ({ params }: { params: Promise<{ post_id: string }> }) => {
  const { post_id } = use(params);

  const [form, setForm] = useState<AutomationFormState>({
    keywords: [],
    dmMessage: "",
    publicReplyEnabled: true,
    publicReplies: [
      { id: crypto.randomUUID(), text: "Open your DMs, it's there!" },
    ],
  });
  const [loading, setLoading] = useState(false);

  const handleGoLive = async () => {
    // Client-side guards
    if (form.keywords.length === 0) {
      toast.error("Add at least one keyword to continue.");
      return;
    }
    if (!form.dmMessage.trim()) {
      toast.error("Write a DM message before going live.");
      return;
    }

    const payload = buildPayload(post_id, form);

    setLoading(true);
    try {
      const res = await fetch("/api/automations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.error ?? "Something went wrong.");
        return;
      }

      toast.success("Automation is now live! 🚀");
    } catch {
      toast.error("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <div className="flex w-full gap-3 items-center">
          <div className="flex-2 bg-white rounded-md px-4 flex items-center h-9">
            <p className="text-sm font-semibold">
              <span className="opacity-50">Automation </span>/ DM For Comment
            </p>
          </div>

          <div className="w-fit flex items-center gap-2 bg-white rounded-md px-3 h-9">
            <RefreshCw size={15} className="text-slate-400" />
            <span className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">{0}</span>
              <span className="text-slate-400"> / 1000</span>
            </span>
          </div>

          <RefreshInstaDialog />

          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={handleGoLive}
            disabled={loading}
          >
            <Play size={14} />
            {loading ? "Going Live…" : "Go Live"}
          </Button>
        </div>
      </header>

      {/* ── Main canvas ── */}
      <div
        className="flex-1 m-4 rounded-xl overflow-hidden"
        style={{
          backgroundColor: "#D4D4D4",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath d='M12 8v8M8 12h8' stroke='%23BEBEBE' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="justify-center h-full grid grid-cols-[280px_30rem_280px] gap-4 p-4 overflow-hidden">
          {/* ── Left: Keywords ── */}
          <div className="flex flex-col justify-center gap-3 overflow-y-auto pr-1">
            <AddKeywords
              value={form.keywords}
              onChange={(keywords) => setForm((f) => ({ ...f, keywords }))}
            />
          </div>

          {/* ── Center: Phone mockup ── */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full flex items-start justify-center">
              <div className="relative drop-shadow-2xl h-full w-full">
                <Image
                  src={phoneImg}
                  alt="Phone preview"
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* ── Right: Scrollable widgets ── */}
          <div className="flex flex-col justify-center gap-3 overflow-y-auto pr-1">
            <PublicReplyToComments
              enabled={form.publicReplyEnabled}
              onEnabledChange={(enabled) =>
                setForm((f) => ({ ...f, publicReplyEnabled: enabled }))
              }
              replies={form.publicReplies}
              onRepliesChange={(publicReplies) =>
                setForm((f) => ({ ...f, publicReplies }))
              }
            />
            <SendDm
              message={form.dmMessage}
              onMessageChange={(dmMessage) =>
                setForm((f) => ({ ...f, dmMessage }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
