import { useEffect, useState } from "react";

/** Refresh at minute boundaries and when returning to the app. */
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { setNow(new Date()); schedule(); }, intervalMs - Date.now() % intervalMs);
    };
    const onVisibility = () => { if (!document.hidden) { setNow(new Date()); schedule(); } };
    schedule();
    document.addEventListener("visibilitychange", onVisibility);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", onVisibility); };
  }, [intervalMs]);
  return now;
}
