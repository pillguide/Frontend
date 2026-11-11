import { useEffect, useRef, useState } from "react";
import { useNow } from "../../home/hooks/useNow";
import { authStorage } from "../../../utils/authStorage";
import { medicationApi, type Dose, type Home, type Week } from "../api/medicationApi";
import { useIntake } from "../context/IntakeContext";
import { toDateKey, koreaToday } from "../utils/date";
import type { ScheduledDose } from "../utils/schedule";

type Result<T> = { key: string; data?: T; error?: string };
function useResource<T>(key: string, load: () => Promise<T>) {
  const { revision } = useIntake();
  const requestKey = `${key}:${revision}`;
  const [result, setResult] = useState<Result<T> | null>(null);
  useEffect(() => {
    if (!authStorage.isLoggedIn()) return;
    let current = true;
    load().then((data) => { if (current) setResult({ key: requestKey, data }); })
      .catch(() => { if (current) setResult({ key: requestKey, error: "복약 정보를 불러오지 못했어요." }); });
    return () => { current = false; };
  }, [requestKey, load]);
  const active = result?.key === requestKey ? result : null;
  return { data: active?.data, error: active?.error, loading: !active && authStorage.isLoggedIn() };
}
const loadHome = () => medicationApi.home();
// The server sends a local date-time in Asia/Seoul, without an offset.
export function doseRefreshDelay(scheduledAt: string, now = Date.now()): number {
  return Math.max(0, Date.parse(`${scheduledAt}+09:00`) - now + 1000);
}
export function useHomeStats() {
  const now = useNow();
  const { refresh } = useIntake();
  const result = useResource<Home>(`home:${toDateKey(koreaToday(now))}`, loadHome);
  const refreshedDose = useRef<string | null>(null);
  const next = result.data?.nextDose;
  useEffect(() => {
    if (!next) return;
    const key = `${next.id}:${next.scheduledAt}`;
    if (refreshedDose.current === key) return;
    const delay = doseRefreshDelay(next.scheduledAt);
    if (!Number.isFinite(delay)) return;
    const timer = setTimeout(() => { refreshedDose.current = key; refresh(); }, delay);
    return () => clearTimeout(timer);
  }, [next, refresh]);
  return result;
}
export function useWeekStats(anchor: Date) {
  const key = toDateKey(anchor);
  // useResource needs a stable loader across renders.
  return useWeekResource(key);
}
function useWeekResource(key: string) {
  const { revision } = useIntake();
  const requestKey = `${key}:${revision}`;
  const [result, setResult] = useState<Result<Week> | null>(null);
  useEffect(() => {
    if (!authStorage.isLoggedIn()) return;
    let current = true;
    medicationApi.week(key).then((data) => { if (current) setResult({ key: requestKey, data }); })
      .catch(() => { if (current) setResult({ key: requestKey, error: "복약 기록을 불러오지 못했어요." }); });
    return () => { current = false; };
  }, [key, requestKey]);
  const active = result?.key === requestKey ? result : null;
  return { data: active?.data, error: active?.error, loading: !active && authStorage.isLoggedIn() };
}
export function toScheduledDose(d: Dose): ScheduledDose {
  const time = d.scheduledAt.split("T")[1] ?? "00:00";
  const [hour, minute] = time.split(":").map(Number);
  return { doseId: d.id, alarm: { id: d.reminderId, medicineName: d.medicationName, dosage: d.dosage,
    hour, minute, memo: d.memo ?? "", repeatDays: [], enabled: true }, taken: d.status === "TAKEN" };
}
export function weekView(week: Week) {
  const today = toDateKey(koreaToday());
  return { total: week.progress.total, taken: week.progress.taken,
    rate: week.progress.total ? week.progress.taken / week.progress.total : 0,
    days: week.days.map((day) => { const [year, month, date] = day.date.split("-").map(Number);
      return { date: new Date(year, month - 1, date), total: day.progress.total, taken: day.progress.taken,
        rate: day.progress.total ? day.progress.taken / day.progress.total : 0, isFuture: day.date > today }; }) };
}
