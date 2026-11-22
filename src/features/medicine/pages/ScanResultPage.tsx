// 스캔 결과: 인식된 약 고르기 + 카드를 누르면 그 자리에서 약 정보 펼치기 + 병용 확인
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Camera } from "lucide-react";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";
import { ROUTES } from "../../../constants/routes";
import { useScanSheet } from "../context/scanSheet";
import { myDrugApi } from "../api/myDrugApi";
import { scanApi } from "../api/scanApi";
import { scanDraft, useScanDraft } from "../scanDraft";
import CombinationSummary from "../components/CombinationSummary";
import ScanDrugCard, { type DetailState } from "../components/ScanDrugCard";

export default function ScanResultPage() {
  const navigate = useNavigate();
  const openScanSheet = useScanSheet();
  const { result, selected, preview } = useScanDraft();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<number, DetailState>>({});
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadDetail = useCallback(
    async (drugId: number) => {
      if (!result) return;
      const sessionId = result.sessionId;
      setDetails((d) => ({ ...d, [drugId]: undefined }));
      try {
        const data = await scanApi.drugDetail(sessionId, drugId);
        if (mounted.current) setDetails((d) => ({ ...d, [drugId]: { data } }));
      } catch {
        if (mounted.current) setDetails((d) => ({ ...d, [drugId]: { error: true } }));
      }
    },
    [result],
  );

  const toggleOpen = (key: string, drugId: number) => {
    const next = openKey === key ? null : key;
    setOpenKey(next);
    if (next && !details[drugId]?.data) void loadDetail(drugId);
  };

  const toggleCheck = (detectionId: number | null) => {
    if (detectionId === null) return;
    scanDraft.setSelected(
      selected.includes(detectionId) ? selected.filter((x) => x !== detectionId) : [...selected, detectionId],
    );
  };

  // 저장 없이 알림 추가로 이동 (뒤로 가면 결과 화면이 그대로 남아 있음)
  const openAlarm = () => {
    if (!result) return;
    const names = result.drugs
      .filter((d) => d.detectionId !== null && selected.includes(d.detectionId))
      .map((d) => d.name);
    navigate(`${ROUTES.ALARM_NEW}?name=${encodeURIComponent([...new Set(names)].join(", "))}`);
  };

  /** 선택한 약을 내 약에 저장하고 내 약 목록으로 */
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
      if (mounted.current && scanDraft.isCurrent(generation)) setError("저장하지 못했어요. 다시 시도해 주세요");
    } finally {
      if (mounted.current && scanDraft.isCurrent(generation)) setBusy(false);
    }
  }

  if (!result) {
    return (
      <MobileLayout showBottomNav={false}>
        <PageHeader title="스캔 결과" />
        <div className="mt-24 flex flex-col items-center">
          <button type="button" onClick={openScanSheet} className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white">
            사진 가져오기
          </button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showBottomNav={false}>
      <div className="flex min-h-full flex-col bg-[#f4f5f9]">
        <PageHeader title="스캔 결과" />
        <div className="flex-1 space-y-3 px-4 pb-6 pt-4">
          <div className="relative h-[200px] overflow-hidden rounded-[20px] bg-white">
            {preview && <img src={preview} alt="스캔한 사진" className="h-full w-full object-contain" />}
            <button
              type="button"
              disabled={busy}
              onClick={openScanSheet}
              className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-slate-900/70 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
            >
              <Camera size={14} />
              다시 찍기
            </button>
          </div>

          <h2 className="px-1 pt-2 font-bold text-slate-900">인식된 약 {result.drugs.length}개</h2>
          {result.drugs.length === 0 && (
            <p className="rounded-[20px] bg-white p-5 text-center text-sm text-slate-500">알약을 찾지 못했어요</p>
          )}
          {result.drugs.map((d, index) => {
            const key = d.detectionId === null ? `i${index}` : `d${d.detectionId}`;
            return (
              <ScanDrugCard
                key={key}
                drug={d}
                checked={d.detectionId !== null && selected.includes(d.detectionId)}
                disabled={busy}
                open={openKey === key}
                detail={details[d.drugId]}
                preview={preview}
                imageSize={result.imageSize}
                onToggleCheck={() => toggleCheck(d.detectionId)}
                onToggleOpen={() => toggleOpen(key, d.drugId)}
                onRetry={() => void loadDetail(d.drugId)}
              />
            );
          })}

          {result.drugs.length > 1 && (
            <>
              <div className="flex items-center justify-between px-1 pt-3">
                <h2 className="font-bold text-slate-900">함께 복용 확인</h2>
                {result.combination && (
                  <span className="text-xs text-slate-400">{result.combination.pairCount}개 조합</span>
                )}
              </div>
              <CombinationSummary combination={result.combination} />
            </>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-slate-100 bg-white px-4 pb-6 pt-3">
          {error && (
            <p role="alert" className="mb-2 text-center text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!selected.length || busy}
              onClick={openAlarm}
              className="flex items-center justify-center gap-1 rounded-2xl border border-primary px-4 py-4 text-sm font-bold text-primary disabled:opacity-40"
            >
              <Bell size={16} />
              알림 설정
            </button>
            <button
              type="button"
              disabled={!selected.length || busy}
              onClick={() => void save()}
              className="flex-1 rounded-2xl bg-primary py-4 font-bold text-white disabled:opacity-40"
            >
              {busy ? "저장 중..." : `선택한 약 ${selected.length}개 저장`}
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
