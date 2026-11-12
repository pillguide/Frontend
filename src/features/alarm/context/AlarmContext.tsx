// src/features/alarm/context/AlarmContext.tsx
// 로그인 상태면 백엔드(/api/v1/medication/reminders)에 저장하고 푸시 알림을 받는다.
// 비로그인 상태에서는 데이터를 읽거나 저장하지 않는다.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Alarm, AlarmDraft } from "../types/alarm";
import { reminderApi } from "../api/reminderApi";
import { authStorage } from "../../../utils/authStorage";


export type AlarmSource = "server" | "local";

interface AlarmContextValue {
  alarms: Alarm[];
  source: AlarmSource;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  getAlarm: (id: number) => Alarm | undefined;
  addAlarm: (draft: AlarmDraft) => Promise<void>;
  updateAlarm: (id: number, draft: AlarmDraft) => Promise<void>;
  removeAlarms: (ids: number[]) => Promise<void>;
  toggleAlarm: (id: number) => Promise<void>;
}

const AlarmContext = createContext<AlarmContextValue | null>(null);

export function AlarmProvider({ children }: { children: ReactNode }) {
  const [source] = useState<AlarmSource>(() => (authStorage.isLoggedIn() ? "server" : "local"));
  const [alarms, setAlarms] = useState<Alarm[]>(() => ([]));
  const [loading, setLoading] = useState(source === "server");
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (source !== "server") return;
    setLoading(true);
    setError(null);
    try {
      setAlarms(await reminderApi.list());
    } catch (e) {
      setError(e instanceof Error ? e.message : "알람을 불러오지 못했어요");
    } finally {
      setLoading(false);
    }
  }, [source]);

  useEffect(() => {
    if (source !== "server") return;
    let cancelled = false;
    reminderApi
      .list()
      .then((list) => {
        if (!cancelled) setAlarms(list);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "알람을 불러오지 못했어요");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [source]);


  const getAlarm = useCallback((id: number) => alarms.find((a) => a.id === id), [alarms]);

  const addAlarm = useCallback(
    async (draft: AlarmDraft) => {
      if (source === "server") {
        const created = await reminderApi.create(draft);
        setAlarms((prev) => [...prev, created]);
        return;
      }
      throw new Error("로그인이 필요합니다.");
    },
    [source],
  );

  const updateAlarm = useCallback(
    async (id: number, draft: AlarmDraft) => {
      if (source === "server") {
        const current = alarms.find((a) => a.id === id);
        if (!current) return;
        const updated = await reminderApi.update(current, draft);
        setAlarms((prev) => prev.map((a) => (a.id === id ? updated : a)));
        return;
      }
      throw new Error("로그인이 필요합니다.");
    },
    [source, alarms],
  );

  const removeAlarms = useCallback(
    async (ids: number[]) => {
      if (ids.length === 0) return;
      if (source !== "server") throw new Error("로그인이 필요합니다.");
      await reminderApi.remove(ids);
      setAlarms((prev) => prev.filter((a) => !ids.includes(a.id)));
    },
    [source],
  );

  const toggleAlarm = useCallback(
    async (id: number) => {
      const current = alarms.find((a) => a.id === id);
      if (!current) return;
      const next = !current.enabled;
      // 토글은 바로 반영하고, 서버 저장에 실패하면 되돌린다
      setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: next } : a)));
      if (source !== "server") throw new Error("로그인이 필요합니다.");
      try {
        const saved = await reminderApi.setEnabled(id, next);
        setAlarms((prev) => prev.map((a) => (a.id === id ? saved : a)));
      } catch (e) {
        setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: current.enabled } : a)));
        throw e;
      }
    },
    [source, alarms],
  );

  const value = useMemo(
    () => ({ alarms, source, loading, error, reload, getAlarm, addAlarm, updateAlarm, removeAlarms, toggleAlarm }),
    [alarms, source, loading, error, reload, getAlarm, addAlarm, updateAlarm, removeAlarms, toggleAlarm],
  );

  return <AlarmContext.Provider value={value}>{children}</AlarmContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAlarms() {
  const ctx = useContext(AlarmContext);
  if (!ctx) throw new Error("useAlarms는 AlarmProvider 안에서만 사용할 수 있어요");
  return ctx;
}
