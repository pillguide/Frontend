// FCM 백그라운드 알림용 서비스 워커
// - Firebase 설정은 src/lib/firebase.ts 가 등록할 때 쿼리스트링으로 넘긴다.
// - 백엔드가 notification 필드를 담아 보내므로, 앱이 닫혀 있으면 Firebase SDK가 알림을 자동으로 띄운다.
// - compat 버전은 package.json 의 firebase 버전과 맞춘다.
const FIREBASE_VERSION = "12.19.0";

// 알림을 누르면 열려 있는 앱 탭으로 이동, 없으면 새로 연다.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL("/", self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) return client.focus();
      }
      return self.clients.openWindow(target);
    }),
  );
});

importScripts(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app-compat.js`);
importScripts(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-messaging-compat.js`);

const config = Object.fromEntries(new URL(self.location.href).searchParams.entries());
if (config.apiKey && config.messagingSenderId) {
  firebase.initializeApp(config);
  firebase.messaging();
}
