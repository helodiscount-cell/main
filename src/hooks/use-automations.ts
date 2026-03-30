import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { automationService } from "@/api/services/automations";
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
import { AutomationListItem } from "@/types/automation";

export type PageState = "loading" | "fresh" | "live";

export function derivePageState(
  isLoading: boolean,
  automation: AutomationListItem | undefined,
  isEditMode: boolean,
): PageState {
  if (isLoading) return "loading";
  if (isEditMode && automation) return "live";
  return "fresh";
}

interface UseAutomationManagerProps<TFormValues extends FieldValues> {
  schema: z.ZodType<any, any, any>;
  defaultValues: DefaultValues<TFormValues>;
  automationId?: string; // New prop for specific automation editing
  onBuildPayload: (data: TFormValues) => Record<string, unknown> | null;
  onPopulateForm?: (
    automation: AutomationListItem,
  ) => DefaultValues<TFormValues>;
  onPayloadInvalid?: () => void;
  successMessage: string;
  stopMessage: string;
}

export function useAutomationManager<TFormValues extends FieldValues>({
  schema,
  defaultValues,
  automationId,
  onBuildPayload,
  onPopulateForm,
  onPayloadInvalid,
  successMessage,
  stopMessage,
}: UseAutomationManagerProps<TFormValues>) {
  const queryClient = useQueryClient();

  // Fetch automation details if automationId is provided
  const { data: detailsData, isLoading: isDetailsLoading } = useQuery({
    queryKey: automationKeys.detail(automationId as string),
    queryFn: () => automationService.getById(automationId!),
    enabled: !!automationId,
  });

  const automationDetails = detailsData?.automation;

  // pageState is "live" only if we specifically requested an ID and it loaded
  const pageState = derivePageState(
    isDetailsLoading,
    automationDetails,
    !!automationId,
  );

  // Form setup
  const form = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const lastResetId = useRef<string | null>(null);

  useEffect(() => {
    // Only reset if we have details and a population function
    // AND we haven't already reset for this specific automation ID
    if (
      automationDetails?.id &&
      onPopulateForm &&
      lastResetId.current !== automationDetails.id
    ) {
      form.reset(onPopulateForm(automationDetails) as any);
      lastResetId.current = automationDetails.id;
    }
  }, [automationDetails, onPopulateForm, form]);

  // Mutations
  const { mutate: createAutomation, isPending: isCreating } = useMutation({
    mutationKey: automationKeys.create(),
    mutationFn: (payload: Record<string, unknown>) =>
      automationService.create(payload),
    onSuccess: (result) => {
      // Log any warnings from the backend (duplicate keyword warnings etc.)
      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach((warning: string) => {
          console.log("[Automation Warning]:", warning);
        });
      }
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
        if (!automationDetails?.id) {
          return Promise.reject(new Error("No automation to stop."));
        }
        return automationService.update(automationDetails.id, {
          status: "PAUSED",
        });
      },
      onSuccess: () => {
        toast.success(stopMessage);
        queryClient.invalidateQueries({ queryKey: automationKeys.all });
      },
      onError: () => toast.error("Failed to stop automation."),
    },
  );

  const { mutate: updateAutomation, isPending: isUpdating } = useMutation({
    mutationFn: (payload: Record<string, unknown>) => {
      if (!automationDetails?.id) {
        return Promise.reject(new Error("No automation to update."));
      }
      return automationService.update(automationDetails.id, payload);
    },
    onSuccess: (result) => {
      toast.success("Automation updated successfully!");
      if (onPopulateForm) {
        form.reset(onPopulateForm(result.automation) as any);
      }
      queryClient.invalidateQueries({ queryKey: automationKeys.all });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Failed to update automation.";
      toast.error(msg);
    },
  });

  const { mutate: startAutomationMutation, isPending: isStarting } =
    useMutation({
      mutationFn: () => {
        if (!automationDetails?.id) {
          return Promise.reject(new Error("No automation to start."));
        }
        return automationService.update(automationDetails.id, {
          status: "ACTIVE",
        });
      },
      onSuccess: () => {
        toast.success("Automation is now LIVE! 🚀");
        queryClient.invalidateQueries({ queryKey: automationKeys.all });
      },
      onError: () => toast.error("Failed to start automation."),
    });

  const stopAutomation = () => stopAutomationMutation();
  const startAutomation = () => startAutomationMutation();
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

    if (pageState === "live" && automationDetails) {
      updateAutomation(payload);
    } else {
      createAutomation(payload);
    }
  };

  const onInvalid = (errs: any) => {
    // Extract the first available error message dynamically
    const getFirstErrorMessage = (obj: any): string | null => {
      if (!obj) return null;
      if (typeof obj.message === "string") return obj.message;
      for (const key in obj) {
        const msg = getFirstErrorMessage(obj[key]);
        if (msg) return msg;
      }
      return null;
    };

    const firstError =
      getFirstErrorMessage(errs) ?? "Please fill in all required fields.";
    toast.error(firstError);
  };

  const handleSubmit = form.handleSubmit(onSubmit, onInvalid);

  return {
    form,
    existingAutomation: automationDetails,
    pageState,
    isCreating,
    isUpdating,
    isStopping,
    isStarting,
    stopAutomation,
    startAutomation,
    isReRunning,
    handleReRun,
    handleSubmit,
    handleNameChange: (name: string) => {
      form.setValue("automationName" as any, name as any);
      if (pageState === "live" && automationDetails?.id) {
        updateAutomation({ automationName: name });
      }
    },
  };
}
