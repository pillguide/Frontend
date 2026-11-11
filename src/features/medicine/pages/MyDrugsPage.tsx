import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";
import LoginRequired from "../../../components/common/LoginRequired";
import { singleMedicinePath } from "../../../constants/routes";
import { authStorage } from "../../../utils/authStorage";
import { myDrugApi, type MyDrug } from "../api/myDrugApi";
import {
  infoStatusLabel,
  authorizationStatusLabel,
} from "../utils/referenceLabels";

export default function MyDrugsPage() {
  const navigate = useNavigate();
  const loggedIn = authStorage.isLoggedIn();
  const [items, setItems] = useState<MyDrug[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const generation = useRef(0);

  useEffect(() => {
    if (!loggedIn) return;
    const tracker = generation;
    const current = ++tracker.current;
    setItems([]);
    setHasNext(false);
    setLoading(true);
    setError("");
    myDrugApi
      .list(page)
      .then((data) => {
        if (generation.current !== current) return;
        setItems(data.items);
        setHasNext(data.hasNext);
      })
      .catch(() => {
        if (generation.current === current)
          setError("내 약을 불러오지 못했어요.");
      })
      .finally(() => {
        if (generation.current === current) setLoading(false);
      });
    return () => {
      tracker.current++;
    };
  }, [loggedIn, page]);

  async function remove(id: number) {
    if (removing || loading) return;
    const current = generation.current;
    setRemoving(true);
    setError("");
    try {
      await myDrugApi.remove(id);
      if (generation.current !== current) return;
      const data = await myDrugApi.list(page);
      if (generation.current !== current) return;
      if (page > 0 && data.items.length === 0) {
        setItems([]);
        setPage(page - 1);
      } else {
        setItems(data.items);
        setHasNext(data.hasNext);
      }
    } catch {
      if (generation.current === current)
        setError("내 약을 제거하거나 목록을 갱신하지 못했어요.");
    } finally {
      if (generation.current === current) setRemoving(false);
    }
  }

  return (
    <MobileLayout>
      <PageHeader title="내 약" />
      <div className="space-y-3 px-5 pt-6">
        {!loggedIn ? (
          <LoginRequired />
        ) : (
          <>
            {loading && <p>불러오는 중...</p>}
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
            {!loading && !error && !items.length && (
              <p className="text-sm text-slate-500">등록된 약이 없어요.</p>
            )}
            {items.map((drug) => (
              <div
                key={drug.memberDrugId}
                className="rounded-2xl bg-white p-4 shadow-sm"
              >
                <button
                  className="max-w-full break-words text-left font-semibold"
                  onClick={() => navigate(singleMedicinePath(drug.drugId))}
                >
                  {drug.name}
                </button>
                <p className="mt-1 text-xs text-slate-500">
                  품목번호 {drug.code} · 자료 {infoStatusLabel(drug.infoStatus)}{" "}
                  · 허가 {authorizationStatusLabel(drug.authorizationStatus)}
                </p>
                <button
                  disabled={removing || loading}
                  className="mt-3 text-sm text-red-500 disabled:opacity-40"
                  onClick={() => void remove(drug.memberDrugId)}
                >
                  내 약에서 제거
                </button>
              </div>
            ))}
            <div className="flex gap-3">
              <button
                disabled={removing || loading || page === 0}
                onClick={() => setPage(page - 1)}
                className="rounded-xl border p-2 disabled:opacity-40"
              >
                이전
              </button>
              <button
                disabled={removing || loading || !hasNext}
                onClick={() => setPage(page + 1)}
                className="rounded-xl border p-2 disabled:opacity-40"
              >
                다음
              </button>
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  );
}
