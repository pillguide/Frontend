export interface ScanRecordItem {
  id: number;
  title: string;
  thumbnail: string;
}

export interface MedicineItem {
  id: number;
  name: string;
  imageUrl: string;
  warning?: string;
}

export interface MedicineDetailResponse {
  id: number;
  title: string;
  gallery: string[];
  description: string;
  safeMessage: string;
  warningMessage: string;
  medicines: MedicineItem[];
}