"use client";

import { RefreshInstaDialog } from "@/components/auth/RefreshInstaDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AddKeywords from "@/components/dash/automations/AddKeywords";
import PublicReplyToComments from "@/components/dash/automations/PublicReplyToComments";
import { Pencil, Play, RefreshCw, RotateCcw, Square } from "lucide-react";
import Image from "next/image";
import phoneImg from "@/assets/png/phone.png";
import SendDm from "@/components/dash/automations/SendDm";
import { use } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  automationService,
  AutomationListItem,
} from "@/api/services/automations";
import { automationKeys } from "@/keys/react-query";

// Schema
type Reply = { id: string; text: string };

const formSchema = z.object({
  keywords: z.array(z.string()).min(1, "Add at least one keyword to continue."),
  dmMessage: z.string().min(1, "Write a DM message before going live."),
  publicReplyEnabled: z.boolean(),
  publicReplies: z.array(z.object({ id: z.string(), text: z.string() })),
});

type FormValues = z.infer<typeof formSchema>;

// Page state config — single source of truth for what the header renders
type PageState = "loading" | "fresh" | "live";

function derivePageState(
  isLoading: boolean,
  automation: AutomationListItem | undefined,
): PageState {
  if (isLoading) return "loading";
  if (automation) return "live";
  return "fresh";
}

// Payload builder
function buildPayload(
  postId: string,
  form: FormValues,
): Record<string, unknown> {
  return {
    postId,
    triggers: form.keywords,
    matchType: "CONTAINS",
    actionType: "DM",
    replyMessage: form.dmMessage,
    useVariables: true,
    ...(form.publicReplyEnabled && form.publicReplies.length > 0
      ? {
          commentReplyWhenDm: form.publicReplies.map((r) => r.text).join(" | "),
        }
      : {}),
  };
}

// Header sub-components
function HeaderSkeleton() {
  return (
    <div className="flex w-full gap-3 items-center animate-pulse">
      <div className="h-9 w-48 bg-slate-200 rounded-md" />
      <div className="h-9 w-24 bg-slate-200 rounded-md" />
      <div className="h-9 w-28 bg-slate-200 rounded-md ml-auto" />
    </div>
  );
}

function FreshHeader({ isPending }: { isPending: boolean }) {
  return (
    <div className="flex w-full gap-3 items-center animate-in fade-in duration-300">
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
        type="submit"
        className="bg-green-500 hover:bg-green-600 transition-all"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <RefreshCw size={14} className="animate-spin" />
            Going Live…
          </>
        ) : (
          <>
            <Play size={14} />
            Go Live
          </>
        )}
      </Button>
    </div>
  );
}

function LiveHeader({
  automation,
  onStop,
  isStopping,
  onReRun,
  isReRunning,
}: {
  automation: AutomationListItem;
  onStop: () => void;
  isStopping: boolean;
  onReRun: () => void;
  isReRunning: boolean;
}) {
  const label = automation.postCaption
    ? automation.postCaption.slice(0, 30) +
      (automation.postCaption.length > 30 ? "…" : "")
    : automation.postId;

  return (
    <div className="flex w-full gap-2 items-center animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Breadcrumb pill */}
      <div className="flex items-center gap-2 bg-white rounded-md px-4 h-9 flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">
          <span className="opacity-50">Automation / DM For Comment/ </span>
          <span>{label}</span>
        </p>
        <button
          type="button"
          className="shrink-0 text-purple-500 hover:text-purple-700 transition-colors"
        >
          <Pencil size={13} />
        </button>
      </div>

      {/* Refresh icon */}
      <button
        type="button"
        onClick={onReRun}
        disabled={isReRunning}
        className="h-9 w-9 shrink-0 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white transition-colors disabled:opacity-60"
      >
        <RotateCcw size={15} className={isReRunning ? "animate-spin" : ""} />
      </button>

      {/* Re-Run */}
      <Button
        type="button"
        onClick={onReRun}
        disabled={isReRunning}
        className="bg-slate-900 hover:bg-slate-700 h-9 transition-all"
      >
        <Play size={13} />
        {isReRunning ? "Running…" : "Re-Run"}
      </Button>

      {/* Stop */}
      <Button
        type="button"
        onClick={onStop}
        disabled={isStopping}
        className="bg-red-500 hover:bg-red-600 h-9 transition-all"
      >
        {isStopping ? (
          <RefreshCw size={13} className="animate-spin" />
        ) : (
          <Square size={13} fill="currentColor" />
        )}
        {isStopping ? "Stopping…" : "Stop"}
      </Button>

      {/* Live badge */}
      <div className="h-9 px-4 rounded-md border-2 border-green-500 text-green-600 text-sm font-semibold flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Live
      </div>
    </div>
  );
}

const Page = ({ params }: { params: Promise<{ post_id: string }> }) => {
  const { post_id } = use(params);
  const queryClient = useQueryClient();

  // Fetch all automations — uses cache if already populated (e.g., user came
  // from the automations list page). Fetches fresh on direct URL navigation.
  const { data, isLoading } = useQuery({
    queryKey: automationKeys.list(),
    queryFn: () => automationService.list(),
  });

  const existingAutomation = data?.automations.find(
    (a) => a.postId === post_id && a.status !== "DELETED",
  );

  const pageState = derivePageState(isLoading, existingAutomation);

  // Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keywords: [],
      dmMessage: "",
      publicReplyEnabled: true,
      publicReplies: [
        { id: crypto.randomUUID(), text: "Open your DMs, it's there!" },
      ],
    },
  });

  // Create mutation
  const { mutate: createAutomation, isPending: isCreating } = useMutation({
    mutationKey: automationKeys.create(),
    mutationFn: (payload: Record<string, unknown>) =>
      automationService.create(payload),
    onSuccess: () => {
      toast.success("Automation is now live! 🚀");
      queryClient.invalidateQueries({ queryKey: automationKeys.all });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Something went wrong.";
      toast.error(msg);
    },
  });

  // Delete (Stop) mutation
  const { mutate: stopAutomation, isPending: isStopping } = useMutation({
    mutationFn: () => automationService.delete(existingAutomation!.id),
    onSuccess: () => {
      toast.success("Automation stopped.");
      queryClient.invalidateQueries({ queryKey: automationKeys.all });
    },
    onError: () => toast.error("Failed to stop automation."),
  });

  // Re-Run = no-op toast for now (extend later)
  const isReRunning = false;
  const handleReRun = () => toast.info("Re-Run coming soon.");

  const onSubmit = (data: FormValues) =>
    createAutomation(buildPayload(post_id, data));

  const onInvalid = (errs: typeof errors) => {
    const first =
      errs.keywords?.message ??
      errs.dmMessage?.message ??
      "Please fill in all required fields.";
    toast.error(first);
  };

  // Header config — maps page state → what to render
  const headerContent: Record<PageState, React.ReactNode> = {
    loading: <HeaderSkeleton />,
    fresh: <FreshHeader isPending={isCreating} />,
    live: existingAutomation ? (
      <LiveHeader
        automation={existingAutomation}
        onStop={() => stopAutomation()}
        isStopping={isStopping}
        onReRun={handleReRun}
        isReRunning={isReRunning}
      />
    ) : null,
  };

  return (
    <form
      className="flex flex-col h-full"
      onSubmit={handleSubmit(onSubmit, onInvalid)}
    >
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {headerContent[pageState]}
      </header>

      {/* Main canvas */}
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
          {/* Left: Keywords */}
          <div className="flex flex-col justify-center gap-3 overflow-y-auto pr-1">
            <Controller
              control={control}
              name="keywords"
              render={({ field }) => (
                <AddKeywords value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          {/* Center: Phone mockup */}
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

          {/* Right: Scrollable widgets */}
          <div className="flex flex-col justify-center gap-3 overflow-y-auto pr-1">
            <Controller
              control={control}
              name="publicReplyEnabled"
              render={({ field: enabledField }) => (
                <Controller
                  control={control}
                  name="publicReplies"
                  render={({ field: repliesField }) => (
                    <PublicReplyToComments
                      enabled={enabledField.value}
                      onEnabledChange={enabledField.onChange}
                      replies={repliesField.value as Reply[]}
                      onRepliesChange={repliesField.onChange}
                    />
                  )}
                />
              )}
            />

            <Controller
              control={control}
              name="dmMessage"
              render={({ field }) => (
                <SendDm
                  message={field.value}
                  onMessageChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
