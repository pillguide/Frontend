// src/features/alarm/mock/alarm.mock.ts
import type { Alarm } from "../types/alarm";

const EVERY_DAY: Alarm["repeatDays"] = [0, 1, 2, 3, 4, 5, 6];

export const alarmMock: Alarm[] = [
  { id: 1, medicineName: "아스피린", dosage: "1정", hour: 8, minute: 0, repeatDays: EVERY_DAY, memo: "아침 식후", snoozeEnabled: true, snoozeMinutes: 9, enabled: true },
  { id: 2, medicineName: "비타민D", dosage: "1정", hour: 12, minute: 30, repeatDays: EVERY_DAY, memo: "", snoozeEnabled: true, snoozeMinutes: 9, enabled: true },
  { id: 3, medicineName: "종합감기약", dosage: "1포", hour: 18, minute: 0, repeatDays: EVERY_DAY, memo: "저녁 식후 30분", snoozeEnabled: true, snoozeMinutes: 9, enabled: true },
  { id: 4, medicineName: "심장약", hour: 20, minute: 0, repeatDays: [1, 4], memo: "", snoozeEnabled: true, snoozeMinutes: 9, enabled: true },
  { id: 5, medicineName: "멜라토닌", dosage: "1알", hour: 22, minute: 0, repeatDays: [], memo: "자기 30분 전", snoozeEnabled: false, snoozeMinutes: 9, enabled: false },
];
