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
import MedicineDetailPage from "./features/medicine/pages/MedicineDetailPage";
import SingleMedicineDetailPage from "./features/medicine/pages/SingleMedicineDetailPage";
import { AlarmProvider } from "./features/alarm/context/AlarmContext";
import AlarmListPage from "./features/alarm/pages/AlarmListPage";
import AlarmFormPage from "./features/alarm/pages/AlarmFormPage";

export default function App() {
  const [fontScale] = useState<FontScale>(() => fontScaleStorage.get());

  useEffect(() => {
    document.documentElement.setAttribute("data-font-scale", fontScale);
    fontScaleStorage.set(fontScale);
  }, [fontScale]);

  return (
    <BrowserRouter>
      <AlarmProvider>
        <Routes>
          {/* 인증 */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.OAUTH_CALLBACK} element={<OAuthCallbackPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />

          {/* 메인 */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.MY_PAGE} element={<MyPage />} />
          <Route path={ROUTES.SCAN} element={<ScanPage />} />
          <Route path={ROUTES.SCAN_RECORD} element={<ScanRecordPage />} />
          <Route path="/medicine/:id" element={<MedicineDetailPage />} />
          <Route path={ROUTES.SINGLE_MEDICINE} element={<SingleMedicineDetailPage />} />

          {/* 복약 알람 */}
          <Route path={ROUTES.ALARM} element={<AlarmListPage />} />
          <Route path={ROUTES.ALARM_NEW} element={<AlarmFormPage />} />
          <Route path={ROUTES.ALARM_EDIT} element={<AlarmFormPage />} />
        </Routes>
      </AlarmProvider>
    </BrowserRouter>
  );
}
