import { Copy, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

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

type MenuKey = (typeof MENU_ITEMS)[number]["key"];

type ActionsMenuProps = {
  onClose: () => void;
  isDeleting?: boolean;
  // Each action is optional — omitting one keeps the button but shows "coming soon"
  onDelete?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
};

export function ActionsMenu({
  onClose,
  isDeleting = false,
  onDelete,
  onEdit,
  onDuplicate,
}: ActionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

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
    if (key === "delete" && onDelete) {
      onDelete();
      return;
    }
    if (key === "edit" && onEdit) {
      onEdit();
      onClose();
      return;
    }
    if (key === "duplicate" && onDuplicate) {
      onDuplicate();
      onClose();
      return;
    }
    // Fallback for unimplemented actions
    import("sonner").then(({ toast }) => {
      toast.info(`${key.charAt(0).toUpperCase() + key.slice(1)} coming soon.`);
    });
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
