// src/features/alarm/types/alarm.ts

/** 0 = 일요일 ... 6 = 토요일 (Date.getDay()와 동일) */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Alarm {
  id: number;
  medicineName: string;
  dosage?: string;        // "1알" 등, 없으면 표시 안 함
  hour: number;           // 0~23
  minute: number;         // 0~59
  repeatDays: Weekday[];  // 비어 있으면 반복 안 함
  memo: string;
  snoozeEnabled: boolean; // 다시 알림
  snoozeMinutes: number;  // 다시 알림 연기 시간(분)
  enabled: boolean;       // 목록 토글
}

export type AlarmDraft = Omit<Alarm, "id" | "enabled">;
