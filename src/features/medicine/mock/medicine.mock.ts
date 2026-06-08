// src/features/medicine/mock/medicine.mock.ts
import type { MedicineDetailResponse, ScanRecordItem } from "../types/medicine";
import type { SingleMedicineDetail } from "../types/medicine";

const singleMedicineMocks: Record<number, SingleMedicineDetail> = {
  11: {
    id: 11,
    name: "세티스정(세티리진염산염)",
    imageUrl: "/pill/cetis_nukki.png",
    tags: [
      { label: "항히스타민제", variant: "default" },
      { label: "알레르기 완화", variant: "warning" },
    ],
    effects: [
      "계절성 및 다년성 알레르기성 비염 완화",
      "알레르기성 결막염 완화",
      "만성 특발성 두드러기 완화",
      "피부소양증 및 습진·피부염 개선",
    ],
    sideEffects: [
      "졸음, 두통, 권태감",
      "어지러움, 피로, 무력증",
      "구역, 위장 장애",
      "드물게 과민성 쇼크",
    ],
    usage: [
      "성인 및 6세 이상: 1일 1회 1정(10mg) 취침 전 복용",
      "이상반응에 민감한 경우: 1/2정씩 아침·저녁 분할 복용",
      "신장애 환자는 용량 조절 필요 (의사 상담)",
      "연령·증상에 따라 적절히 증감",
    ],
    storage: [
      "실온에서 보관",
      "어린이의 손이 닿지 않는 곳에 보관",
    ],
  },
  12: {
    id: 12,
    name: "펜잘큐정",
    imageUrl: "/pill/penzal_nukki.png",
    tags: [
      { label: "해열·진통제", variant: "default" },
      { label: "아세트아미노펜", variant: "warning" },
    ],
    effects: [
      "두통, 치통, 발치 후 통증 완화",
      "인후통, 관절통, 신경통, 근육통 진통",
      "월경통, 염좌통 해소",
      "오한·발열 시 해열",
    ],
    sideEffects: [
      "간 손상 (과음자·과량 복용 시 위험)",
      "발진, 가려움 등 알레르기 반응",
      "위장 장애, 소화관 출혈",
      "드물게 스티븐스-존슨증후군",
    ],
    usage: [
      "만 15세 이상 성인: 1회 1정, 1일 3회",
      "만 11세~15세 미만: 1회 1/2~2/3정, 1일 3회",
      "만 8세~11세 미만: 1회 1/2정, 1일 3회",
      "빈 속을 피하여 4시간 이상 간격으로 복용",
    ],
    storage: [
      "습기와 빛을 피해 실온에서 보관",
      "어린이의 손이 닿지 않는 곳에 보관",
    ],
  },
  13: {
    id: 13,
    name: "큐레틴정(빌베리건조엑스)",
    imageUrl: "/pill/qretin_nukki.png",
    tags: [
      { label: "눈 건강", variant: "default" },
    ],
    effects: [
      "당뇨병에 의한 망막변성 개선",
      "눈의 혈관장애 개선",
      "야맹증 완화",
    ],
    sideEffects: [
      "경미한 속쓰림, 구역 등 위장 장애",
      "발진, 가려움",
    ],
    usage: [
      "빌베리건조엑스로서 1회 170mg",
      "1일 2~3회 식후 복용",
    ],
    storage: [
      "기밀용기, 실온(1~30℃) 보관",
      "직사광선을 피하고 습기가 적은 서늘한 곳에 보관",
      "어린이의 손이 닿지 않는 곳에 보관",
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
    title: "세티스정 · 펜잘큐정 · 큐레틴정",
    thumbnail: "/pill/pills_all.png",
    scannedAt: "2026.06.08 스캔",
  },
];

export const medicineDetailMock: MedicineDetailResponse = {
  id: 1,
  title: "알레르기 · 진통 · 눈 건강",
  gallery: [
    "/pill/cetis_nukki.png",
    "/pill/penzal_nukki.png",
    "/pill/qretin_nukki.png",
  ],
  description: "알레르기 완화, 해열·진통, 눈 건강을 위한 조합이에요",
  warningMessage:
    "펜잘큐정에 아세트아미노펜 성분이 포함되어 있어요. 다른 해열진통제나 감기약과 함께 복용하지 마세요.",
  medicines: [
    {
      id: 11,
      name: "세티스정",
      imageUrl: "/pill/cetis_nukki.png",
    },
    {
      id: 12,
      name: "펜잘큐정",
      imageUrl: "/pill/penzal_nukki.png",
      warning: "해열진통제와 중복 복용 주의",
    },
    {
      id: 13,
      name: "큐레틴정",
      imageUrl: "/pill/qretin_nukki.png",
    },
  ],
};