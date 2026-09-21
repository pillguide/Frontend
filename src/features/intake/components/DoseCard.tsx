// src/features/intake/components/DoseCard.tsx
import { Check, Pill } from "lucide-react";
import { motion } from "framer-motion";
import type { ScheduledDose } from "../utils/schedule";

interface DoseCardProps {
  dose: ScheduledDose;
  disabled?: boolean; // 미래 날짜
  onToggle: () => void;
}

export default function DoseCard({ dose, disabled, onToggle }: DoseCardProps) {
  const { alarm, taken } = dose;

  return (
    <div
      className={`flex items-center justify-between rounded-2xl px-4 py-4 shadow-card transition-colors ${
        taken ? "bg-primary-50" : "bg-white"
      }`}
    >
      <div className="min-w-0">
        <p className={`truncate text-lg font-semibold ${taken ? "text-primary-700" : "text-slate-900"}`}>
          {alarm.medicineName}
          {alarm.dosage && <span className="ml-1.5 text-sm font-medium text-slate-500">{alarm.dosage}</span>}
        </p>
        {alarm.memo && <p className="mt-0.5 truncate text-sm text-slate-500">{alarm.memo}</p>}
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={onToggle}
        disabled={disabled}
        aria-pressed={taken}
        className={`flex h-11 flex-shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors disabled:bg-slate-100 disabled:text-slate-400 ${
          taken ? "bg-primary text-white" : "bg-white text-primary ring-1 ring-inset ring-primary-200"
        }`}
      >
        {disabled ? (
          "예정"
        ) : taken ? (
          <>
            <Check size={16} strokeWidth={3} /> 복용 완료
          </>
        ) : (
          <>
            <Pill size={16} /> 약 먹었어요
          </>
        )}
      </motion.button>
    </div>
  );
}
