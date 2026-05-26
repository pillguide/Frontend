import type { MedicineDetailResponse, ScanRecordItem } from "../types/medicine";

export const scanRecordMock: ScanRecordItem[] = [
  {
    id: 1,
    title: "종합 감기약 조합",
    thumbnail:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
  },
];

export const medicineDetailMock: MedicineDetailResponse = {
  id: 1,
  title: "종합 감기약 조합",
  gallery: [
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=500&q=80",
  ],
  description: "코감기, 목감기 완화에 효과적이에요!",
  safeMessage: "함께 복용해도 안전해요",
  warningMessage: "일부 성분이 포함된 약은 확인이 필요해요",
  medicines: [
    {
      id: 11,
      name: "아스피린",
      imageUrl:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=300&q=80",
      warning: "아스피린과 중복",
    },
    {
      id: 12,
      name: "약 이름",
      imageUrl:
        "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 13,
      name: "약 이름",
      imageUrl:
        "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=300&q=80",
      warning: "아스피린과 충돌",
    },
  ],
};