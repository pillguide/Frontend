import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { fontScaleStorage, type FontScale } from "./utils/fontScale";

import HomePage from "./features/home/pages/HomePage";
import MyPage from "./features/mypage/pages/MyPage";
import ScanPage from "./features/medicine/pages/ScanPage";
import ScanRecordPage from "./features/medicine/pages/ScanRecordPage";
import MedicineDetailPage from "./features/medicine/pages/MedicineDetailPage";

export default function App() {
  const [fontScale, setFontScale] = useState<FontScale>(() =>
    fontScaleStorage.get()
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-font-scale", fontScale);
    fontScaleStorage.set(fontScale);
  }, [fontScale]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/scan-record" element={<ScanRecordPage />} />
        <Route path="/medicine/:id" element={<MedicineDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}