// src/features/user/types/user.ts
import type { Gender } from "../../auth/types/onboarding";

export interface UserProfile {
  name: string;
  gender: Gender;
  birthDate: string; // "YYYY-MM-DD"
  email: string;
}
