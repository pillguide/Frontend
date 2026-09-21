// src/features/home/components/HealthTipCard.tsx
import { Lightbulb } from "lucide-react";

const TIPS = [
  "약은 충분한 양의 물과 함께 드세요.",
  "먹는 시간을 정해 두면 잊지 않고 챙기기 쉬워요.",
  "유통기한이 지난 약은 약국이나 보건소 폐의약품 수거함에 버려요.",
  "여러 병원에서 처방받았다면 약사에게 함께 먹어도 되는지 물어보세요.",
  "약은 습기와 햇빛을 피해 서늘한 곳에 보관하세요.",
];

export default function HealthTipCard({ date }: { date: Date }) {
  // 날짜마다 다른 팁
  const tip = TIPS[date.getDate() % TIPS.length];

  return (
    <div className="flex gap-3 rounded-[20px] border border-amber-100 bg-amber-50/60 p-4">
      <span className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <Lightbulb size={18} />
      </span>
      <div>
        <p className="text-xs font-semibold text-amber-700">오늘의 복약 팁</p>
        <p className="mt-0.5 text-sm leading-relaxed text-slate-700">{tip}</p>
      </div>
    </div>
  );
}
