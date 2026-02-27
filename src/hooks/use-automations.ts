import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  automationService,
  AutomationListItem,
} from "@/api/services/automations";
import { automationKeys } from "@/keys/react-query";
import { toast } from "sonner";
import {
  SubmitHandler,
  DefaultValues,
  FieldValues,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export type PageState = "loading" | "fresh" | "live";

export function derivePageState(
  isLoading: boolean,
  automation: AutomationListItem | undefined,
): PageState {
  if (isLoading) return "loading";
  if (automation) return "live";
  return "fresh";
}

interface UseAutomationManagerProps<TFormValues extends FieldValues> {
  schema: z.ZodType<any, any, any>;
  defaultValues: DefaultValues<TFormValues>;
  findExistingAutomation: (automation: AutomationListItem) => boolean;
  onBuildPayload: (data: TFormValues) => Record<string, unknown> | null;
  onPayloadInvalid?: () => void;
  successMessage: string;
  stopMessage: string;
}

export function useAutomationManager<TFormValues extends FieldValues>({
  schema,
  defaultValues,
  findExistingAutomation,
  onBuildPayload,
  onPayloadInvalid,
  successMessage,
  stopMessage,
}: UseAutomationManagerProps<TFormValues>) {
  const queryClient = useQueryClient();

  // Fetch automations
  const { data, isLoading } = useQuery({
    queryKey: automationKeys.list(),
    queryFn: () => automationService.list(),
  });

  const existingAutomation = data?.automations.find(findExistingAutomation);
  const pageState = derivePageState(isLoading, existingAutomation);

  // Form setup
  const form = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Mutations
  const { mutate: createAutomation, isPending: isCreating } = useMutation({
    mutationKey: automationKeys.create(),
    mutationFn: (payload: Record<string, unknown>) =>
      automationService.create(payload),
    onSuccess: () => {
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: automationKeys.all });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Something went wrong.";
      toast.error(msg);
    },
  });

  const { mutate: stopAutomationMutation, isPending: isStopping } = useMutation(
    {
      mutationFn: () => {
        if (!existingAutomation?.id) {
          return Promise.reject(new Error("No automation to stop."));
        }
        return automationService.delete(existingAutomation.id);
      },
      onSuccess: () => {
        toast.success(stopMessage);
        queryClient.invalidateQueries({ queryKey: automationKeys.all });
      },
      onError: () => toast.error("Failed to stop automation."),
    },
  );

  const stopAutomation = () => stopAutomationMutation();
  const isReRunning = false;
  const handleReRun = () => toast.info("Re-Run coming soon.");

  const onSubmit: SubmitHandler<TFormValues> = (formData) => {
    const payload = onBuildPayload(formData);
    if (!payload) {
      if (onPayloadInvalid) {
        onPayloadInvalid();
      } else {
        toast.error("Invalid configuration. Please try again.");
      }
      return;
    }
    createAutomation(payload);
  };

  const onInvalid = (errs: any) => {
    const first =
      errs.keywords?.message ??
      errs.dmMessage?.message ??
      "Please fill in all required fields.";
    toast.error(first as string);
  };

  const handleSubmit = form.handleSubmit(onSubmit, onInvalid);

  return {
    form,
    existingAutomation,
    pageState,
    isCreating,
    isStopping,
    stopAutomation,
    isReRunning,
    handleReRun,
    handleSubmit,
  };
}
