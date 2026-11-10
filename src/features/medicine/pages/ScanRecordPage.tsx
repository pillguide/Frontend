// src/features/medicine/pages/ScanRecordPage.tsx
// 스캔 기록 목록 (GET /api/v1/scan)
import { useEffect, useState } from "react";
import { ChevronRight, ScanLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";
import LoginRequired from "../../../components/common/LoginRequired";
import { ROUTES, scanSessionPath } from "../../../constants/routes";
import { authStorage } from "../../../utils/authStorage";
import { scanApi, type ScanSessionSummary } from "../api/scanApi";
import { formatScannedAt } from "../utils/drugText";

export default function ScanRecordPage() {
  const navigate = useNavigate();
  const loggedIn = authStorage.isLoggedIn();
  const [records, setRecords] = useState<ScanSessionSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!loggedIn) return;
    let cancelled = false;
    scanApi
      .list()
      .then((list) => {
        if (!cancelled) {
          setRecords(list);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "스캔 기록을 불러오지 못했어요");
      });
    return () => {
      cancelled = true;
    };
  }, [loggedIn, retry]);

  return (
    <MobileLayout>
      <PageHeader title="스캔기록" />

      <div className="min-h-screen bg-slate-50 px-5 pt-6 pb-24">
        {!loggedIn ? (
          <LoginRequired message="로그인하면 스캔한 약 기록을 모아 볼 수 있어요" />
        ) : error ? (
          <div className="mt-20 flex flex-col items-center text-center">
            <p className="text-base font-medium text-slate-700">스캔 기록을 불러오지 못했어요</p>
            <p className="mt-1 text-sm text-slate-500">{error}</p>
            <button
              type="button"
              onClick={() => setRetry((n) => n + 1)}
              className="mt-6 rounded-full border border-primary bg-white px-6 py-2.5 text-sm font-medium text-primary"
            >
              다시 시도
            </button>
          </div>
        ) : records === null ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-white/70" />
            ))}
          </div>
        ) : records.length > 0 ? (
          <>
            <p className="mb-3 text-xs text-slate-500">최근 스캔한 약 조합</p>
            <div className="space-y-3">
              {records.map((item) => (
                <button
                  key={item.sessionId}
                  onClick={() => navigate(scanSessionPath(item.sessionId))}
                  className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                      <ScanLine size={22} className="text-primary" />
                    </span>
                    <div className="text-left">
                      <p className="font-semibold text-slate-900">약 {item.drugCount}개</p>
                      <p className="mt-0.5 text-xs text-slate-500">{formatScannedAt(item.scannedAt)}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-400" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <ScanLine size={24} className="text-slate-400" />
            </div>
            <p className="mb-5 text-sm text-slate-500">약을 스캔하면 여기에 기록돼요</p>
            <button
              onClick={() => navigate(ROUTES.SCAN)}
              className="rounded-full border border-[#534AB7] bg-white px-6 py-2.5 text-sm font-medium text-[#534AB7] transition-colors hover:bg-[#534AB7] hover:text-white"
            >
              약 스캔하기
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
