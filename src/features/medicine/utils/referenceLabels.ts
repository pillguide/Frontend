const infoLabels: Record<string, string> = {
  COMPLETE: "자료 수집 완료",
  PARTIAL: "일부 자료 부족",
  NO_OFFICIAL_RECORD: "공식 자료 없음",
};
const authorizationLabels: Record<string, string> = {
  NORMAL: "정상",
  ABNORMAL: "정상 외 상태, 확인 필요",
  UNKNOWN: "확인 불가",
  NO_OFFICIAL_RECORD: "공식 자료 없음",
};
const evidenceLabels: Record<string, string> = {
  DIRECT_ITEM: "품목 직접 근거",
  INGREDIENT_LINK: "성분 연결 근거",
};
export const infoStatusLabel = (value: string | null) =>
  infoLabels[value ?? ""] ?? "확인 불가";
export const authorizationStatusLabel = (value: string | null) =>
  authorizationLabels[value ?? ""] ?? "확인 불가";
export const evidenceTypeLabel = (value: string) =>
  evidenceLabels[value] ?? "유형 확인 불가";
