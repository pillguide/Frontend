// src/features/intake/hooks/useIntakeStats.ts
import { useMemo } from "react";
import { useAlarms } from "../../alarm/context/AlarmContext";
import { useIntake } from "../context/IntakeContext";
import { addDays, startOfDay, weekDates } from "../utils/date";
import { dosesForDate, statsOf } from "../utils/schedule";

/** 특정 날짜의 복약 일정 + 완료 여부 */
export function useDoses(date: Date) {
  const { alarms } = useAlarms();
  const { log } = useIntake();
  const time = startOfDay(date).getTime();

  return useMemo(() => {
    const doses = dosesForDate(alarms, log, new Date(time), new Date());
    return { doses, ...statsOf(doses) };
  }, [alarms, log, time]);
}

/** 주간 통계 + 연속 복약일 */
export function useWeekStats(anchor: Date) {
  const { alarms } = useAlarms();
  const { log } = useIntake();
  const time = startOfDay(anchor).getTime();

  return useMemo(() => {
    const today = startOfDay(new Date());
    const days = weekDates(new Date(time)).map((date) => {
      const stats = statsOf(dosesForDate(alarms, log, date, today));
      return { date, ...stats, isFuture: date > today };
    });
    const counted = days.filter((d) => !d.isFuture);
    const total = counted.reduce((s, d) => s + d.total, 0);
    const taken = counted.reduce((s, d) => s + d.taken, 0);
    return { days, total, taken, rate: total === 0 ? 0 : taken / total };
  }, [alarms, log, time]);
}

/** 오늘까지 하루 일정을 전부 챙긴 날이 며칠 연속인지 (오늘이 아직 미완료면 어제부터 셈) */
export function useStreak() {
  const { alarms } = useAlarms();
  const { log } = useIntake();

  return useMemo(() => {
    const today = startOfDay(new Date());
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const date = addDays(today, -i);
      const { total, taken } = statsOf(dosesForDate(alarms, log, date, today));
      if (total === 0) continue; // 일정 없는 날은 건너뜀
      if (taken === total) streak++;
      else if (i === 0) continue; // 오늘은 아직 진행 중
      else break;
    }
    return streak;
  }, [alarms, log]);
}
