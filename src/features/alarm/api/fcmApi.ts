import { api } from "../../../api/http";

/** 이 기기의 FCM 토큰을 내 계정에 등록 (같은 토큰이면 덮어씀) */
export const registerFcmToken = (token: string) => api.put("/api/v1/member/fcm-token", { token });

/** 내 계정의 FCM 토큰 해제 */
export const deleteFcmToken = () => api.delete("/api/v1/member/fcm-token");
