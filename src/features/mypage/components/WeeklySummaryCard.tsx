// src/features/mypage/components/WeeklySummaryCard.tsx
import { ChevronRight, Flame } from "lucide-react";
import ProgressRing from "../../../components/ui/ProgressRing";
import { useStreak, useWeekStats } from "../../intake/hooks/useIntakeStats";

export default function WeeklySummaryCard({ onClick }: { onClick: () => void }) {
  const week = useWeekStats(new Date());
  const streak = useStreak();

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-[24px] bg-white p-4 text-left shadow-card"
    >
      <ProgressRing value={week.rate} size={56} stroke={6}>
        <span className="text-sm font-bold text-primary">{Math.round(week.rate * 100)}%</span>
      </ProgressRing>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-500">이번 주 복용률</p>
        <p className="text-base font-semibold text-slate-900">
          {week.total}회 중 {week.taken}회 복용
        </p>
      </div>
      {streak > 0 && (
        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
          <Flame size={13} /> {streak}일
        </span>
      )}
      <ChevronRight size={18} className="text-slate-300" />
    </button>
  );
}
