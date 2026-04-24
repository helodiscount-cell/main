import { automationService } from "@/api/services/automations";
import { automationKeys } from "@/keys/react-query";
import { AutomationListItem } from "@/api/services/automations/types";
import { ActionsMenu } from "@/components/shared/ActionsMenu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Pencil, Octagon, Play } from "lucide-react";
import { getAutomationRoute } from "@/utils/automation";

// Automation-specific wrapper around the shared ActionsMenu
export function AutomationActionsMenu({
  onClose,
  fullAutomation,
}: {
  onClose: () => void;
  fullAutomation: AutomationListItem;
}) {
  const navigate = useRouter();
  const queryClient = useQueryClient();

  const isStopped = fullAutomation.status === "STOPPED";

  // Shared items
  const menuItems = [
    {
      key: "duplicate",
      label: "Duplicate",
      icon: Copy,
      className: "text-purple-500",
      bg: "hover:bg-purple-50",
    },
    {
      key: "edit",
      label: "Edit",
      icon: Pencil,
      className: "text-amber-500",
      bg: "hover:bg-amber-50",
    },
    isStopped
      ? {
          key: "activate",
          label: "Go Live",
          icon: Play,
          className: "text-emerald-500",
          bg: "hover:bg-emerald-50",
        }
      : {
          key: "stop",
          label: "Stop",
          icon: Octagon,
          className: "text-red-500",
          bg: "hover:bg-red-50",
        },
  ] as const;

  // Mutation to stop
  const { mutate: stopAutomation, isPending: isStopping } = useMutation({
    mutationFn: () => automationService.stop(fullAutomation.id),
    onSuccess: () => {
      toast.success("Automation stopped.");
      queryClient.invalidateQueries({ queryKey: automationKeys.all });
      onClose();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Failed to stop automation.";
      toast.error(msg);
    },
  });

  // Mutation to activate (Go Live)
  const { mutate: activateAutomation, isPending: isActivating } = useMutation({
    mutationFn: () =>
      automationService.update(fullAutomation.id, { status: "ACTIVE" }),
    onSuccess: () => {
      toast.success("Automation is now Live!");
      queryClient.invalidateQueries({ queryKey: automationKeys.all });
      onClose();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Failed to activate automation.";
      toast.error(msg);
    },
  });

  // Navigate to the correct editor route based on trigger type
  const handleEdit = () => {
    navigate.push(
      getAutomationRoute(fullAutomation.triggerType, fullAutomation.id),
    );
  };

  return (
    <ActionsMenu
      menuItems={menuItems}
      onClose={onClose}
      isStopping={isStopping}
      onStop={() => stopAutomation()}
      isToggling={isActivating}
      toggleLabel="Activating..."
      onActivate={() => activateAutomation()}
      onEdit={handleEdit}
    />
  );
}
