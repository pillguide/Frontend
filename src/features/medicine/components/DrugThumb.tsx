// 약 대표 이미지 썸네일: 칸을 꽉 채워서, 이미지가 없으면 알약 아이콘
import { Pill } from "lucide-react";
import RepresentativePhoto from "./RepresentativePhoto";

interface Props {
  drug: { drugId: number; imageUrl: string | null; representativeImageStatus: string | null };
  className: string;
}

export default function DrugThumb({ drug, className }: Props) {
  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden bg-[#f4f5f9] ${className}`}>
      {drug.representativeImageStatus === "READY" && drug.imageUrl ? (
        <RepresentativePhoto key={`${drug.drugId}:${drug.imageUrl}`} drugId={drug.drugId} url={drug.imageUrl} ready />
      ) : (
        <Pill size={20} className="text-slate-300" />
      )}
    </span>
  );
}
