// Firebase Cloud Messaging(웹 푸시) 설정
// 값은 .env.local(로컬) / Vercel 환경 변수(배포)의 VITE_FIREBASE_* 로 주입한다.
// Firebase 웹 설정과 VAPID 공개 키는 비밀 값이 아니지만, 저장소에는 넣지 않는다.
// SDK는 알림 기능을 쓸 때만 동적으로 불러와 첫 화면 번들을 키우지 않는다.
import type { FirebaseOptions } from "firebase/app";
import type { Messaging } from "firebase/messaging";

const env = import.meta.env;

const firebaseConfig: FirebaseOptions = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const VAPID_KEY: string | undefined = env.VITE_FIREBASE_VAPID_KEY;

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.messagingSenderId && firebaseConfig.appId && VAPID_KEY,
);

export type PushPermission = NotificationPermission | "unsupported";

export function getPushPermission(): PushPermission {
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
    return "unsupported";
  }
  return Notification.permission;
}

let messagingPromise: Promise<Messaging | null> | null = null;

function loadMessaging(): Promise<Messaging | null> {
  messagingPromise ??= (async () => {
    if (!isFirebaseConfigured) return null;
    const [{ initializeApp }, { getMessaging, isSupported }] = await Promise.all([
      import("firebase/app"),
      import("firebase/messaging"),
    ]);
    if (!(await isSupported())) return null;
    return getMessaging(initializeApp(firebaseConfig));
  })();
  return messagingPromise;
}

// 서비스 워커는 빌드 결과에 포함되지 않는 public 파일이라 설정을 쿼리스트링으로 넘긴다.
function registerMessagingServiceWorker() {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(firebaseConfig)) {
    if (typeof value === "string" && value) params.set(key, value);
  }
  return navigator.serviceWorker.register(`/firebase-messaging-sw.js?${params.toString()}`, {
    scope: "/firebase-cloud-messaging-push-scope",
  });
}

/** 브라우저 알림 권한 요청. 반드시 버튼 클릭 같은 사용자 동작 안에서 호출해야 한다. */
export async function requestPushPermission(): Promise<PushPermission> {
  if (getPushPermission() === "unsupported") return "unsupported";
  return Notification.requestPermission();
}

/** 권한이 허용된 상태에서 이 기기의 FCM 토큰을 발급(또는 기존 토큰 조회)한다. */
export async function getFcmToken(): Promise<string | null> {
  if (getPushPermission() !== "granted") return null;
  const messaging = await loadMessaging();
  if (!messaging) return null;
  const registration = await registerMessagingServiceWorker();
  const { getToken } = await import("firebase/messaging");
  return getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
}

/** 앱이 열려 있을 때(포그라운드) 받은 푸시. 백그라운드 알림은 서비스 워커가 띄운다. */
export async function onForegroundPush(handler: (title: string, body: string) => void): Promise<() => void> {
  const messaging = await loadMessaging();
  if (!messaging) return () => {};
  const { onMessage } = await import("firebase/messaging");
  return onMessage(messaging, (payload) => {
    handler(payload.notification?.title ?? "복약 알림", payload.notification?.body ?? "");
  });
}
