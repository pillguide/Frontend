// 복약 알람 목록 상단: 푸시 권한·로그인 상태 안내
import { BellRing, BellOff, Copy, Info } from "lucide-react";
import toast from "react-hot-toast";
import { usePushNotifications } from "../hooks/usePushNotifications";
import type { AlarmSource } from "../context/AlarmContext";

const cardBase = "flex items-start gap-3 rounded-[20px] px-4 py-3.5";

export default function PushPermissionCard({ source }: { source: AlarmSource }) {
  const { permission, token, busy, enable, configured } = usePushNotifications();

  const copyToken = async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      toast.success("FCM 토큰을 복사했어요");
    } catch {
      window.prompt("FCM 토큰", token);
    }
  };

  return (
    <div className="space-y-2">
      {source === "local" && (
        <div className={`${cardBase} bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]`}>
          <Info size={18} className="mt-0.5 flex-shrink-0 text-slate-400" />
          <p className="text-sm text-slate-600">로그인하면 알람이 계정에 저장되고, 복약 시간에 푸시 알림을 받을 수 있어요.</p>
        </div>
      )}

      {!configured ? (
        import.meta.env.DEV && (
          <div className={`${cardBase} bg-amber-50`}>
            <Info size={18} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <p className="text-sm text-amber-700">Firebase 환경 변수가 없어요. .env.local 에 VITE_FIREBASE_* 값을 넣어 주세요.</p>
          </div>
        )
      ) : permission === "default" ? (
        <div className={`${cardBase} items-center bg-primary-50`}>
          <BellRing size={20} className="flex-shrink-0 text-primary" />
          <p className="flex-1 text-sm text-slate-700">알림을 허용해야 복약 시간에 알림이 와요</p>
          <button
            type="button"
            onClick={enable}
            disabled={busy}
            className="flex-shrink-0 rounded-full bg-primary px-3.5 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "설정 중" : "알림 허용"}
          </button>
        </div>
      ) : permission === "denied" ? (
        <div className={`${cardBase} bg-red-50`}>
          <BellOff size={18} className="mt-0.5 flex-shrink-0 text-red-500" />
          <p className="text-sm text-red-600">알림이 차단돼 있어요. 브라우저 주소창의 사이트 설정에서 알림을 허용해 주세요.</p>
        </div>
      ) : permission === "unsupported" ? (
        <div className={`${cardBase} bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]`}>
          <BellOff size={18} className="mt-0.5 flex-shrink-0 text-slate-400" />
          <p className="text-sm text-slate-600">이 브라우저에서는 푸시 알림을 받을 수 없어요. (아이폰은 홈 화면에 추가한 앱에서만 가능해요)</p>
        </div>
      ) : null}

      {import.meta.env.DEV && token && (
        <button
          type="button"
          onClick={copyToken}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2 text-xs text-slate-500"
        >
          <Copy size={14} /> 개발용: 이 기기의 FCM 토큰 복사
        </button>
      )}
    </div>
  );
}
