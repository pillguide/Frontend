// src/features/medicine/components/MedicineItemRow.tsx
import { ChevronRight } from "lucide-react";
import type { MedicineItem } from "../types/medicine";

interface MedicineItemRowProps {
  medicine: MedicineItem;
  onClick?: () => void;
}

export default function MedicineItemRow({ medicine, onClick }: MedicineItemRowProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center gap-3">
        <img
          src={medicine.imageUrl}
          alt={medicine.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          {medicine.warning && (
            <span className="inline-block rounded-full border border-red-300 px-3 py-1 text-xs text-red-500">
              {medicine.warning}
            </span>
          )}
          <p className="mt-1 text-base font-medium text-slate-900">
            {medicine.name}
          </p>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-400" />
    </button>
  );
}