import type { HomeResponse } from "../types/home";
import { homeMockData } from "../api/homeMockData";

export async function getHomeData(): Promise<HomeResponse> {
  // 나중에 백엔드 붙을 때 여기만 바꾸면 됨
  // const response = await client.get("/home");
  // return response.data;

  return new Promise((resolve) => {
    setTimeout(() => resolve(homeMockData), 300);
  });
}