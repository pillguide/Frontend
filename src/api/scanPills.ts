import type { Pill } from "../types/pill";

const USE_MOCK = true; // 발표 땐 true, 백엔드 연결되면 false로만 바꾸면 끝

export async function scanPills(imageFile: File): Promise<Pill[]> {
  if (USE_MOCK) {
    // 발표용 가짜 결과 (1.5초 분석하는 척)
    await new Promise((r) => setTimeout(r, 1500));
    return [
      { name: "타이레놀정 500mg", type: "해열진통제", confidence: 0.92, warning: "공복 복용을 피하고 1일 4회 이하로 복용하세요." },
      { name: "게보린정", type: "해열진통제", confidence: 0.88, warning: "15세 미만은 복용을 피하세요." },
      { name: "베아제정", type: "소화제", confidence: 0.85, warning: "식사 직후 복용하는 것이 좋습니다." },
    ];
  }

  // 진짜 백엔드 연결 (지금은 잠들어 있음)
  const formData = new FormData();
  formData.append("image", imageFile);
  const res = await fetch(import.meta.env.VITE_API_URL + "/api/scan", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("서버 응답 오류");
  return await res.json();
}