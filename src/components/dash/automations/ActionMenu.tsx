import { automationService } from "@/api/services/automations";
import { automationKeys } from "@/keys/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

// Row actions menu
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

type MenuKey = (typeof MENU_ITEMS)[number]["key"];

export function ActionsMenu({
  automationId,
  onClose,
}: {
  automationId: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const menuRef = useRef<HTMLDivElement>(null);

  const { mutate: deleteAutomation, isPending: isDeleting } = useMutation({
    mutationFn: () => automationService.delete(automationId),
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

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleAction = (key: MenuKey) => {
    if (key === "delete") {
      deleteAutomation();
      return;
    }
    // Duplicate / Edit — not yet implemented
    toast.info(`${key.charAt(0).toUpperCase() + key.slice(1)} coming soon.`);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-8 z-50 min-w-[150px] rounded-xl border border-slate-100 bg-white shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100"
    >
      {MENU_ITEMS.map(({ key, label, icon: Icon, className, bg }) => (
        <button
          key={key}
          disabled={key === "delete" && isDeleting}
          onClick={() => handleAction(key)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium ${className} ${bg} transition-colors disabled:opacity-50`}
        >
          <Icon size={14} />
          {key === "delete" && isDeleting ? "Deleting…" : label}
        </button>
      ))}
    </div>
  );
}
