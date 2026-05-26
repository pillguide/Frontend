import type { MyPageResponse } from "../types/mypage";

export const myPageMockData: MyPageResponse = {
  userName: "이태정",
  quickActions: [
    { id: 1, label: "복약 알림 설정", path: "/mypage/alarm" },
    { id: 2, label: "복약 체크 기록", path: "/mypage/check" },
    { id: 3, label: "스캔기록", path: "/scan-record" },
  ],
  menus: [
    { id: 1, label: "고객지원", path: "/support" },
    { id: 2, label: "개인정보 처리방침", path: "/privacy" },
    { id: 3, label: "이용 약관", path: "/terms" },
  ],
};