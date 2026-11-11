import { authStorage } from "../../../utils/authStorage";
import { withReissuePausedForLogout } from "../../../api/http";

const API_URL = import.meta.env.VITE_API_URL ?? "";
export const OAUTH_EXCHANGE_VERIFIER_KEY = "oauthExchangeVerifier";

function base64url(bytes: Uint8Array): string {
  return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function createOAuthVerifierAndChallenge(): Promise<{ verifier: string; challenge: string }> {
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return { verifier, challenge: base64url(new Uint8Array(digest)) };
}

interface TokenEnvelope {
  success: boolean;
  message: string;
  data?: { accessToken: string; refreshToken: string };
}

export async function exchangeOAuthCode(code: string, verifier: string): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await fetch(`${API_URL}/api/v1/auth/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, verifier }),
  });
  const body = await response.json().catch(() => null) as TokenEnvelope | null;
  if (!response.ok || !body?.success || !body.data?.accessToken || !body.data?.refreshToken) {
    throw new Error(body?.message ?? "로그인에 실패했어요.");
  }
  return body.data;
}

let logoutRequest: Promise<void> | null = null;

/** Wait for any rotation, then revoke the latest refresh token before clearing local credentials. */
export function logout(): Promise<void> {
  logoutRequest ??= withReissuePausedForLogout(async () => {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) throw new Error("로그아웃할 토큰이 없습니다.");
    const response = await fetch(`${API_URL}/api/v1/auth/logout`, {
      method: "POST",
      headers: { "X-Refresh-Token": refreshToken },
    });
    if (!response.ok) throw new Error("서버 로그아웃에 실패했어요.");
  }).finally(() => { logoutRequest = null; });
  return logoutRequest;
}
