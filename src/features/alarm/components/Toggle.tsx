// src/features/alarm/components/Toggle.tsx
interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string; // 스크린리더용
  disabled?: boolean;
}

export default function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`relative h-[30px] w-[52px] flex-shrink-0 rounded-full transition-colors disabled:opacity-40 ${
        checked ? "bg-primary" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute left-0 top-[3px] size-6 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[25px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
