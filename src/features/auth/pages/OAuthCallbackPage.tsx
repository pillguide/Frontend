// src/features/auth/pages/OAuthCallbackPage.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import { ROUTES } from "../../../constants/routes";
import { authStorage } from "../../../utils/authStorage";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const profileCompleted = searchParams.get("profileCompleted"); // "true" | "false" | null

    if (!accessToken || !refreshToken) {
      navigate(`${ROUTES.LOGIN}?error=missing_token`, { replace: true });
      return;
    }

    authStorage.setTokens(accessToken, refreshToken);

    // 추가 정보(이름·성별·생일·이메일·글자 크기)를 아직 입력 안 했으면 회원가입 단계로
    navigate(profileCompleted === "true" ? ROUTES.HOME : ROUTES.SIGNUP, { replace: true });
  }, [searchParams, navigate]);

  return (
    <MobileLayout showBottomNav={false}>
      <div className="flex h-full items-center justify-center text-sm text-slate-500">
        로그인 처리 중...
      </div>
    </MobileLayout>
  );
}
