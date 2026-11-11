import type { Combination } from "../api/scanApi";
import { evidenceTypeLabel } from "../utils/referenceLabels";
export default function CombinationSummary({
  combination,
}: {
  combination: Combination | null;
}) {
  if (!combination)
    return (
      <p className="text-sm text-slate-500">당시 병용 확인 결과가 없어요.</p>
    );
  return (
    <div className="space-y-2 text-sm text-slate-700">
      <p>
        사진 전체: 고유 품목 {combination.uniqueDrugCount}개 · 비교{" "}
        {combination.pairCount}쌍 · 확인된 금기{" "}
        {combination.confirmedContraindicationCount}쌍
      </p>
      <p>
        지원하는 150종 중 확인된 4쌍의 병용금기 자료를 기준으로 비교했어요.
        일치하는 항목이 없어도 안전하다는
        뜻은 아니에요.
      </p>
      {combination.coverageStatus === "REFERENCE_DATA_PARTIAL" && (
        <p className="text-amber-700">
          일부 자료가 부족해 확인 범위가 제한돼요.
        </p>
      )}
      <p>
        출처: 식약처 공공데이터 · 자료 기준일:{" "}
        {combination.sourceAsOf ?? "확인 불가"}
        {combination.refreshDelayed ? " · 자료 갱신 지연" : ""}
      </p>
      {combination.matches.map((m, i) => (
        <div key={i} className="rounded-xl bg-amber-50 p-3">
          <p className="font-semibold">
            {m.firstName} + {m.secondName}
          </p>
          <p>근거 유형: {evidenceTypeLabel(m.evidenceType)}</p>
          <p>공식 사유: {m.officialReason || "제공되지 않음"}</p>
          {m.summary && <p>{m.summary}</p>}
          <p>근거 기준일: {m.sourceAsOf ?? "확인 불가"}</p>
        </div>
      ))}
    </div>
  );
}
