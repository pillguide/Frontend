// src/features/intake/context/IntakeContext.tsx
// 날짜별 복약 완료 기록. 홈 체크리스트와 복약 체크 기록 화면이 같은 데이터를 씀.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Alarm } from "../../alarm/types/alarm";
import { useAlarms } from "../../alarm/context/AlarmContext";
import { addDays, toDateKey } from "../utils/date";
import { alarmsForDate, type IntakeLog } from "../utils/schedule";

const STORAGE_KEY = "intakeLog";

/** 첫 실행 시 지난 6일 기록을 채워 화면이 비어 보이지 않게 함 (데모용) */
function seedLog(alarms: Alarm[]): IntakeLog {
  const today = new Date();
  const log: IntakeLog = {};
  for (let i = 1; i <= 6; i++) {
    const date = addDays(today, -i);
    const ids = alarmsForDate(alarms, date, today).map((a) => a.id);
    // 일부 날짜는 한두 개 빠뜨린 것으로
    log[toDateKey(date)] = ids.filter((_, idx) => !(i === 2 && idx === ids.length - 1) && !(i === 5 && idx === 0));
  }
  const first = alarmsForDate(alarms, today, today)[0];
  if (first && first.hour <= today.getHours()) log[toDateKey(today)] = [first.id];
  return log;
}

function loadLog(alarms: Alarm[]): IntakeLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as IntakeLog;
  } catch {
    // 무시
  }
  return seedLog(alarms);
}

interface IntakeContextValue {
  log: IntakeLog;
  isTaken: (date: Date, alarmId: number) => boolean;
  /** 토글 후 결과 상태(true = 복용 완료)를 반환 */
  toggleTaken: (date: Date, alarmId: number) => boolean;
}

const IntakeContext = createContext<IntakeContextValue | null>(null);

export function IntakeProvider({ children }: { children: ReactNode }) {
  const { alarms } = useAlarms();
  const [log, setLog] = useState<IntakeLog>(() => loadLog(alarms));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
    } catch {
      // 무시
    }
  }, [log]);

  const isTaken = useCallback(
    (date: Date, alarmId: number) => (log[toDateKey(date)] ?? []).includes(alarmId),
    [log],
  );

  const toggleTaken = useCallback(
    (date: Date, alarmId: number) => {
      const key = toDateKey(date);
      const next = !(log[key] ?? []).includes(alarmId);
      setLog((prev) => {
        const ids = prev[key] ?? [];
        return { ...prev, [key]: next ? [...ids, alarmId] : ids.filter((id) => id !== alarmId) };
      });
      return next;
    },
    [log],
  );

  const value = useMemo(() => ({ log, isTaken, toggleTaken }), [log, isTaken, toggleTaken]);
  return <IntakeContext.Provider value={value}>{children}</IntakeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useIntake() {
  const ctx = useContext(IntakeContext);
  if (!ctx) throw new Error("useIntake는 IntakeProvider 안에서만 사용할 수 있어요");
  return ctx;
}
