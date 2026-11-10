// src/features/medicine/components/MedicineHero.tsx
import { Pill } from "lucide-react";
import type { MedicineTag } from "../types/medicine";

interface MedicineHeroProps {
  name: string;
  imageUrl?: string | null;
  tags: MedicineTag[];
}

export default function MedicineHero({ name, imageUrl, tags }: MedicineHeroProps) {
  return (
    <div className="flex flex-col items-center px-4 pt-6 pb-4">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="mb-4 h-28 w-28 object-contain" />
      ) : (
        <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-slate-100">
          <Pill size={44} className="text-slate-300" />
        </div>
      )}
      <h2 className="mb-3 text-center text-xl font-bold text-slate-900">{name}</h2>
      <div className="flex gap-2">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className={`rounded-full px-3 py-1 text-xs ${
              tag.variant === "warning"
                ? "bg-amber-50 text-amber-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );
}