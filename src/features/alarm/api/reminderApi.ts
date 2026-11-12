// 복약 알림 API (Backend: /api/v1/medication/reminders)
import { api } from "../../../api/http";
import type { Alarm, AlarmDraft, Weekday } from "../types/alarm";
import { koreaToday, toDateKey } from "../../intake/utils/date";

// java.time.DayOfWeek 이름. 인덱스는 Date.getDay()와 같은 0=일요일 기준
const DAY_NAMES = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;
type DayName = (typeof DAY_NAMES)[number];

interface ReminderResponse {
  id: number;
  medicationName: string;
  dosage: string;
  time: string; // "08:00" 또는 "08:00:00"
  startDate: string; // "2026-11-10"
  repeatDays: DayName[]; // 비어 있으면 startDate 하루만
  memo: string | null;
  enabled: boolean;
}

interface ReminderRequest {
  medicationName: string;
  dosage: string;
  time: string;
  startDate: string;
  repeatDays: DayName[];
  memo: string;
  enabled: boolean;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** 서버와 같은 한국 시간 기준 오늘 날짜 (YYYY-MM-DD) */
export function todayString(date = new Date()): string {
  return toDateKey(koreaToday(date));
}

function toAlarm(res: ReminderResponse): Alarm {
  const [hour, minute] = res.time.split(":").map(Number);
  const repeatDays = res.repeatDays
    .map((d) => DAY_NAMES.indexOf(d))
    .filter((d): d is Weekday => d >= 0)
    .sort((a, b) => a - b);
  return {
    id: res.id,
    medicineName: res.medicationName,
    dosage: res.dosage,
    hour,
    minute,
    repeatDays,
    memo: res.memo ?? "",
    enabled: res.enabled,
    startDate: res.startDate,
  };
}

function toRequest(draft: AlarmDraft, enabled: boolean, startDate: string): ReminderRequest {
  return {
    medicationName: draft.medicineName,
    dosage: draft.dosage ?? "",
    time: `${pad(draft.hour)}:${pad(draft.minute)}`,
    startDate,
    repeatDays: draft.repeatDays.map((d) => DAY_NAMES[d]),
    memo: draft.memo,
    enabled,
  };
}

const BASE = "/api/v1/medication/reminders";

export const reminderApi = {
  list: async () => (await api.get<ReminderResponse[]>(BASE)).map(toAlarm),
  create: async (draft: AlarmDraft) => toAlarm(await api.post<ReminderResponse>(BASE, toRequest(draft, true, todayString()))),
  update: async (alarm: Alarm, draft: AlarmDraft) =>
    toAlarm(await api.put<ReminderResponse>(`${BASE}/${alarm.id}`, toRequest(draft, alarm.enabled, alarm.startDate ?? todayString()))),
  setEnabled: async (id: number, enabled: boolean) =>
    toAlarm(await api.patch<ReminderResponse>(`${BASE}/${id}/enabled`, { enabled })),
  remove: (ids: number[]) =>
    ids.length === 1 ? api.delete(`${BASE}/${ids[0]}`) : api.post(`${BASE}/bulk-delete`, { ids }),
};
