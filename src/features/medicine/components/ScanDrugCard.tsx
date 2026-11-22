// 스캔 결과의 약 카드: 체크로 저장 대상을 고르고, 카드를 누르면 아래에 약 정보가 펼쳐진다
import { Check, ChevronDown, Pill } from "lucide-react";
import type { ScanDrugDetail, ScanDrugSummary } from "../api/scanApi";
import RepresentativePhoto from "./RepresentativePhoto";
import DrugInfoRows from "./DrugInfoRows";

export type DetailState = { data?: ScanDrugDetail; error?: boolean } | undefined;

interface Props {
  drug: ScanDrugSummary;
  checked: boolean;
  disabled: boolean;
  open: boolean;
  detail: DetailState;
  onToggleCheck: () => void;
  onToggleOpen: () => void;
  onRetry: () => void;
}

export default function ScanDrugCard({
  drug, checked, disabled, open, detail, onToggleCheck, onToggleOpen, onRetry,
}: Props) {
  const ready = drug.representativeImageStatus === "READY";
  const canCheck = drug.detectionId !== null && !disabled;
  return (
    <div className="rounded-[20px] bg-white">
      <div className="flex items-center gap-3 p-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-label={`${drug.name} 저장 선택`}
          disabled={!canCheck}
          onClick={onToggleCheck}
          className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition disabled:opacity-40 ${
            checked ? "border-primary bg-primary text-white" : "border-slate-300 bg-white"
          }`}
        >
          {checked && <Check size={14} strokeWidth={3} />}
        </button>
        <button
          type="button"
          onClick={onToggleOpen}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f4f5f9]">
            {ready && drug.imageUrl ? (
              <RepresentativePhoto key={`${drug.drugId}:${drug.imageUrl}`} drugId={drug.drugId} url={drug.imageUrl} ready />
            ) : (
              <Pill size={22} className="text-slate-300" />
            )}
          </span>
          <span className="min-w-0 flex-1 break-words font-bold text-slate-900">{drug.name}</span>
          <ChevronDown
            size={20}
            className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 p-4">
          <div>
            {detail?.data ? (
              <DrugInfoRows info={detail.data} />
            ) : detail?.error ? (
              <p className="py-3 text-sm text-slate-500">
                약 정보를 불러오지 못했어요{" "}
                <button type="button" onClick={onRetry} className="font-bold text-primary">
                  다시 시도
                </button>
              </p>
            ) : (
              <p className="py-3 text-sm text-slate-400">불러오는 중...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
