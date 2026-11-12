// 백엔드 공통 요청 함수
// - 배포 환경: same-origin(/api) → Vercel 프록시
// - 로컬 개발: same-origin(/api) → vite dev 프록시(DEV_API_PROXY_TARGET, 기본 localhost:8080)
// 응답은 백엔드 ApiResponse { status, success, message, data } 형식을 풀어서 data만 돌려준다.
import { authStorage } from "../utils/authStorage";

const API_URL = import.meta.env.VITE_API_URL ?? "";

interface ApiEnvelope<T> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseEnvelope<T>(res: Response): Promise<ApiEnvelope<T> | undefined> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as ApiEnvelope<T>;
  } catch {
    return undefined; // 프록시 오류 페이지 등 JSON이 아닌 응답
  }
}

let reissuing: Promise<boolean> | null = null;
let logoutPending = false;

export async function withReissuePausedForLogout<T>(operation: () => Promise<T>): Promise<T> {
  if (logoutPending) throw new Error("로그아웃이 이미 진행 중입니다.");
  logoutPending = true;
  try {
    if (reissuing) await reissuing;
    return await operation();
  } finally {
    logoutPending = false;
  }
}

async function reissueTokens(): Promise<boolean> {
  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/reissue`, {
      method: "POST",
      headers: { "X-Refresh-Token": refreshToken },
    });
    const body = await parseEnvelope<{ accessToken: string; refreshToken: string }>(res);
    if (!res.ok || !body?.data) return false;
    authStorage.setTokens(body.data.accessToken, body.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export async function apiRequest<T = void>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers);
  const accessToken = authStorage.getAccessToken();
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  if (init.body !== undefined && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  // access token 만료 → 한 번만 재발급 후 재시도 (동시 요청은 같은 재발급을 기다림)
  if (res.status === 401 && retry && !logoutPending && authStorage.getRefreshToken()) {
    reissuing ??= reissueTokens().finally(() => {
      reissuing = null;
    });
    if (await reissuing) return apiRequest<T>(path, init, false);
  }

  const body = await parseEnvelope<T>(res);
  if (!res.ok || body?.success === false) {
    throw new ApiError(res.status, body?.message ?? "요청을 처리하지 못했어요");
  }
  return body?.data as T;
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path),
  post: <T = void>(path: string, data?: unknown) =>
    apiRequest<T>(path, { method: "POST", body: data === undefined ? undefined : JSON.stringify(data) }),
  put: <T = void>(path: string, data?: unknown) =>
    apiRequest<T>(path, { method: "PUT", body: data === undefined ? undefined : JSON.stringify(data) }),
  patch: <T = void>(path: string, data?: unknown) =>
    apiRequest<T>(path, { method: "PATCH", body: data === undefined ? undefined : JSON.stringify(data) }),
  delete: <T = void>(path: string) => apiRequest<T>(path, { method: "DELETE" }),
};
