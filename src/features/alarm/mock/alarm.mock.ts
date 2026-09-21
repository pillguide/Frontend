// src/features/alarm/mock/alarm.mock.ts
import type { Alarm } from "../types/alarm";

export const alarmMock: Alarm[] = [
  { id: 1, medicineName: "아스피린", hour: 8, minute: 0, repeatDays: [0, 1, 2, 3, 4, 5, 6], memo: "", snoozeEnabled: true, snoozeMinutes: 9, enabled: true },
  { id: 2, medicineName: "심장약", hour: 8, minute: 0, repeatDays: [1, 4], memo: "", snoozeEnabled: true, snoozeMinutes: 9, enabled: true },
  { id: 3, medicineName: "멜라토닌", dosage: "1알", hour: 22, minute: 0, repeatDays: [], memo: "자기 30분 전", snoozeEnabled: false, snoozeMinutes: 9, enabled: false },
];
