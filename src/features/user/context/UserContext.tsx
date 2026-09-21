// src/features/user/context/UserContext.tsx
// 로그인 사용자 프로필. 백엔드 연결 전까지 localStorage에 저장.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { UserProfile } from "../types/user";
import { userMock } from "../mock/user.mock";

const STORAGE_KEY = "userProfile";

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...userMock, ...(JSON.parse(raw) as Partial<UserProfile>) };
  } catch {
    // storage 접근 불가 → mock
  }
  return userMock;
}

interface UserContextValue {
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // 무시
    }
  }, [profile]);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo(() => ({ profile, updateProfile }), [profile, updateProfile]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser는 UserProvider 안에서만 사용할 수 있어요");
  return ctx;
}
