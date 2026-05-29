// src/features/medicine/types/medicine.ts
export interface ScanRecordItem {
  id: number;
  title: string;
  thumbnail: string;
  scannedAt: string;  // ← 추가
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
  safeMessage?: string;     // optional로 (조합에 따라 없을 수도 있음)
  warningMessage?: string;
  medicines: MedicineItem[];
}

export interface MedicineTag {
  label: string;
  variant: "default" | "warning"; // 회색 / 앰버
}

export interface SingleMedicineDetail {
  id: number;
  name: string;
  imageUrl: string;
  tags: MedicineTag[];
  effects: string[];        // 주요 효능 (항상 펼침)
  sideEffects: string[];    // 부작용
  usage: string[];          // 복용 방법
  storage: string[];        // 보관 방법
}