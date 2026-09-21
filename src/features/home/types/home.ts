// src/features/home/types/home.ts
export interface TodayMedication {
  id: number;
  medicineName: string;
  timeLabel: string;      // "아침", "저녁" 등
  scheduledTime: string;  // "08:00"
  taken: boolean;
}

export interface NextMedication {
  time: string;           // "오후 6시"
  medicineName: string;   // "종합감기약"
}

export interface HomeResponse {
  userName: string;
  todayMedications: TodayMedication[];
  nextMedication: NextMedication | null;
  // heroMessage, recentScan 제거 (스캔은 하단 고정 진입점으로)
}