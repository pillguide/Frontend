// src/features/home/hooks/useNow.ts
import { useEffect, useState } from "react";

/** 1분마다 갱신되는 현재 시각 */
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
