import { formService } from "@/api/services/forms";
import { formKeys } from "@/keys/react-query";
import { ActionsMenu } from "@/components/dash/shared/ActionsMenu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Form-specific wrapper around the shared ActionsMenu
export function FormActionsMenu({
  onClose,
  formId,
}: {
  onClose: () => void;
  formId: string;
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

  return (
    <ActionsMenu
      onClose={onClose}
      isDeleting={isDeleting}
      onDelete={() => deleteForm()}
      onEdit={() => navigate.push(`/dash/forms/editor?id=${formId}`)}
    />
  );
}
