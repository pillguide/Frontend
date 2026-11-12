// 복약 알림 푸시(FCM) 권한·토큰 관리
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getFcmToken,
  getPushPermission,
  isFirebaseConfigured,
  onForegroundPush,
  requestPushPermission,
  type PushPermission,
} from "../../../lib/firebase";
import { authStorage } from "../../../utils/authStorage";
import { registerFcmToken } from "../api/fcmApi";

/** 발급한 토큰을 로그인한 계정에 등록 (로그인 안 했으면 건너뜀) */
async function syncToken(): Promise<string | null> {
  const token = await getFcmToken();
  if (token && authStorage.isLoggedIn()) await registerFcmToken(token);
  return token;
}

/** 알림 설정 화면용: 권한 상태 표시 + "알림 허용" 버튼 처리 */
export function usePushNotifications() {
  const [permission, setPermission] = useState<PushPermission>(getPushPermission);
  const [token, setToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // 이미 허용된 기기면 토큰만 조용히 가져온다 (개발용 토큰 복사에 사용)
  useEffect(() => {
    if (permission !== "granted" || !isFirebaseConfigured) return;
    let cancelled = false;
    getFcmToken()
      .then((t) => {
        if (!cancelled) setToken(t);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [permission]);

  const enable = useCallback(async () => {
    setBusy(true);
    try {
      const result = await requestPushPermission();
      setPermission(result);
      if (result !== "granted") {
        if (result === "denied") toast.error("알림이 차단됐어요. 브라우저 설정에서 허용해 주세요");
        return;
      }
      const t = await syncToken();
      if (!t) throw new Error("FCM 토큰을 받지 못했어요");
      setToken(t);
      toast.success("이제 복약 시간에 알림이 와요");
    } catch (e) {
      console.error(e);
      toast.error("알림 설정에 실패했어요. 잠시 후 다시 시도해 주세요");
    } finally {
      setBusy(false);
    }
  }, []);

  return { permission, token, busy, enable, configured: isFirebaseConfigured };
}

/**
 * 앱 전체에서 한 번 실행:
 * - 알림이 허용된 기기면 로그인 계정에 최신 FCM 토큰을 다시 등록 (토큰은 바뀔 수 있음)
 * - 앱을 보고 있을 때 온 푸시는 토스트로 보여줌
 */
export function usePushSync() {
  useEffect(() => {
    if (!isFirebaseConfigured || getPushPermission() === "unsupported") return;
    if (getPushPermission() === "granted") {
      syncToken().catch((e) => console.warn("FCM 토큰 등록 실패", e));
    }

    // 포그라운드 수신 리스너는 권한과 상관없이 항상 등록한다.
    // (앱을 연 뒤에 "알림 허용"을 눌러도 새로고침 없이 바로 토스트가 뜨도록)
    // 탭을 보고 있을 때 온 푸시는 서비스 워커가 알림을 띄우지 않고 이 리스너로만 전달된다.

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    onForegroundPush((title, body) => {
      toast(`${title}\n${body}`, { icon: "💊", duration: 6000 });
    }).then((off) => {
      if (cancelled) off();
      else unsubscribe = off;
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);
}
