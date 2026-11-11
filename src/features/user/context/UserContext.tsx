import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authStorage } from "../../../utils/authStorage";
import { memberApi } from "../api/memberApi";
import type { UserProfile } from "../types/user";
const blank: UserProfile = { name: "", gender: null, birthDate: "", email: "" };
interface Value { profile: UserProfile; loading: boolean; error: string | null; reload: () => void; updateProfile: (patch: Partial<UserProfile>) => Promise<void> }
const Context = createContext<Value | null>(null);
export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(blank);
  const [loading, setLoading] = useState(authStorage.isLoggedIn());
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!authStorage.isLoggedIn()) return;
    let current = true;
    memberApi.me().then((data) => { if (current) setProfile(data); })
      .catch(() => { if (current) setError("사용자 정보를 불러오지 못했어요."); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [revision]);
  const reload = useCallback(() => { setLoading(true); setError(null); setRevision((n) => n + 1); }, []);
  const updateProfile = useCallback(async (patch: Partial<UserProfile>) => {
    if (!authStorage.isLoggedIn()) throw new Error("로그인이 필요합니다.");
    const updated = await memberApi.update(patch);
    setProfile(updated);
    setError(null);
  }, []);
  const value = useMemo(() => ({ profile, loading, error, reload, updateProfile }), [profile, loading, error, reload, updateProfile]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const value = useContext(Context);
  if (!value) throw new Error("UserProvider가 필요합니다.");
  return value;
}
