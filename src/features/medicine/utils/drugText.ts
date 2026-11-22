// 식약처(e약은요) 텍스트를 화면용 항목 목록으로 변환
/** HTML 태그·공백을 정리하고 줄 단위(없으면 문장 단위)로 나눈다 */
export function toTextItems(text: string | null | undefined): string[] {
  if (!text) return [];
  const clean = text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
  // 식약처 원문 맨 앞의 "효능효과" 같은 제목 줄은 화면 제목과 겹쳐서 뺀다
  const lines = clean
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l && !/^(\d+\.\s*)?(주\s*)?(효능\s*·?\s*효과|용법\s*·?\s*용량|사용상의\s*주의\s*사항|저장\s*방법)$/.test(l));
  if (lines.length > 1) return lines;
  // 한 덩어리면 "~다." 문장 단위로 나눔
  return clean.split(/(?<=다\.)\s+/).map((s) => s.trim()).filter(Boolean);
}

/** 2026-11-10T15:12:30 → 11월 10일 오후 3:12 */
export function formatScannedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const h = d.getHours();
  const period = h < 12 ? "오전" : "오후";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${period} ${h12}:${String(d.getMinutes()).padStart(2, "0")}`;
}
