// src/features/intake/utils/date.ts
export const WEEKDAY_SHORT = ["일", "월", "화", "수", "목", "금", "토"] as const;

export function toDateKey(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, days: number): Date {
  const next = startOfDay(d);
  next.setDate(next.getDate() + days);
  return next;
}

/** 일요일 시작 주 */
export function startOfWeek(d: Date): Date {
  return addDays(d, -d.getDay());
}

export function weekDates(d: Date): Date[] {
  const start = startOfWeek(d);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** 9월 21일 */
export function formatMonthDay(d: Date): string {
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/** 9월 3주차 (주의 목요일 기준 월로 계산) */
export function formatWeekLabel(d: Date): string {
  const thursday = addDays(startOfWeek(d), 4);
  const first = new Date(thursday.getFullYear(), thursday.getMonth(), 1);
  const firstThursday = addDays(first, (4 - first.getDay() + 7) % 7);
  const week = Math.floor((thursday.getTime() - firstThursday.getTime()) / (7 * 86400000)) + 1;
  return `${thursday.getMonth() + 1}월 ${week}주차`;
}

/** 오후 8시 / 오전 8시 30분 */
export function formatKoreanTime(hour: number, minute: number): string {
  const period = hour < 12 ? "오전" : "오후";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0 ? `${period} ${h}시` : `${period} ${h}시 ${minute}분`;
}

/** 복약 시간대 묶음 */
export function timeOfDayLabel(hour: number): string {
  if (hour < 11) return "아침";
  if (hour < 15) return "점심";
  if (hour < 21) return "저녁";
  return "자기 전";
}
