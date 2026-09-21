// src/features/alarm/context/AlarmContext.tsx
// 백엔드 연결 전까지 localStorage에 저장. API 붙일 때 이 파일의 액션만 교체하면 됨.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Alarm, AlarmDraft } from "../types/alarm";
import { alarmMock } from "../mock/alarm.mock";

const STORAGE_KEY = "alarms";

function loadAlarms(): Alarm[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Alarm[];
  } catch {
    // 저장값이 깨졌거나 storage 접근 불가 → mock으로 시작
  }
  return alarmMock;
}

interface AlarmContextValue {
  alarms: Alarm[];
  getAlarm: (id: number) => Alarm | undefined;
  addAlarm: (draft: AlarmDraft) => void;
  updateAlarm: (id: number, draft: AlarmDraft) => void;
  removeAlarms: (ids: number[]) => void;
  toggleAlarm: (id: number) => void;
}

const AlarmContext = createContext<AlarmContextValue | null>(null);

export function AlarmProvider({ children }: { children: ReactNode }) {
  const [alarms, setAlarms] = useState<Alarm[]>(loadAlarms);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
    } catch {
      // storage 사용 불가 환경은 메모리 상태만 유지
    }
  }, [alarms]);

  const getAlarm = useCallback((id: number) => alarms.find((a) => a.id === id), [alarms]);

  const addAlarm = useCallback((draft: AlarmDraft) => {
    setAlarms((prev) => [
      ...prev,
      { ...draft, id: Math.max(0, ...prev.map((a) => a.id)) + 1, enabled: true },
    ]);
  }, []);

  const updateAlarm = useCallback((id: number, draft: AlarmDraft) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, ...draft } : a)));
  }, []);

  const removeAlarms = useCallback((ids: number[]) => {
    setAlarms((prev) => prev.filter((a) => !ids.includes(a.id)));
  }, []);

  const toggleAlarm = useCallback((id: number) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  }, []);

  const value = useMemo(
    () => ({ alarms, getAlarm, addAlarm, updateAlarm, removeAlarms, toggleAlarm }),
    [alarms, getAlarm, addAlarm, updateAlarm, removeAlarms, toggleAlarm],
  );

  return <AlarmContext.Provider value={value}>{children}</AlarmContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAlarms() {
  const ctx = useContext(AlarmContext);
  if (!ctx) throw new Error("useAlarms는 AlarmProvider 안에서만 사용할 수 있어요");
  return ctx;
}
