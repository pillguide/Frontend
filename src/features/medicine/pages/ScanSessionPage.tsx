// 스캔 기록 상세: 그때 스캔한 약 목록과 함께 복용 확인 (GET /api/v1/scan/{sessionId})
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";
import LoginRequired from "../../../components/common/LoginRequired";
import { singleMedicinePath } from "../../../constants/routes";
import { authStorage } from "../../../utils/authStorage";
import CombinationSummary from "../components/CombinationSummary";
import DrugThumb from "../components/DrugThumb";
import { scanApi, type ScanSessionDetail } from "../api/scanApi";
import { formatScannedAt } from "../utils/drugText";

export default function ScanSessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const loggedIn = authStorage.isLoggedIn();
  const [state, setState] = useState<{ id?: string; data?: ScanSessionDetail; error?: string }>({});

  useEffect(() => {
    if (!loggedIn || !id) return;
    let cancelled = false;
    scanApi
      .detail(Number(id))
      .then((data) => {
        if (!cancelled) setState({ id, data });
      })
      .catch(() => {
        if (!cancelled) setState({ id, error: "스캔 기록을 불러오지 못했어요" });
      });
    return () => {
      cancelled = true;
    };
  }, [loggedIn, id]);

  const data = state.id === id ? state.data : undefined;
  const error = state.id === id ? state.error : undefined;

  return (
    <MobileLayout>
      <PageHeader title="스캔 기록" />
      <div className="min-h-full space-y-3 bg-[#f4f5f9] px-4 pb-10 pt-4">
        {!loggedIn ? (
          <LoginRequired />
        ) : !data ? (
          <p className="mt-16 text-center text-sm text-slate-500">{error ?? "불러오는 중..."}</p>
        ) : (
          <>
            {/* 요약: 스캔한 약 썸네일을 겹쳐서 + 개수·날짜 */}
            <section className="flex items-center gap-4 rounded-[20px] bg-white p-5">
              {data.drugs.length > 0 && (
                <div className="flex shrink-0">
                  {data.drugs.slice(0, 3).map((drug, i) => (
                    <DrugThumb
                      key={drug.detectionId ?? `t${i}`}
                      drug={drug}
                      className={`size-14 rounded-2xl ring-[3px] ring-white ${i > 0 ? "-ml-4" : ""}`}
                    />
                  ))}
                </div>
              )}
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900">약 {data.drugs.length}개를 스캔했어요</h2>
                <p className="mt-0.5 text-sm text-slate-500">{formatScannedAt(data.scannedAt)}</p>
              </div>
            </section>

            <h2 className="px-1 pt-3 font-bold text-slate-900">스캔한 약</h2>
            {data.drugs.length === 0 && (
              <p className="rounded-[20px] bg-white p-5 text-center text-sm text-slate-500">
                {data.legacy ? "이전 기록이라 약 정보가 없어요" : "찾은 알약이 없어요"}
              </p>
            )}
            {data.drugs.map((drug, i) => (
              <button
                key={drug.detectionId ?? `d${i}`}
                type="button"
                onClick={() => navigate(singleMedicinePath(drug.drugId))}
                className="flex w-full items-center gap-3 rounded-[20px] bg-white p-3 text-left"
              >
                <DrugThumb drug={drug} className="size-14 rounded-xl" />
                <span className="min-w-0 flex-1 break-words font-bold text-slate-900">{drug.name}</span>
                <ChevronRight size={20} className="shrink-0 text-slate-400" />
              </button>
            ))}

            {data.drugs.length > 1 && (
              <>
                <div className="flex items-center justify-between px-1 pt-3">
                  <h2 className="font-bold text-slate-900">함께 복용 확인</h2>
                  {data.combination && (
                    <span className="text-xs text-slate-400">{data.combination.pairCount}개 조합</span>
                  )}
                </div>
                <CombinationSummary combination={data.combination} />
              </>
            )}
          </>
        )}
      </div>
    </MobileLayout>
  );
}
