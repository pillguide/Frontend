// src/features/search/utils/searchMedicine.ts
import { medicineCatalog, type MedicineSearchItem } from "../../medicine/mock/medicine.mock";

/** 띄어쓰기·대소문자·단위 표기(밀리그램/밀리그람/mg) 차이를 무시 */
export function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "").replace(/밀리그[램람]/g, "mg");
}

export function searchMedicines(query: string): MedicineSearchItem[] {
  const q = normalize(query);
  if (!q) return [];
  return medicineCatalog
    .map((item) => {
      const name = normalize(item.name);
      const score = name.startsWith(q) ? 3 : name.includes(q) ? 2 : normalize(`${item.category}${item.ingredient}`).includes(q) ? 1 : 0;
      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}

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
