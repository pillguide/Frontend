import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";
import { ROUTES, singleMedicinePath } from "../../../constants/routes";
import { myDrugApi } from "../api/myDrugApi";
import { scanDraft, useScanDraft } from "../scanDraft";
import {
  infoStatusLabel,
  authorizationStatusLabel,
} from "../utils/referenceLabels";
import CombinationSummary from "../components/CombinationSummary";

export default function ScanResultPage() {
  const navigate = useNavigate();
  const { result, selected } = useScanDraft();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  async function save() {
    if (!result || !selected.length || busy) return;
    const generation = scanDraft.get().generation;
    setBusy(true);
    setError("");
    try {
      await myDrugApi.save(result.sessionId, selected);
      if (mounted.current && scanDraft.isCurrent(generation)) {
        scanDraft.clear();
        navigate(ROUTES.MY_DRUGS);
      }
    } catch {
      if (mounted.current && scanDraft.isCurrent(generation))
        setError("저장하지 못했어요. 다시 시도해 주세요.");
    } finally {
      if (mounted.current && scanDraft.isCurrent(generation)) setBusy(false);
    }
  }
  return (
    <MobileLayout>
      <PageHeader title="스캔 결과" />
      <div className="space-y-4 bg-slate-50 px-5 pt-6 pb-10">
        {!result ? (
          <p className="text-sm text-slate-500">
            현재 스캔 결과가 없어요.{" "}
            <button
              className="text-primary underline"
              onClick={() => navigate(ROUTES.SCAN)}
            >
              사진 선택하기
            </button>
          </p>
        ) : (
          <>
            <div className="rounded-[24px] bg-white p-5">
              <h2 className="font-bold">검출 {result.drugCount}개</h2>
              <p className="mt-2 text-sm text-slate-600">
                인식 결과는 참고용이며 정답을 보장하지 않아요. 모델 점수는 정답
                확률이 아니에요.
              </p>
              {result.drugs.length === 0 && (
                <p className="mt-3 text-sm">
                  검출된 약이 없어요. 다시 촬영할 수 있어요.
                </p>
              )}
            </div>
            {result.drugs.map((d, index) => (
              <div
                key={d.detectionId ?? `legacy-${index}`}
                className="rounded-2xl bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    aria-label={`${d.name} 검출 ${d.detectionIndex ?? index + 1} 선택`}
                    checked={
                      d.detectionId !== null && selected.includes(d.detectionId)
                    }
                    disabled={d.detectionId === null || busy}
                    onChange={(e) => {
                      const id = d.detectionId!;
                      scanDraft.setSelected(
                        e.target.checked
                          ? [...selected, id]
                          : selected.filter((x) => x !== id),
                      );
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold">
                      검출 {d.detectionIndex ?? index + 1}: {d.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      품목번호 {d.code}{" "}
                      {d.confidence !== null &&
                        `· 모델 점수 ${d.confidence.toFixed(3)}`}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      자료: {infoStatusLabel(d.infoStatus)} · 허가:{" "}
                      {authorizationStatusLabel(d.authorizationStatus)}
                    </p>
                    {d.recognitionMayBeDegraded && (
                      <p className="text-sm text-amber-700">
                        인식 품질이 낮을 수 있어요.
                      </p>
                    )}
                    <button
                      className="mt-2 text-sm text-primary underline"
                      onClick={() => navigate(singleMedicinePath(d.drugId))}
                    >
                      현재 약 상세 보기
                    </button>
                  </div>
                </div>
                {d.imageUrl && d.representativeImageStatus === "READY" ? (
                  <img
                    src={d.imageUrl}
                    alt="데이터셋 대표 이미지"
                    className="mt-3 h-24 object-contain"
                  />
                ) : (
                  <p className="mt-3 text-sm text-slate-500">
                    💊 대표 이미지 준비 중
                  </p>
                )}
              </div>
            ))}
            <div className="rounded-[24px] bg-white p-5">
              <h2 className="mb-3 font-bold">사진 전체 병용 확인</h2>
              <CombinationSummary combination={result.combination} />
            </div>
            <p className="text-sm text-slate-500">
              사진과 대표 이미지 비교 화면은 준비 중이에요.
            </p>
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
            <button
              disabled={!selected.length || busy}
              onClick={() => void save()}
              className="w-full rounded-xl bg-primary p-3 text-white disabled:opacity-40"
            >
              {busy
                ? "저장 중..."
                : `선택한 검출 ${selected.length}개 내 약에 저장`}
            </button>
            <div className="flex gap-3">
              <button
                disabled={busy}
                className="flex-1 rounded-xl border p-3 disabled:opacity-40"
                onClick={() => {
                  scanDraft.clear();
                  navigate(ROUTES.SCAN);
                }}
              >
                다시 촬영
              </button>
              <button
                disabled={busy}
                className="flex-1 rounded-xl border p-3 disabled:opacity-40"
                onClick={() => {
                  scanDraft.clear();
                  navigate(ROUTES.SCAN_RECORD);
                }}
              >
                저장 건너뛰기
              </button>
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  );
}
