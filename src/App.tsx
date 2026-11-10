import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { fontScaleStorage, type FontScale } from "./utils/fontScale";
import { ROUTES } from "./constants/routes";

import LoginPage from "./features/auth/pages/LoginPage";
import OAuthCallbackPage from "./features/auth/pages/OAuthCallbackPage";
import SignupPage from "./features/auth/pages/SignupPage";
import HomePage from "./features/home/pages/HomePage";
import MyPage from "./features/mypage/pages/MyPage";
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

// 알림이 허용된 기기면 FCM 토큰을 계정에 등록하고, 앱 사용 중 온 푸시를 토스트로 보여준다
function PushSync() {
  usePushSync();
  return null;
}

export default function App() {
  const [fontScale] = useState<FontScale>(() => fontScaleStorage.get());

  useEffect(() => {
    document.documentElement.setAttribute("data-font-scale", fontScale);
    fontScaleStorage.set(fontScale);
  }, [fontScale]);

  return (
    <BrowserRouter>
      <UserProvider>
      <AlarmProvider>
      <IntakeProvider>
        <PushSync />
        <Routes>
          {/* 인증 */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.OAUTH_CALLBACK} element={<OAuthCallbackPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />

          {/* 메인 */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SEARCH} element={<SearchPage />} />
          <Route path={ROUTES.MY_PAGE} element={<MyPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.CHECK_RECORD} element={<CheckRecordPage />} />
          <Route path={ROUTES.SCAN} element={<ScanPage />} />
          <Route path={ROUTES.SCAN_RECORD} element={<ScanRecordPage />} />
          <Route path={ROUTES.SCAN_RESULT} element={<ScanResultPage />} />
          <Route path={ROUTES.SCAN_RESULT_MEDICINE} element={<SingleMedicineDetailPage source="mock" />} />
          <Route path="/medicine/:id" element={<ScanSessionPage />} />
          <Route path={ROUTES.SINGLE_MEDICINE} element={<SingleMedicineDetailPage />} />

          {/* 복약 알람 */}
          <Route path={ROUTES.ALARM} element={<AlarmListPage />} />
          <Route path={ROUTES.ALARM_NEW} element={<AlarmFormPage />} />
          <Route path={ROUTES.ALARM_EDIT} element={<AlarmFormPage />} />
        </Routes>
      </IntakeProvider>
      </AlarmProvider>
      </UserProvider>
    </BrowserRouter>
  );
}
