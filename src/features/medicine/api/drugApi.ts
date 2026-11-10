// 약 검색·상세 (Backend: /api/v1/drugs) — 로그인 없이 사용 가능
import { api } from "../../../api/http";

export interface DrugSearchItem {
  drugId: number;
  name: string;
  imageUrl: string | null;
}

export interface DrugSearchPage {
  items: DrugSearchItem[];
  page: number; // 0부터
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface DrugDetail {
  drugId: number;
  name: string;
  imageUrl: string | null;
  effect: string | null;
  sideEffects: string | null;
  dosageMethod: string | null;
  storageMethod: string | null;
}

export const drugApi = {
  search: (keyword: string, page = 0, size = 20) =>
    api.get<DrugSearchPage>(`/api/v1/drugs/search?${new URLSearchParams({ keyword, page: String(page), size: String(size) })}`),
  detail: (drugId: number) => api.get<DrugDetail>(`/api/v1/drugs/${drugId}`),
};
