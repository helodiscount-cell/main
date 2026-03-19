import { automationService } from "@/api/services/automations";
import { automationKeys } from "@/keys/react-query";
import { AutomationListItem } from "@/types/automation";
import { ActionsMenu } from "@/components/dash/shared/ActionsMenu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Pencil, Trash2 } from "lucide-react";

// Shared row actions menu — consumed by automations, forms, etc.
const MENU_ITEMS = [
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
  {
    key: "delete",
    label: "Delete",
    icon: Trash2,
    className: "text-red-500",
    bg: "hover:bg-red-50",
  },
] as const;

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

  const { mutate: deleteAutomation, isPending: isDeleting } = useMutation({
    mutationFn: () => automationService.delete(fullAutomation.id),
    onSuccess: () => {
      toast.success("Automation deleted.");
      queryClient.invalidateQueries({ queryKey: automationKeys.all });
      onClose();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Failed to delete automation.";
      toast.error(msg);
    },
  });

  // Navigate to the correct editor route based on trigger type
  const handleEdit = () => {
    navigate.push(
      fullAutomation.triggerType === "STORY_REPLY"
        ? `/dash/automations/dmforstories/${fullAutomation.story?.id}`
        : `/dash/automations/dmforcomments/${fullAutomation.post?.id}`,
    );
  };

  return (
    <ActionsMenu
      menuItems={MENU_ITEMS as any}
      onClose={onClose}
      isDeleting={isDeleting}
      onDelete={() => deleteAutomation()}
      onEdit={handleEdit}
    />
  );
}
