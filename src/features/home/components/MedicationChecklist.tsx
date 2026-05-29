// src/features/home/components/MedicationChecklist.tsx
import { CheckCircle2, Circle } from "lucide-react";
import type { TodayMedication } from "../types/home";

interface MedicationChecklistProps {
  medications: TodayMedication[];
  onToggle?: (id: number) => void;
}

export default function MedicationChecklist({ 
  medications, 
  onToggle 
}: MedicationChecklistProps) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-slate-900">복약 체크리스트</h3>
      <div className="space-y-2">
        {medications.map((med) => (
          <button
            key={med.id}
            onClick={() => onToggle?.(med.id)}
            className="flex w-full items-center gap-2.5 rounded-xl bg-white p-3 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            {med.taken ? (
              <CheckCircle2 size={22} className="flex-shrink-0 text-[#534AB7]" />
            ) : (
              <Circle size={22} className="flex-shrink-0 text-slate-300" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{med.medicineName}</p>
              <p className="text-xs text-slate-500">
                {med.timeLabel} · {med.taken ? "복용 완료" : "예정"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}