import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import OAuthCallbackPage from "./features/auth/pages/OAuthCallbackPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
        {/* 임시 홈 */}
        <Route path="/" element={<div>HOME</div>} />
      </Routes>
    </BrowserRouter>
  );
}