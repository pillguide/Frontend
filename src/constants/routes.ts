export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  OAUTH_CALLBACK: "/oauth/callback",
  SEARCH: "/search",
  MY_PAGE: "/mypage",
  PROFILE: "/mypage/profile",
  CHECK_RECORD: "/mypage/check",
  ALARM: "/mypage/alarm",
  ALARM_NEW: "/mypage/alarm/new",
  ALARM_EDIT: "/mypage/alarm/:id",
  SCAN: "/scan",
  SCAN_RECORD: "/scan-record",
  MEDICINE_DETAIL: "/medicine",
  SINGLE_MEDICINE: "/medicine/single/:id",
};

export const alarmEditPath = (id: number) => `/mypage/alarm/${id}`;
