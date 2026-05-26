export interface TodayMedication {
  id: number;
  medicineName: string;
  time: string;
  taken: boolean;
}

export interface ScanPreview {
  id: number;
  title: string;
  imageUrl: string;
}

export interface HomeResponse {
  userName: string;
  heroMessage: string;
  todayMedications: TodayMedication[];
  recentScan: ScanPreview | null;
}