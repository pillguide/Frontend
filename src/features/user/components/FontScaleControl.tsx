// src/features/user/components/FontScaleControl.tsx
import { useState } from "react";
import { fontScaleStorage, type FontScale } from "../../../utils/fontScale";

const OPTIONS: { value: FontScale; label: string }[] = [
  { value: "xs", label: "최대 작게" },
  { value: "sm", label: "조금 작게" },
  { value: "md", label: "중간" },
  { value: "lg", label: "조금 크게" },
  { value: "xl", label: "최대 크게" },
];

function applyFontScale(scale: FontScale) {
  document.documentElement.setAttribute("data-font-scale", scale);
  fontScaleStorage.set(scale);
}

export default function FontScaleControl() {
  const [scale, setScale] = useState<FontScale>(() => fontScaleStorage.get());
  const index = OPTIONS.findIndex((o) => o.value === scale);

  const select = (next: FontScale) => {
    setScale(next);
    applyFontScale(next);
  };

  return (
    <div>
      {/* 미리보기 */}
      <div className="mb-5 rounded-2xl bg-slate-50 px-4 py-5 text-center">
        <p className="font-semibold text-slate-900">가나다라마바사</p>
        <p className="mt-1 text-slate-500">아스피린 · 오전 8시</p>
      </div>

      {/* 5단계 선택 */}
      <div className="relative px-3">
        <div className="absolute inset-x-3 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-100" />
        <div
          className="absolute left-3 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary transition-all"
          style={{ width: `calc((100% - 1.5rem) * ${index / (OPTIONS.length - 1)})` }}
        />
        <div className="relative flex justify-between">
          {OPTIONS.map((o, i) => (
            <button
              key={o.value}
              type="button"
              onClick={() => select(o.value)}
              aria-label={o.label}
              aria-pressed={i === index}
              className={`size-6 rounded-full border-4 transition ${
                i === index
                  ? "scale-125 border-primary bg-white shadow"
                  : i < index
                    ? "border-primary bg-primary"
                    : "border-slate-200 bg-white"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 flex justify-between text-[11px] text-slate-500">
        {OPTIONS.map((o, i) => (
          <span key={o.value} className={`w-12 text-center ${i === index ? "font-semibold text-primary" : ""}`}>
            {o.label}
          </span>
        ))}
      </div>
    </div>
  );
}
