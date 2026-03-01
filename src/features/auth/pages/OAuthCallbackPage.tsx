import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authStorage } from "../../../utils/authStorage";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const profileCompleted = searchParams.get("profileCompleted"); // "true" | "false" | null

    if (!accessToken || !refreshToken) {
      navigate("/login?error=missing_token", { replace: true });
      return;
    }

    authStorage.setTokens(accessToken, refreshToken);

    // profileCompleted가 false면 추가 정보 입력 페이지로 보내는 게 기획 의도
    if (profileCompleted === "true") {
      navigate("/", { replace: true });
    } else {
      // 아직 페이지 없으면 일단 홈으로 보내고,
      // 나중에 /profile/setup 같은 곳으로 바꾸면 됨
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);

  return <div style={{ padding: 24 }}>로그인 처리 중...</div>;
}