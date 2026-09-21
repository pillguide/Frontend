// src/features/alarm/components/RepeatSelector.tsx
import { Check } from "lucide-react";
import type { Weekday } from "../types/alarm";
import { WEEKDAY_LABELS } from "../utils/alarmFormat";

interface RepeatSelectorProps {
  value: Weekday[];
  onChange: (days: Weekday[]) => void;
}

const DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

export default function RepeatSelector({ value, onChange }: RepeatSelectorProps) {
  const toggle = (day: Weekday) =>
    onChange(value.includes(day) ? value.filter((d) => d !== day) : [...value, day]);

  return (
    <div className="divide-y divide-slate-100 rounded-[20px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {DAYS.map((day) => {
        const checked = value.includes(day);
        return (
          <button
            key={day}
            type="button"
            role="checkbox"
            aria-checked={checked}
            onClick={() => toggle(day)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-base text-slate-900">{WEEKDAY_LABELS[day]}요일마다</span>
            {checked && <Check size={20} strokeWidth={2.5} className="text-primary" />}
          </button>
        );
      })}
    </div>
  );
}
