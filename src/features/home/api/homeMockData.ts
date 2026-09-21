import type { HomeResponse } from "../types/home";

export const homeMockData: HomeResponse = {
  userName: "이태정",
  todayMedications: [
    { id: 1, medicineName: "아스피린", timeLabel: "아침", scheduledTime: "08:00", taken: true },
    { id: 2, medicineName: "종합감기약", timeLabel: "저녁", scheduledTime: "18:00", taken: false },
    { id: 3, medicineName: "비타민D", timeLabel: "저녁", scheduledTime: "18:00", taken: false },
  ],
  nextMedication: {
    time: "오후 6시",
    medicineName: "종합감기약",
  },
};