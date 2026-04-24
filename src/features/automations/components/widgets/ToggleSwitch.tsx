// Shared toggle pill used by all automation widgets
interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  ariaLabel?: string;
}

export function ToggleSwitch({
  enabled,
  onChange,
  ariaLabel,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      aria-label={ariaLabel}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        enabled ? "bg-[#6A06E4]" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
