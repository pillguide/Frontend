import { api } from "../../../api/http";
export interface MyDrug {
  memberDrugId: number;
  drugId: number;
  name: string;
  code: string;
  imageUrl: string | null;
  infoStatus: string | null;
  authorizationStatus: string | null;
  sourceAsOf: string | null;
  representativeImageStatus: string;
}
export interface MyDrugPage {
  items: MyDrug[];
  page: number;
  hasNext: boolean;
}
export const myDrugApi = {
  save: (scanSessionId: number, detectionIds: number[]) =>
    api.post<MyDrug[]>("/api/v1/my-drugs", { scanSessionId, detectionIds }),
  list: (page = 0) =>
    api.get<MyDrugPage>(`/api/v1/my-drugs?page=${page}&size=20`),
  remove: (id: number) => api.delete<number>(`/api/v1/my-drugs/${id}`),
};
