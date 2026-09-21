// src/features/home/components/TodayHeroCard.tsx
import { ChevronRight, Flame } from "lucide-react";
import ProgressRing from "../../../components/ui/ProgressRing";

interface TodayHeroCardProps {
  total: number;
  taken: number;
  streak: number;
  onClick: () => void;
}

function message(total: number, taken: number) {
  if (total === 0) return "오늘은 예정된 약이 없어요";
  if (taken === total) return "오늘 약을 모두 챙겼어요!";
  if (taken === 0) return "오늘 첫 약을 챙겨볼까요?";
  return `잘하고 있어요! ${total - taken}개 남았어요`;
}

export default function TodayHeroCard({ total, taken, streak, onClick }: TodayHeroCardProps) {
  const rate = total === 0 ? 0 : taken / total;

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-primary via-primary-400 to-primary-300 p-5 text-left text-white shadow-[0_12px_24px_-10px_rgba(83,74,183,0.55)]"
    >
      {/* 배경 장식 */}
      <span className="pointer-events-none absolute -right-10 -top-12 size-40 rounded-full bg-white/10" />
      <span className="pointer-events-none absolute -bottom-16 right-16 size-32 rounded-full bg-white/10" />

      <div className="relative flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-0.5 text-sm text-white/80">
            오늘의 복약 <ChevronRight size={14} />
          </p>
          <p className="mt-1 text-[28px] font-bold leading-tight">
            {taken}
            <span className="text-lg font-semibold text-white/70"> / {total}</span>
          </p>
          <p className="mt-1 text-base font-medium">{message(total, taken)}</p>
          {streak > 0 && (
            <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
              <Flame size={13} /> {streak}일 연속 복약 완료
            </p>
          )}
        </div>
        <ProgressRing value={rate} size={92} stroke={9} trackClassName="stroke-white/20" barClassName="stroke-white">
          <span className="text-xl font-bold">{Math.round(rate * 100)}%</span>
        </ProgressRing>
      </div>
    </button>
  );
}
