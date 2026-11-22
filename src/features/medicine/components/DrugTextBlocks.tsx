// 식약처 원문을 소제목·글머리표·안내 칩으로 나눠서 보여준다. limit이 있으면 글머리표 그만큼만 + 더 보기
import { useState } from "react";
import { Info } from "lucide-react";
import { toTextBlocks } from "../utils/drugText";

export default function DrugTextBlocks({ text, limit }: { text: string | null | undefined; limit?: number }) {
  const [expanded, setExpanded] = useState(false);
  const blocks = toTextBlocks(text);
  const itemCount = blocks.filter((b) => b.kind === "item").length;
  const cut = !!limit && !expanded && itemCount > limit;

  let shownItems = 0;
  const visible = cut
    ? blocks.filter((b) => {
        if (b.kind !== "item") return shownItems < limit;
        shownItems++;
        return shownItems <= limit;
      })
    : blocks;

  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-slate-700">
      {visible.map((b, i) =>
        b.kind === "notice" ? (
          <p key={i} className="flex items-start gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs text-amber-700">
            <Info size={14} className="mt-0.5 shrink-0" />
            {b.text}
          </p>
        ) : b.kind === "heading" ? (
          <p key={i} className="pt-1 text-[13px] font-bold text-slate-900">
            {b.text}
          </p>
        ) : (
          <p key={i} className="flex gap-1.5">
            <span className="text-slate-400">•</span>
            <span>{b.text}</span>
          </p>
        ),
      )}
      {!!limit && itemCount > limit && (
        <button type="button" onClick={() => setExpanded(!expanded)} className="pt-1 text-sm font-bold text-primary">
          {expanded ? "접기" : "더 보기"}
        </button>
      )}
    </div>
  );
}
