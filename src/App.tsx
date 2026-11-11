import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { fontScaleStorage, type FontScale } from "./utils/fontScale";
import { authStorage } from "./utils/authStorage";
import LoginRequired from "./components/common/LoginRequired";
import MobileLayout from "./layout/MobileLayout";
import type { ReactNode } from "react";
import { ROUTES } from "./constants/routes";

import LoginPage from "./features/auth/pages/LoginPage";
import OAuthCallbackPage from "./features/auth/pages/OAuthCallbackPage";
import SignupPage from "./features/auth/pages/SignupPage";
import HomePage from "./features/home/pages/HomePage";
import MyPage from "./features/mypage/pages/MyPage";
import MyDrugsPage from "./features/medicine/pages/MyDrugsPage";
import { scanDraft, isScanDraftRoute } from "./features/medicine/scanDraft";
import ScanPage from "./features/medicine/pages/ScanPage";
import ScanRecordPage from "./features/medicine/pages/ScanRecordPage";
import ScanResultPage from "./features/medicine/pages/ScanResultPage";
import ScanSessionPage from "./features/medicine/pages/ScanSessionPage";
import SingleMedicineDetailPage from "./features/medicine/pages/SingleMedicineDetailPage";
import { AlarmProvider } from "./features/alarm/context/AlarmContext";
import { UserProvider } from "./features/user/context/UserContext";
import { IntakeProvider } from "./features/intake/context/IntakeContext";
import ProfilePage from "./features/user/pages/ProfilePage";
import CheckRecordPage from "./features/intake/pages/CheckRecordPage";
import SearchPage from "./features/search/pages/SearchPage";
import AlarmListPage from "./features/alarm/pages/AlarmListPage";
import AlarmFormPage from "./features/alarm/pages/AlarmFormPage";
import { usePushSync } from "./features/alarm/hooks/usePushNotifications";

function ScanDraftBoundary() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!isScanDraftRoute(pathname, scanDraft.get())) scanDraft.clear();
  }, [pathname]);
  return null;
}

// 알림이 허용된 기기면 FCM 토큰을 계정에 등록하고, 앱 사용 중 온 푸시를 토스트로 보여준다
function PushSync() {
  usePushSync();
  return null;
}

function subscribeAuth(callback: () => void) {
  window.addEventListener("auth-change", callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener("auth-change", callback); window.removeEventListener("storage", callback); };
}

function Protected({ children }: { children: ReactNode }) {
  return authStorage.isLoggedIn() ? children : <MobileLayout><LoginRequired /></MobileLayout>;
}

function SessionApp() {
  const identity = useSyncExternalStore(subscribeAuth, authStorage.sessionIdentity);
  const previousIdentity = useRef(identity);
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    if (previousIdentity.current !== identity) {
      scanDraft.clear();
      previousIdentity.current = identity;
    }
  }, [identity]);
  const [fontScale] = useState<FontScale>(() => fontScaleStorage.get());

  useEffect(() => {
    document.documentElement.setAttribute("data-font-scale", fontScale);
    fontScaleStorage.set(fontScale);
  }, [fontScale]);

  if (pathname === ROUTES.OAUTH_CALLBACK) return <OAuthCallbackPage />;

  return (
      <UserProvider key={identity}>
        <AlarmProvider>
          <IntakeProvider>
            <PushSync />
            <ScanDraftBoundary />
            <Routes>
              {/* 인증 */}
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.SIGNUP} element={<SignupPage />} />

              {/* 메인 */}
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.SEARCH} element={<SearchPage />} />
              <Route path={ROUTES.MY_DRUGS} element={<MyDrugsPage />} />
              <Route path={ROUTES.MY_PAGE} element={<Protected><MyPage /></Protected>} />
              <Route path={ROUTES.PROFILE} element={<Protected><ProfilePage /></Protected>} />
              <Route path={ROUTES.CHECK_RECORD} element={<Protected><CheckRecordPage /></Protected>} />
              <Route path={ROUTES.SCAN} element={<ScanPage />} />
              <Route path={ROUTES.SCAN_RECORD} element={<ScanRecordPage />} />
              <Route path={ROUTES.SCAN_RESULT} element={<ScanResultPage />} />
              <Route
                path={ROUTES.SCAN_RESULT_MEDICINE}
                element={<SingleMedicineDetailPage />}
              />
              <Route path="/medicine/:id" element={<ScanSessionPage />} />
              <Route
                path={ROUTES.SINGLE_MEDICINE}
                element={<SingleMedicineDetailPage />}
              />

              {/* 복약 알람 */}
              <Route path={ROUTES.ALARM} element={<Protected><AlarmListPage /></Protected>} />
              <Route path={ROUTES.ALARM_NEW} element={<Protected><AlarmFormPage /></Protected>} />
              <Route path={ROUTES.ALARM_EDIT} element={<Protected><AlarmFormPage /></Protected>} />
            </Routes>
          </IntakeProvider>
        </AlarmProvider>
      </UserProvider>
  );
}

export default function App() {
  return <BrowserRouter><SessionApp /></BrowserRouter>;
}
