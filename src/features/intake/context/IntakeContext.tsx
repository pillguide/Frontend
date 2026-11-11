import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { medicationApi } from "../api/medicationApi";
import { authStorage } from "../../../utils/authStorage";

interface Value { revision: number; refresh: () => void; toggleTaken: (doseId: number, taken: boolean) => Promise<void> }
const Context = createContext<Value | null>(null);
export function IntakeProvider({ children }: { children: ReactNode }) {
  const [revision, setRevision] = useState(0);
  const toggleTaken = useCallback(async (doseId: number, taken: boolean) => {
    if (!authStorage.isLoggedIn()) throw new Error("로그인이 필요합니다.");
    await medicationApi.check(doseId, taken);
    setRevision((n) => n + 1);
  }, []);
  const refresh = useCallback(() => setRevision((n) => n + 1), []);
  const value = useMemo(() => ({ revision, refresh, toggleTaken }), [revision, refresh, toggleTaken]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useIntake() {
  const value = useContext(Context);
  if (!value) throw new Error("IntakeProvider가 필요합니다.");
  return value;
}
