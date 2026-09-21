export type Gender = "MALE" | "FEMALE" | null;

export type OnboardingForm = {
  name: string;
  gender: Gender;
  birthDate: string; // "YYYY-MM-DD"
  email: string;
};