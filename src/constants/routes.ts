export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  OAUTH_CALLBACK: "/oauth/callback",
  MY_PAGE: "/mypage",
  ALARM: "/mypage/alarm",
  ALARM_NEW: "/mypage/alarm/new",
  ALARM_EDIT: "/mypage/alarm/:id",
  SCAN: "/scan",
  SCAN_RECORD: "/scan-record",
  MEDICINE_DETAIL: "/medicine",
  SINGLE_MEDICINE: "/medicine/single/:id",
};

export const alarmEditPath = (id: number) => `/mypage/alarm/${id}`;
