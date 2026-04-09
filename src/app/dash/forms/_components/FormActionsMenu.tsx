import { formService } from "@/api/services/forms";
import { formKeys } from "@/keys/react-query";
import { ActionsMenu } from "@/components/shared/ActionsMenu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Pencil, Trash2, Play, Square } from "lucide-react";

// Shared row actions menu — consumed by automations, forms, etc.
const MENU_ITEMS = [
  {
    key: "copy",
    label: "Copy",
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

// Form-specific wrapper around the shared ActionsMenu
export function FormActionsMenu({
  onClose,
  formId,
  slug,
  status,
}: {
  onClose: () => void;
  formId: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
}) {
  const navigate = useRouter();
  const queryClient = useQueryClient();

  const isPublished = status === "PUBLISHED";

  const { mutate: toggleStatus } = useMutation({
    mutationFn: (newStatus: "DRAFT" | "PUBLISHED") =>
      formService.update(formId, { status: newStatus } as any),
    onSuccess: (_, variables) => {
      toast.success(
        variables === "PUBLISHED" ? "Form published!" : "Form moved to draft.",
      );
      queryClient.invalidateQueries({ queryKey: formKeys.all });
      onClose();
    },
    onError: () => toast.error("Failed to update form status."),
  });

  const menuItems = [
    {
      key: "toggle",
      label: isPublished ? "Pause" : "Publish",
      icon: isPublished ? Square : Play,
      className: isPublished ? "text-amber-500" : "text-emerald-500",
      bg: isPublished ? "hover:bg-amber-50" : "hover:bg-emerald-50",
    },
    ...MENU_ITEMS,
  ];

  const { mutate: deleteForm, isPending: isDeleting } = useMutation({
    mutationFn: () => formService.delete(formId),
    onSuccess: () => {
      toast.success("Form deleted.");
      queryClient.invalidateQueries({ queryKey: formKeys.all });
      onClose();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Failed to delete form.";
      toast.error(msg);
    },
  });

  const copyToClipboard = () => {
    const url = `${window.location.origin}/f/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <ActionsMenu
      menuItems={menuItems as any}
      onClose={onClose}
      isDeleting={isDeleting}
      onDelete={() => deleteForm()}
      onEdit={() => navigate.push(`/dash/forms/editor?id=${formId}`)}
      onCustom={copyToClipboard}
      onToggle={() => toggleStatus(isPublished ? "DRAFT" : "PUBLISHED")}
    />
  );
}
