// src/features/intake/pages/CheckRecordPage.tsx
// 마이페이지 > 복약 체크 기록
import { useState } from "react";
import { BellOff, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";
import ProgressRing from "../../../components/ui/ProgressRing";
import { ROUTES } from "../../../constants/routes";
import { useIntake } from "../context/IntakeContext";
import { useDoses, useStreak, useWeekStats } from "../hooks/useIntakeStats";
import { WEEKDAY_SHORT, addDays, formatKoreanTime, formatMonthDay, formatWeekLabel, startOfDay, toDateKey } from "../utils/date";
import type { ScheduledDose } from "../utils/schedule";
import WeekStrip from "../components/WeekStrip";
import DoseCard from "../components/DoseCard";

export default function CheckRecordPage() {
  const navigate = useNavigate();
  const today = startOfDay(new Date());
  const [selected, setSelected] = useState<Date>(today);
  const { toggleTaken } = useIntake();

  const week = useWeekStats(selected);
  const streak = useStreak();
  const { doses, total, taken } = useDoses(selected);

  const isToday = toDateKey(selected) === toDateKey(today);
  const isFuture = selected > today;
  const isCurrentWeek = week.days.some((d) => toDateKey(d.date) === toDateKey(today));

  // 같은 시각끼리 묶기
  const groups = doses.reduce<{ key: string; label: string; items: ScheduledDose[] }[]>((acc, dose) => {
    const key = `${dose.alarm.hour}:${dose.alarm.minute}`;
    const last = acc[acc.length - 1];
    if (last?.key === key) last.items.push(dose);
    else acc.push({ key, label: formatKoreanTime(dose.alarm.hour, dose.alarm.minute), items: [dose] });
    return acc;
  }, []);

  const handleToggle = (alarmId: number, name: string) => {
    const nowTaken = toggleTaken(selected, alarmId);
    if (nowTaken) toast.success(`${name} 복용을 기록했어요`);
  };

  return (
    <MobileLayout showBottomNav={false}>
      <PageHeader title="복약 체크 기록" />

      <div className="space-y-4 px-5 pb-10 pt-5">
        {/* 주간 요약 */}
        <div className="flex items-center gap-4 rounded-[24px] bg-gradient-to-br from-primary to-primary-400 p-5 text-white shadow-card">
          <ProgressRing value={week.rate} size={72} stroke={7} trackClassName="stroke-white/20" barClassName="stroke-white">
            <span className="text-lg font-bold">{Math.round(week.rate * 100)}%</span>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white/80">{isCurrentWeek ? "이번 주" : formatWeekLabel(selected)} 복용률</p>
            <p className="mt-0.5 text-xl font-bold">
              {week.total}회 중 {week.taken}회 복용
            </p>
            {streak > 0 && (
              <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">
                <Flame size={13} /> {streak}일 연속 복약 완료
              </p>
            )}
          </div>
        </div>

        {/* 주간 캘린더 */}
        <div className="rounded-[24px] bg-white p-4 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSelected((d) => addDays(d, -7))}
              aria-label="이전 주"
              className="flex size-9 items-center justify-center rounded-full bg-slate-50 text-slate-600"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">{formatWeekLabel(selected)}</span>
              {!isToday && (
                <button
                  type="button"
                  onClick={() => setSelected(today)}
                  className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary"
                >
                  오늘
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelected((d) => addDays(d, 7))}
              aria-label="다음 주"
              className="flex size-9 items-center justify-center rounded-full bg-slate-50 text-slate-600"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <WeekStrip days={week.days} selected={selected} onSelect={setSelected} />
        </div>

        {/* 선택한 날짜 */}
        <div className="flex items-end justify-between px-1 pt-1">
          <h2 className="text-lg font-bold text-slate-900">
            {formatMonthDay(selected)} ({WEEKDAY_SHORT[selected.getDay()]})
            {isToday && <span className="ml-1.5 text-primary">오늘</span>}
          </h2>
          {total > 0 && (
            <span className="text-sm text-slate-500">
              <b className="text-primary">{taken}</b> / {total} 복용
            </span>
          )}
        </div>

        {groups.length === 0 ? (
          <div className="flex flex-col items-center rounded-[24px] bg-white px-6 py-12 text-center shadow-card">
            <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-slate-50">
              <BellOff size={26} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700">알림이 없습니다</p>
            <p className="mt-1 text-sm text-slate-500">이 날짜에 예정된 알림이 없습니다</p>
            <button
              type="button"
              onClick={() => navigate(ROUTES.ALARM)}
              className="mt-5 rounded-full border border-primary px-5 py-2 text-sm font-medium text-primary"
            >
              복약 알람 설정하기
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {groups.map((g) => (
              <section key={g.key}>
                <h3 className="mb-2 px-1 text-sm font-semibold text-slate-500">{g.label}</h3>
                <div className="space-y-2.5">
                  {g.items.map((dose) => (
                    <DoseCard
                      key={dose.alarm.id}
                      dose={dose}
                      disabled={isFuture}
                      onToggle={() => handleToggle(dose.alarm.id, dose.alarm.medicineName)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
