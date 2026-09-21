// src/features/alarm/utils/alarmFormat.ts
import type { Weekday } from "../types/alarm";

export const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** 8:00 AM 형식 (디자인 표기 기준) */
export function formatAlarmTime(hour: number, minute: number): string {
  const period = hour < 12 ? "AM" : "PM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${String(minute).padStart(2, "0")} ${period}`;
}

/** 반복 요일 요약: 안 함 / 매일 / 주중 / 주말 / 월 및 목 / 월, 수, 금 */
export function formatRepeatDays(days: Weekday[]): string {
  const sorted = [...days].sort((a, b) => a - b);
  const key = sorted.join(",");
  if (sorted.length === 0) return "안 함";
  if (sorted.length === 7) return "매일";
  if (key === "1,2,3,4,5") return "주중";
  if (key === "0,6") return "주말";
  const labels = sorted.map((d) => WEEKDAY_LABELS[d]);
  if (labels.length === 2) return `${labels[0]} 및 ${labels[1]}`;
  return labels.join(", ");
}
