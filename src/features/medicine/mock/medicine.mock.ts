// src/features/medicine/mock/medicine.mock.ts
import type { MedicineDetailResponse, ScanRecordItem } from "../types/medicine";
import type { SingleMedicineDetail } from "../types/medicine";

const singleMedicineMocks: Record<number, SingleMedicineDetail> = {
  11: {
    id: 11,
    name: "타이레놀",
    imageUrl: "/images/pill_tylenol.png",
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
  },
  12: {
    id: 12,
    name: "종합감기약",
    imageUrl: "/images/pill_cold.png",
    tags: [
      { label: "감기약", variant: "default" },
      { label: "성인용", variant: "warning" },
    ],
    effects: [
      "코막힘, 콧물 완화",
      "발열 및 오한 완화",
      "인후통 완화",
      "재채기 억제",
    ],
    sideEffects: [
      "졸음 (항히스타민 성분)",
      "구강 건조",
      "위장 장애",
      "어지러움",
    ],
    usage: [
      "성인: 1회 1정, 1일 3회 복용",
      "식후 복용 권장",
      "최소 4시간 간격 유지",
      "충분한 물과 함께 복용",
    ],
    storage: [
      "직사광선을 피하고 서늘한 곳에 보관",
      "어린이의 손이 닿지 않는 곳에 보관",
      "습기가 적은 곳에 보관",
      "개봉 후 밀봉하여 보관",
    ],
  },
  13: {
    id: 13,
    name: "비타민C",
    imageUrl: "/images/pill_vitaminc.png",
    tags: [
      { label: "영양제", variant: "default" },
    ],
    effects: [
      "면역력 강화",
      "피로 회복 및 항산화 작용",
      "철분 흡수 촉진",
      "콜라겐 합성 도움",
    ],
    sideEffects: [
      "과량 복용 시 위장 장애",
      "신장 결석 (드물게)",
      "설사 (고용량 복용 시)",
    ],
    usage: [
      "성인: 1회 1정, 1일 1~2회",
      "식후 복용 권장",
      "1일 2,000mg 초과 복용 금지",
      "충분한 물과 함께 복용",
    ],
    storage: [
      "직사광선을 피하고 서늘한 곳에 보관",
      "습기가 적은 곳에 보관",
      "어린이의 손이 닿지 않는 곳에 보관",
      "개봉 후 밀봉하여 보관",
    ],
  },
};

export function getSingleMedicine(id: number): Promise<SingleMedicineDetail> {
  const data = singleMedicineMocks[id] ?? singleMedicineMocks[11];
  return Promise.resolve(data);
}

export const scanRecordMock: ScanRecordItem[] = [
  {
    id: 1,
    title: "감기·통증 완화 조합",
    thumbnail: "/images/pills.png",
    scannedAt: "2025.12.20 스캔",
  },
];

export const medicineDetailMock: MedicineDetailResponse = {
  id: 1,
  title: "감기·통증 완화 조합",
  gallery: [
    "/images/pill_tylenol.png",
    "/images/pill_cold.png",
    "/images/pill_vitaminc.png",
  ],
  description: "감기 증상 완화와 두통·근육통 진통 효과가 있어요",
  warningMessage:
    "아세트아미노펜 성분이 중복되어 있어요. 함께 복용 시 간에 무리가 갈 수 있어요.",
  medicines: [
    {
      id: 11,
      name: "타이레놀",
      imageUrl: "/images/pill_tylenol.png",
      warning: "종합감기약과 성분 중복",
    },
    {
      id: 12,
      name: "종합감기약",
      imageUrl: "/images/pill_cold.png",
      warning: "타이레놀과 성분 중복",
    },
    {
      id: 13,
      name: "비타민C",
      imageUrl: "/images/pill_vitaminc.png",
    },
  ],
};