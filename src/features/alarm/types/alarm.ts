// src/features/alarm/types/alarm.ts

/** 0 = 일요일 ... 6 = 토요일 (Date.getDay()와 동일) */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Alarm {
  id: number;
  medicineName: string;
  dosage?: string;        // "1알" 등 (서버 저장 시 필수)
  hour: number;           // 0~23
  minute: number;         // 0~59
  repeatDays: Weekday[];  // 비어 있으면 시작일 하루만
  memo: string;
  enabled: boolean;       // 목록 토글 (꺼도 복약 체크리스트는 유지)
  startDate?: string;     // 서버 알림의 복약 시작일 (YYYY-MM-DD)
}

export type AlarmDraft = Omit<Alarm, "id" | "enabled" | "startDate">;
