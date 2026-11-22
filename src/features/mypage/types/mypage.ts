// src/features/mypage/types/mypage.ts
export interface QuickAction {
  id: number;
  label: string;
  path: string;
  variant: "primary" | "secondary";  // ← 추가
}

export interface MyPageMenuItem {
  id: number;
  label: string;
  path: string;
}
