import { api } from "../../../api/http";

export interface Dose {
  id: number; reminderId: number; medicationName: string; dosage: string;
  scheduledAt: string; memo: string | null; status: "TAKEN" | "SCHEDULED" | "MISSED"; takenAt: string | null;
}
export interface Progress { total: number; taken: number; remaining: number; percentage: number }
export interface Day { date: string; progress: Progress; doses: Dose[] }
export interface Week { from: string; to: string; progress: Progress; days: Day[] }
export interface Home { date: string; progress: Progress; streak: number; nextDose: Dose | null; doses: Dose[] }
const base = "/api/v1/medication";
export const medicationApi = {
  home: () => api.get<Home>(`${base}/home`),
  week: (date: string) => api.get<Week>(`${base}/records/weekly?date=${encodeURIComponent(date)}`),
  check: (id: number, taken: boolean) => api.put<Dose>(`${base}/records/${id}/check`, { taken }),
};
