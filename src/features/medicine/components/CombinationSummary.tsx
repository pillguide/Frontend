// 사진에 있는 약들끼리 함께 먹으면 안 되는 조합(식약처 병용금기)이 있는지
import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { Combination } from "../api/scanApi";

export default function CombinationSummary({ combination }: { combination: Combination | null }) {
  if (!combination) return <p className="text-sm text-slate-500">병용 확인 결과가 없어요</p>;

  const source = (
    <p className="mt-3 text-xs text-slate-400">
      출처: 식약처 공공데이터{combination.sourceAsOf && ` · 기준일 ${combination.sourceAsOf}`}
    </p>
  );
  const partial = combination.coverageStatus === "REFERENCE_DATA_PARTIAL" && (
    <p className="mt-2 text-xs text-amber-700">일부 약은 자료가 부족해요</p>
  );

  if (combination.matches.length === 0) {
    return (
      <div className="rounded-[20px] border border-emerald-100 bg-emerald-50 p-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={22} className="shrink-0 text-emerald-600" />
          <p className="font-bold text-emerald-800">함께 먹으면 안 되는 조합은 없어요</p>
        </div>
        <p className="mt-2 text-sm text-slate-600">처음 함께 먹는 약이면 약사에게 확인해 주세요</p>
        {partial}
        {source}
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-red-100 bg-red-50 p-4">
      <div className="flex items-center gap-2">
        <ShieldAlert size={22} className="shrink-0 text-red-600" />
        <p className="font-bold text-red-700">함께 먹으면 안 되는 조합이 있어요</p>
      </div>
      <ul className="mt-3 space-y-2">
        {combination.matches.map((m, i) => (
          <li key={i} className="rounded-xl bg-white p-3 text-sm">
            <p className="font-bold text-slate-900">
              {m.firstName} + {m.secondName}
            </p>
            {(m.summary || m.officialReason) && (
              <p className="mt-1 text-slate-600">{m.summary || m.officialReason}</p>
            )}
          </li>
        ))}
      </ul>
      {partial}
      {source}
    </div>
  );
}
