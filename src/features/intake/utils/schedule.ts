// src/features/intake/utils/schedule.ts
// 알람 설정 → 날짜별 복약 일정 계산
import type { Alarm } from "../../alarm/types/alarm";
import { toDateKey } from "./date";

export type IntakeLog = Record<string, number[]>; // dateKey → 복용 완료한 alarmId 목록

export interface ScheduledDose {
  alarm: Alarm;
  taken: boolean;
}

export interface DayStats {
  total: number;
  taken: number;
  rate: number; // 0~1, 일정 없으면 0
}

/** 반복 요일이 있는 알람은 해당 요일에, 반복 없는 알람은 오늘에만 표시 */
export function alarmsForDate(alarms: Alarm[], date: Date, today: Date): Alarm[] {
  const key = toDateKey(date);
  const todayKey = toDateKey(today);
  return alarms
    .filter((a) => a.enabled)
    .filter((a) => (a.repeatDays.length === 0 ? key === todayKey : a.repeatDays.includes(date.getDay() as Alarm["repeatDays"][number])))
    .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
}

export function dosesForDate(alarms: Alarm[], log: IntakeLog, date: Date, today: Date): ScheduledDose[] {
  const takenIds = log[toDateKey(date)] ?? [];
  return alarmsForDate(alarms, date, today).map((alarm) => ({ alarm, taken: takenIds.includes(alarm.id) }));
}

export function statsOf(doses: ScheduledDose[]): DayStats {
  const total = doses.length;
  const taken = doses.filter((d) => d.taken).length;
  return { total, taken, rate: total === 0 ? 0 : taken / total };
}
