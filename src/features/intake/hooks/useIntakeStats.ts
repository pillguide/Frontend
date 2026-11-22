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
  return view(result, key, requestKey);
}
/**
 * 체크 등으로 다시 불러오는 동안(revision만 바뀐 경우)에는 이전 데이터를 그대로 보여준다.
 * 날짜처럼 key 자체가 바뀌었을 때만 불러오는 중으로 처리 → 체크할 때 화면이 깜빡이지 않음
 */
function view<T>(result: Result<T> | null, key: string, requestKey: string) {
  const active = result?.key === requestKey ? result : null;
  const stale = !active && result?.data !== undefined && result.key.startsWith(`${key}:`) ? result : null;
  const shown = active ?? stale;
  return { data: shown?.data, error: active?.error, loading: !shown && authStorage.isLoggedIn() };
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
  return view(result, key, requestKey);
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
