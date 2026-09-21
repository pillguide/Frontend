const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export const authStorage = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
  getAccessToken: () => localStorage.getItem(ACCESS_KEY),
};
