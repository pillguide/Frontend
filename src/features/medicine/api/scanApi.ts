// 스캔 기록 (Backend: /api/v1/scan) — 로그인 필요
import { api } from "../../../api/http";

export interface ScanSessionSummary {
  sessionId: number;
  scannedAt: string; // ISO date-time
  drugCount: number;
}

export interface ScanDrugSummary {
  drugId: number;
  name: string;
  code: string; // 식약처 품목기준코드(item_seq)
  imageUrl: string | null;
}

export interface ScanSessionDetail {
  sessionId: number;
  scannedAt: string;
  drugs: ScanDrugSummary[];
}

export const scanApi = {
  list: () => api.get<ScanSessionSummary[]>("/api/v1/scan"),
  detail: (sessionId: number) => api.get<ScanSessionDetail>(`/api/v1/scan/${sessionId}`),
  /** 인식된 약(item_seq 목록)을 스캔 기록으로 저장하고 sessionId를 돌려준다. AI 서버 연동 후 사용 */
  save: (itemSeqList: string[]) => api.post<number>("/api/v1/scan", { itemSeqList }),
};
