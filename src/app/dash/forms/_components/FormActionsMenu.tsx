import { formService } from "@/api/services/forms";
import { formKeys } from "@/keys/react-query";
import { ActionsMenu } from "@/components/shared/ActionsMenu";
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

// Form-specific wrapper around the shared ActionsMenu
export function FormActionsMenu({
  onClose,
  formId,
  slug,
}: {
  onClose: () => void;
  formId: string;
  slug: string;
}) {
  const navigate = useRouter();
  const queryClient = useQueryClient();

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

  const { mutate: duplicateForm, isPending: isDuplicating } = useMutation({
    mutationFn: () => formService.duplicate(formId),
    onSuccess: () => {
      toast.success("Form duplicated.");
      queryClient.invalidateQueries({ queryKey: formKeys.all });
      onClose();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Failed to duplicate form.";
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
      menuItems={MENU_ITEMS}
      onClose={onClose}
      isDeleting={isDeleting}
      isDuplicating={isDuplicating}
      onDelete={() => deleteForm()}
      onEdit={() => navigate.push(`/dash/forms/${formId}`)}
      onDuplicate={() => duplicateForm()}
      onCustom={copyToClipboard}
    />
  );
}
