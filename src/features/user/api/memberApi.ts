// 회원 추가 정보 (Backend: POST /api/v1/member/additional_info) — 소셜 로그인 직후, 로그인 필요
import type { UserProfile } from "../types/user";
import { api } from "../../../api/http";

export interface MemberAdditionalInfo {
  gender: "MALE" | "FEMALE";
  birthDate: string; // YYYY-MM-DD
  email?: string; // 카카오 로그인은 필수
}

export interface MemberResponse { name: string; gender: "MALE" | "FEMALE" | null; birthDate: string | null; email: string | null }
const toProfile = (p: MemberResponse): UserProfile => ({ ...p, birthDate: p.birthDate ?? "", email: p.email ?? "" });
export const memberApi = {
  me: async () => toProfile(await api.get<MemberResponse>("/api/v1/member/me")),
  update: async (patch: Partial<UserProfile>) => toProfile(await api.put<MemberResponse>("/api/v1/member/me", patch)),
  submitAdditionalInfo: (info: MemberAdditionalInfo) => api.post("/api/v1/member/additional_info", info),
};
