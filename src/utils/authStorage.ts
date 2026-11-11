const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

// JWT subject is used only to invalidate cached UI state, never to authorize requests.
function sessionIdentity(token: string | null): string {
  if (!token) return "guest";
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const sub = JSON.parse(atob(part)).sub;
    if (typeof sub === "string" && /^[1-9]\d*$/.test(sub)) return `member:${sub}`;
  } catch { /* invalid token still needs an isolated cache */ }
  return `unknown:${token}`;
}
export const authStorage = {
  sessionIdentity: () => sessionIdentity(localStorage.getItem(ACCESS_KEY)),
  setTokens: (accessToken: string, refreshToken: string) => {
    const previous = sessionIdentity(localStorage.getItem(ACCESS_KEY));
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    if (previous !== sessionIdentity(accessToken) && typeof window !== "undefined") window.dispatchEvent(new Event("auth-change"));
  },
  clear: () => {
    const wasLoggedIn = Boolean(localStorage.getItem(ACCESS_KEY));
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    if (wasLoggedIn && typeof window !== "undefined") window.dispatchEvent(new Event("auth-change"));
  },
  getAccessToken: () => localStorage.getItem(ACCESS_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  isLoggedIn: () => Boolean(localStorage.getItem(ACCESS_KEY)),
};
