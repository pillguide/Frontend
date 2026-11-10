// src/features/search/utils/searchMedicine.ts
// 최근 검색어 저장 (검색 자체는 서버 API: GET /api/v1/drugs/search)

const RECENT_KEY = "recentSearches";
const MAX_RECENT = 8;

export const recentSearchStorage = {
  get(): string[] {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
    } catch {
      return [];
    }
  },
  set(list: string[]) {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
    } catch {
      // 무시
    }
  },
};
