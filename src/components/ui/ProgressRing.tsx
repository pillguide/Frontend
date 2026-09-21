// src/components/ui/ProgressRing.tsx
import type { ReactNode } from "react";

interface ProgressRingProps {
  value: number; // 0~1
  size?: number;
  stroke?: number;
  trackClassName?: string;
  barClassName?: string;
  children?: ReactNode;
}

export default function ProgressRing({
  value,
  size = 64,
  stroke = 6,
  trackClassName = "stroke-slate-100",
  barClassName = "stroke-primary",
  children,
}: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, value));

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className={trackClassName} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped)}
          className={`transition-[stroke-dashoffset] duration-500 ${barClassName}`}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}
