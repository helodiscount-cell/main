import { useEffect, useRef } from "react";

type ActionsMenuProps = {
  menuItems: {
    key: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    className?: string;
    bg?: string;
  }[];
  onClose: () => void;
  isDeleting?: boolean;
  // Each action is optional — omitting one keeps the button but shows "coming soon"
  onDelete?: () => void;
  onEdit?: () => void;
  onCustom?: () => void;
};

export function ActionsMenu({
  menuItems,
  onClose,
  isDeleting = false,
  onDelete,
  onEdit,
  onCustom,
}: ActionsMenuProps) {
  type MenuKey = (typeof menuItems)[number]["key"];

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
    switch (key) {
      case "delete":
        if (onDelete) onDelete();
        break;
      case "edit":
        if (onEdit) onEdit();
        break;
      case "copy":
        if (onCustom) onCustom();
        break;
      default:
        import("sonner").then(({ toast }) => {
          toast.info(
            `${key.charAt(0).toUpperCase() + key.slice(1)} coming soon.`,
          );
        });
        onClose();
        break;
    }
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-8 z-50 min-w-[150px] rounded-xl border border-slate-100 bg-white shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100"
    >
      {menuItems.map(({ key, label, icon: Icon, className, bg }) => (
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
