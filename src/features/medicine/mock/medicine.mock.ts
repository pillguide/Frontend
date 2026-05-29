// src/features/medicine/mock/medicine.mock.ts
import type { MedicineDetailResponse, ScanRecordItem } from "../types/medicine";
import type { SingleMedicineDetail } from "../types/medicine";

export const singleMedicineMock: SingleMedicineDetail = {
  id: 11,
  name: "타이레놀",
  imageUrl:
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=300&q=80",
  tags: [
    { label: "해열·진통제", variant: "default" },
    { label: "성인용", variant: "warning" },
  ],
  effects: [
    "두통, 치통, 발치 후 통증의 완화",
    "근육통, 신경통, 관절통의 진통",
    "감기로 인한 발열 및 통증 완화",
    "월경통, 염좌통의 해소",
  ],
  sideEffects: [
    "간 손상 (특히 과량 복용 시)",
    "알레르기 반응 (발진, 가려움)",
    "위장 장애 (드물게)",
    "피부 발진",
  ],
  usage: [
    "성인: 1회 500mg, 1일 3~4회 복용",
    "최소 4시간 간격 유지",
    "1일 최대 4,000mg을 초과하지 않기",
    "충분한 물과 함께 복용",
  ],
  storage: [
    "직사광선을 피하고 서늘한 곳에 보관",
    "어린이의 손이 닿지 않는 곳에 보관",
    "습기가 적은 곳에 보관",
    "개봉 후 밀봉하여 보관",
  ],
};

// API 함수 추가
export function getSingleMedicine(id: number): Promise<SingleMedicineDetail> {
  // 백엔드 연결 시 여기만 axios.get(`/api/medicines/${id}`) 로 교체
  return Promise.resolve({ ...singleMedicineMock, id });
}

export const scanRecordMock: ScanRecordItem[] = [
  {
    id: 1,
    title: "감기·통증 완화 조합",
    thumbnail:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    scannedAt: "2025.12.20 스캔",
  },
];

export const medicineDetailMock: MedicineDetailResponse = {
  id: 1,
  title: "감기·통증 완화 조합",
  gallery: [
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=500&q=80",
  ],
  description: "감기 증상 완화와 두통·근육통 진통 효과가 있어요",
  warningMessage: "아세트아미노펜 성분이 중복되어 있어요. 함께 복용 시 간에 무리가 갈 수 있어요.",
  medicines: [
    {
      id: 11,
      name: "타이레놀",
      imageUrl:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=300&q=80",
      warning: "종합감기약과 성분 중복",
    },
    {
      id: 12,
      name: "종합감기약",
      imageUrl:
        "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=300&q=80",
      warning: "타이레놀과 성분 중복",
    },
    {
      id: 13,
      name: "비타민C",
      imageUrl:
        "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=300&q=80",
    },
  ],
};