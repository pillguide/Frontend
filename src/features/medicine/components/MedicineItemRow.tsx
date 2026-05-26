import { ChevronRight } from "lucide-react";
import type { MedicineItem } from "../types/medicine";

interface MedicineItemRowProps {
  medicine: MedicineItem;
}

export default function MedicineItemRow({ medicine }: MedicineItemRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-4">
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
    </div>
  );
}