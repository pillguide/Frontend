// src/features/auth/pages/OAuthCallbackPage.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import { ROUTES } from "../../../constants/routes";
import { authStorage } from "../../../utils/authStorage";
import { exchangeOAuthCode, OAUTH_EXCHANGE_VERIFIER_KEY } from "../api/authApi";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // StrictMode reruns effects; the exchange code is single-use.
    started.current = true;
    const code = new URLSearchParams(window.location.search).get("code");
    window.history.replaceState(window.history.state, "", ROUTES.OAUTH_CALLBACK);
    const verifier = sessionStorage.getItem(OAUTH_EXCHANGE_VERIFIER_KEY);
    if (!code || !verifier) {
      sessionStorage.removeItem(OAUTH_EXCHANGE_VERIFIER_KEY);
      navigate(`${ROUTES.LOGIN}?error=missing_exchange`, { replace: true });
      return;
    }
    void exchangeOAuthCode(code, verifier)
      .then(({ accessToken, refreshToken }) => {
        authStorage.setTokens(accessToken, refreshToken);
        navigate(ROUTES.HOME, { replace: true });
      })
      .catch(() => navigate(`${ROUTES.LOGIN}?error=exchange_failed`, { replace: true }))
      .finally(() => sessionStorage.removeItem(OAUTH_EXCHANGE_VERIFIER_KEY));
  }, [navigate]);

  return (
    <MobileLayout showBottomNav={false}>
      <div className="flex h-full items-center justify-center text-sm text-slate-500">
        로그인 처리 중...
      </div>
    </MobileLayout>
  );
}
