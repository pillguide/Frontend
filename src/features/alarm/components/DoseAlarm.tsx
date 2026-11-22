// 앱을 보고 있을 때 복약 시간이 되면 화면 위쪽에 알람 카드를 띄운다 (복용 완료 / 닫기)
// 푸시(FCM) 설정이 없어도 동작하도록 오늘 복약 일정(GET /api/v1/medication/home)을 직접 보고 시간을 잰다
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing } from "lucide-react";
import toast from "react-hot-toast";
import { medicationApi, type Dose } from "../../intake/api/medicationApi";
import { useIntake } from "../../intake/context/IntakeContext";

/** 복약 시각이 지난 뒤 이 시간 안에 앱을 보고 있으면 알람을 띄운다 */
const SHOW_WINDOW_MS = 30 * 60 * 1000;
const CHECK_MS = 10 * 1000; // 시각 확인 간격
const FETCH_MS = 60 * 1000; // 일정 다시 불러오는 간격 (새로 만든 알람도 1분 안에 반영)
const HANDLED_KEY = "doseAlarmHandled";

function loadHandled(): number[] {
  try {
    return JSON.parse(sessionStorage.getItem(HANDLED_KEY) ?? "[]") as number[];
  } catch {
    return [];
  }
}

function timeLabel(iso: string) {
  const d = new Date(iso);
  const h = d.getHours();
  return `${h < 12 ? "오전" : "오후"} ${h % 12 === 0 ? 12 : h % 12}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function DoseAlarm() {
  const { revision, toggleTaken } = useIntake();
  const [doses, setDoses] = useState<Dose[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [handled, setHandled] = useState<number[]>(loadHandled);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      medicationApi
        .home()
        .then((home) => {
          if (!cancelled) setDoses(home.doses);
        })
        .catch(() => {});
    void load();
    const timer = setInterval(() => void load(), FETCH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setNow(Date.now());
        void load();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [revision]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), CHECK_MS);
    return () => clearInterval(timer);
  }, []);

  const due = useMemo(
    () =>
      doses
        .filter((d) => {
          const at = new Date(d.scheduledAt).getTime();
          return d.status !== "TAKEN" && !handled.includes(d.id) && at <= now && now - at < SHOW_WINDOW_MS;
        })
        .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)),
    [doses, handled, now],
  );
  const dose = due[0];

  useEffect(() => {
    if (dose) navigator.vibrate?.([200, 100, 200]);
  }, [dose?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = (id: number) => {
    const next = [...handled, id];
    setHandled(next);
    try {
      sessionStorage.setItem(HANDLED_KEY, JSON.stringify(next.slice(-50)));
    } catch {
      /* 저장 못 해도 이번 화면에서는 닫힘 */
    }
  };

  const take = async (id: number) => {
    setBusy(true);
    try {
      await toggleTaken(id, true);
      close(id);
      toast.success("복용 완료로 기록했어요");
    } catch {
      toast.error("기록하지 못했어요. 다시 시도해 주세요");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {dose && (
        <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-3">
          <motion.div
            key={dose.id}
            role="alertdialog"
            aria-label="복약 알람"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="pointer-events-auto w-full max-w-[400px] rounded-[24px] border border-slate-100 bg-white p-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                <BellRing size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-primary">
                  복약 시간이에요 · {timeLabel(dose.scheduledAt)}
                  {due.length > 1 && <span className="ml-1 text-slate-400">외 {due.length - 1}개</span>}
                </p>
                <p className="truncate font-bold text-slate-900">
                  {dose.medicationName} {dose.dosage}
                </p>
                {dose.memo && <p className="truncate text-xs text-slate-500">{dose.memo}</p>}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => close(dose.id)}
                className="flex-1 rounded-2xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600"
              >
                닫기
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void take(dose.id)}
                className="flex-1 rounded-2xl bg-primary py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                복용 완료
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
