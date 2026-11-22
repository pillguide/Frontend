// src/features/user/types/user.ts
import type { Gender } from "../../auth/types/onboarding";

export interface UserProfile {
  name: string;
  gender: Gender;
  birthDate: string; // "YYYY-MM-DD"
  email: string;
}

/** 소셜 로그인으로 못 받은 항목이 남아 있는지 (구글·네이버: 성별·생년월일 없음, 카카오: 이메일도 없음) */
export function isProfileComplete(p: UserProfile): boolean {
  return !!p.name.trim() && !!p.gender && !!p.birthDate && !!p.email;
}
