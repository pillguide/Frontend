import { authStorage } from "../../../utils/authStorage";

const API_URL = import.meta.env.VITE_API_URL ?? "";

/** 서버 로그아웃: 리프레시 토큰 폐기 + 계정에 등록된 FCM 토큰 해제 (푸시 중단). 실패해도 예외를 던지지 않는다. */
export async function logout(): Promise<void> {
  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) return;
  try {
    await fetch(`${API_URL}/api/v1/auth/logout`, {
      method: "POST",
      headers: { "X-Refresh-Token": refreshToken },
    });
  } catch {
    // 네트워크 오류여도 기기에서는 로그아웃 처리
  }
}
