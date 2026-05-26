import type { HomeResponse } from "../types/home";

export const homeMockData: HomeResponse = {
  userName: "이태정",
  heroMessage: "오늘도 건강하게 시작해요!",
  todayMedications: [
    {
      id: 1,
      medicineName: "종합감기약 조합",
      time: "오전 08:00",
      taken: false,
    },
    {
      id: 2,
      medicineName: "비타민",
      time: "오후 07:00",
      taken: true,
    },
  ],
  recentScan: {
    id: 101,
    title: "종합 감기약 조합",
    imageUrl:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
  },
};