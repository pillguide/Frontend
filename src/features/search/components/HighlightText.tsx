// src/features/search/components/HighlightText.tsx
// 검색어와 겹치는 부분을 보라색으로 강조 (띄어쓰기 차이는 무시하지 않음 — 표시용)
interface HighlightTextProps {
  text: string;
  query: string;
}

export default function HighlightText({ text, query }: HighlightTextProps) {
  const q = query.trim();
  const index = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (index < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-transparent font-bold text-primary">{text.slice(index, index + q.length)}</mark>
      {text.slice(index + q.length)}
    </>
  );
}
