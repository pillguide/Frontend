// src/features/home/components/NextMedicationCard.tsx
import { Clock } from "lucide-react";
import type { NextMedication } from "../types/home";

interface NextMedicationCardProps {
  next: NextMedication | null;
}

export default function NextMedicationCard({ next }: NextMedicationCardProps) {
  if (!next) return null;
  
  return (
    <button className="flex w-full items-center gap-3 rounded-2xl bg-[#E6F1FB] p-3.5">
      <Clock size={22} className="text-[#185FA5]" />
      <div className="text-left">
        <p className="text-xs text-[#185FA5]">다음 복약</p>
        <p className="text-sm font-medium text-[#185FA5]">
          {next.time} · {next.medicineName}
        </p>
      </div>
    </button>
  );
}