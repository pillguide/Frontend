// 회원 추가 정보 (Backend: POST /api/v1/member/additional_info) — 소셜 로그인 직후, 로그인 필요
import { api } from "../../../api/http";

export interface MemberAdditionalInfo {
  gender: "MALE" | "FEMALE";
  birthDate: string; // YYYY-MM-DD
  email?: string; // 카카오 로그인은 필수
}

export const memberApi = {
  submitAdditionalInfo: (info: MemberAdditionalInfo) => api.post("/api/v1/member/additional_info", info),
};
