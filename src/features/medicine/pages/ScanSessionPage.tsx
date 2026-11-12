// src/features/medicine/pages/ScanSessionPage.tsx
// 스캔 기록 상세: 그때 스캔한 약 목록 (GET /api/v1/scan/{sessionId})
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";
import LoginRequired from "../../../components/common/LoginRequired";
import { singleMedicinePath } from "../../../constants/routes";
import { authStorage } from "../../../utils/authStorage";
import CombinationSummary from "../components/CombinationSummary";
import MedicineItemRow from "../components/MedicineItemRow";
import { scanApi, type ScanSessionDetail } from "../api/scanApi";
import { formatScannedAt } from "../utils/drugText";

export default function ScanSessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const loggedIn = authStorage.isLoggedIn();
  const [state, setState] = useState<{
    id?: string;
    data?: ScanSessionDetail;
    error?: string;
  }>({});

  useEffect(() => {
    if (!loggedIn || !id) return;
    let cancelled = false;
    scanApi
      .detail(Number(id))
      .then((data) => {
        if (!cancelled) setState({ id, data });
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setState({
            id,
            error:
              e instanceof Error ? e.message : "스캔 기록을 불러오지 못했어요",
          });
      });
    return () => {
      cancelled = true;
    };
  }, [loggedIn, id]);

  const data = state.id === id ? state.data : undefined;
  const error = state.id === id ? state.error : undefined;
  const images =
    data?.drugs
      .map((d) => d.imageUrl)
      .filter((url): url is string => !!url)
      .slice(0, 3) ?? [];

  return (
    <MobileLayout>
      <PageHeader title="스캔 기록" />

      <div className="bg-slate-50 px-5 pt-6 pb-10">
        {!loggedIn ? (
          <LoginRequired />
        ) : !data ? (
          <p className="mt-16 text-center text-sm text-slate-500">
            {error ?? "불러오는 중..."}
          </p>
        ) : (
          <>
            {images.length > 0 && (
              <div className="rounded-[28px] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="grid grid-cols-3 gap-3">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt=""
                      className="h-24 w-full rounded-2xl object-contain"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 rounded-[24px] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <h2 className="text-lg font-bold text-slate-900">
                💊 약 {data.drugs.length}개를 스캔했어요
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {formatScannedAt(data.scannedAt)}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                촬영한 원본 사진은 보관하지 않아 다시 볼 수 없어요. 아래는 당시
                검출 결과이며 약 상세는 현재 자료예요.
              </p>
              {data.legacy && (
                <p className="mt-2 text-sm text-slate-500">
                  이전 기록에는 검출 세부 정보가 없어요.
                </p>
              )}
            </div>

            <div className="mt-4 rounded-[24px] bg-white p-5">
              <h2 className="mb-3 font-bold">당시 병용 확인</h2>
              <CombinationSummary combination={data.combination} />
            </div>
            <div className="mt-6">
              <p className="mb-3 text-base font-bold text-slate-900">
                포함된 약
              </p>
              <div className="space-y-2.5">
                {data.drugs.map((drug, index) => (
                  <MedicineItemRow
                    key={drug.detectionId ?? `legacy-${index}`}
                    medicine={{
                      id: drug.drugId,
                      name: drug.name,
                      imageUrl: drug.imageUrl,
                    }}
                    onClick={() => navigate(singleMedicinePath(drug.drugId))}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  );
}
