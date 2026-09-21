export interface Pill {
  name: string;        // 약 이름
  type: string;        // 분류 (해열진통제 등)
  confidence: number;  // 신뢰도 (0~1)
  warning: string;     // 주의사항
}