import { api, apiRequest } from "../../../api/http";

export interface ScanSessionSummary {
  sessionId: number;
  scannedAt: string;
  drugCount: number;
}
export interface ScanDrugSummary {
  drugId: number;
  name: string;
  code: string;
  imageUrl: string | null;
  detectionId: number | null;
  detectionIndex: number | null;
  confidence: number | null;
  bboxXyxy: number[] | null;
  recognitionMayBeDegraded: boolean | null;
  infoStatus: string | null;
  authorizationStatus: string | null;
  representativeImageStatus: string | null;
}
export interface Combination {
  uniqueDrugCount: number;
  pairCount: number;
  confirmedContraindicationCount: number;
  coverageStatus: string;
  sourceAsOf: string | null;
  refreshDelayed: boolean;
  matches: {
    firstName: string;
    secondName: string;
    evidenceType: string;
    officialReason: string | null;
    summary: string | null;
    sourceAsOf: string | null;
  }[];
}
export interface ScanSessionDetail {
  sessionId: number;
  scannedAt: string;
  drugCount: number;
  drugs: ScanDrugSummary[];
  legacy: boolean;
  requestId: string | null;
  imageSize: { width: number; height: number } | null;
  modelSha256: string | null;
  mappingSha256: string | null;
  referenceVersion: string | null;
  combination: Combination | null;
  userImageAvailable: boolean;
  imageComparisonStatus: string;
}
export const scanApi = {
  list: () => api.get<ScanSessionSummary[]>("/api/v1/scan"),
  detail: (id: number) => api.get<ScanSessionDetail>(`/api/v1/scan/${id}`),
  scan: (file: File, requestId: string, signal?: AbortSignal) => {
    const body = new FormData();
    body.append("file", file);
    body.append("requestId", requestId);
    return apiRequest<ScanSessionDetail>("/api/v1/scan", {
      method: "POST",
      body,
      signal,
    });
  },
};
