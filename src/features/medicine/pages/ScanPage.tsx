// 약 스캔 - 분석 중 / 분석 실패. 사진은 카메라 시트(ScanSheetContext)에서 고른다
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCw, ScanLine, WifiOff } from "lucide-react";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";
import LoginRequired from "../../../components/common/LoginRequired";
import { ROUTES } from "../../../constants/routes";
import { authStorage } from "../../../utils/authStorage";
import { scanDraft, useScanDraft } from "../scanDraft";
import { useScanSheet } from "../context/scanSheet";

export default function ScanPage() {
  const navigate = useNavigate();
  const draft = useScanDraft();
  const openSheet = useScanSheet();

  useEffect(() => {
    if (draft.result) navigate(ROUTES.SCAN_RESULT, { replace: true });
  }, [draft.result, navigate]);

  // 뒤로 가기 = 분석 취소 후 시트를 열었던 화면으로
  const leave = () => {
    scanDraft.clear();
    navigate(-1);
  };

  if (!authStorage.isLoggedIn()) {
    return (
      <MobileLayout showBottomNav={false}>
        <PageHeader title="알약 스캔" />
        <LoginRequired />
      </MobileLayout>
    );
  }

  if (draft.status === "failed" && draft.preview) {
    const canRetry = !!draft.file && !draft.conflict;
    return (
      <MobileLayout showBottomNav={false}>
        <div className="flex min-h-full flex-col bg-[#f4f5f9]">
          <PageHeader title="알약 스캔" onBack={leave} />
          <div className="flex-1 space-y-3 px-4 pt-4">
            <img src={draft.preview} alt="선택한 사진" className="h-56 w-full rounded-[20px] bg-white object-contain" />
            <section className="flex flex-col items-center rounded-[20px] bg-white px-5 py-7 text-center">
              <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                <WifiOff size={22} />
              </span>
              <h2 className="text-lg font-bold text-slate-900">사진을 분석하지 못했어요</h2>
              <p className="mt-1 text-sm text-slate-500">{draft.error}</p>
            </section>
          </div>
          <div className="space-y-2 px-4 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-4">
            <button
              type="button"
              onClick={openSheet}
              className="w-full rounded-2xl border border-primary bg-white p-4 font-bold text-primary"
            >
              다른 사진 선택
            </button>
            {canRetry && (
              <button
                type="button"
                onClick={() => void scanDraft.start()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary p-4 font-bold text-white"
              >
                <RotateCw size={18} />
                같은 사진으로 다시 시도
              </button>
            )}
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (draft.preview) {
    return (
      <MobileLayout showBottomNav={false}>
        <div className="flex min-h-full flex-col bg-[#f4f5f9]">
          <PageHeader title="알약 인식 중" onBack={leave} />
          <div className="flex flex-1 flex-col items-center justify-center px-5 pb-20">
            <div className="relative h-[300px] w-full overflow-hidden rounded-[20px] bg-white">
              <img src={draft.preview} alt="분석 중인 사진" className="h-full w-full object-contain" />
              <div className="absolute inset-x-0 top-0 h-14 motion-safe:animate-scan-sweep">
                <div className="h-full bg-gradient-to-b from-primary/0 to-primary/20" />
                <div className="h-[3px] bg-primary shadow-[0_0_12px_2px_rgba(83,74,183,0.45)]" />
              </div>
            </div>
            <p className="mt-7 text-[17px] font-bold text-slate-900" role="status">
              분석 중
              {[0, 1, 2].map((i) => (
                <span key={i} className="motion-safe:animate-dot-blink" style={{ animationDelay: `${i * 0.2}s` }}>
                  .
                </span>
              ))}
            </p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // 새로고침 등으로 사진이 없는 상태
  return (
    <MobileLayout showBottomNav={false}>
      <PageHeader title="알약 스캔" />
      <div className="mt-24 flex flex-col items-center">
        <span className="mb-5 flex size-14 items-center justify-center rounded-full bg-primary-50 text-primary">
          <ScanLine size={26} />
        </span>
        <button
          type="button"
          onClick={openSheet}
          className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
        >
          사진 가져오기
        </button>
      </div>
    </MobileLayout>
  );
}
