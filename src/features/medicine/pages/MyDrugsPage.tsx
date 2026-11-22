// 내 약: 스캔에서 저장한 약 목록. 편집을 누르면 여러 개를 골라서 지울 수 있다
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Bell, Check, ChevronRight, Pill, ScanLine } from "lucide-react";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";
import LoginRequired from "../../../components/common/LoginRequired";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { ROUTES, singleMedicinePath } from "../../../constants/routes";
import { authStorage } from "../../../utils/authStorage";
import { myDrugApi, type MyDrug } from "../api/myDrugApi";
import { useScanSheet } from "../context/scanSheet";
import RepresentativePhoto from "../components/RepresentativePhoto";

export default function MyDrugsPage() {
  const navigate = useNavigate();
  const openScanSheet = useScanSheet();
  const loggedIn = authStorage.isLoggedIn();
  // 스캔 결과에서 방금 저장한 약 (NEW 표시)
  const newIds: number[] = (useLocation().state as { newIds?: number[] } | null)?.newIds ?? [];

  const [items, setItems] = useState<MyDrug[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(loggedIn);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [picked, setPicked] = useState<number[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);
  const generation = useRef(0);

  /** page 0이면 새로 불러오고, 그 뒤 페이지는 목록 뒤에 붙인다 */
  const load = useCallback(async (nextPage: number) => {
    const current = ++generation.current;
    setLoading(true);
    setError("");
    try {
      const data = await myDrugApi.list(nextPage);
      if (generation.current !== current) return;
      setItems((prev) => (nextPage === 0 ? data.items : [...prev, ...data.items]));
      setTotal(data.totalElements);
      setPage(nextPage);
      setHasNext(data.hasNext);
    } catch {
      if (generation.current === current) setError("내 약을 불러오지 못했어요");
    } finally {
      if (generation.current === current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    const tracker = generation;
    void load(0);
    return () => {
      tracker.current++;
    };
  }, [loggedIn, load]);

  const toggleEditing = () => {
    setEditing(!editing);
    setPicked([]);
  };
  const togglePick = (id: number) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // 여러 개를 한 번에 지우는 API가 없어서 하나씩 지운다
  async function removePicked() {
    setConfirming(false);
    if (!picked.length || removing) return;
    setRemoving(true);
    let failed = 0;
    for (const id of picked) {
      try {
        await myDrugApi.remove(id);
      } catch {
        failed++;
      }
    }
    setRemoving(false);
    if (failed) toast.error(`${failed}개를 지우지 못했어요`);
    else toast.success(`${picked.length}개를 지웠어요`);
    setEditing(false);
    setPicked([]);
    void load(0);
  }

  if (!loggedIn) {
    return (
      <MobileLayout>
        <PageHeader title="내 약" />
        <LoginRequired />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showBottomNav={!editing}>
      <div className="flex min-h-full flex-col bg-[#f4f5f9]">
        <PageHeader title="내 약" />
        <div className="flex-1 space-y-3 px-4 pb-6 pt-4">
          {items.length > 0 && (
            <div className="flex items-center justify-between px-1">
              <h2 className="font-bold text-slate-900">저장한 약 {total}개</h2>
              <button type="button" onClick={toggleEditing} className="text-sm font-bold text-primary">
                {editing ? "완료" : "편집"}
              </button>
            </div>
          )}

          {error && (
            <p role="alert" className="text-center text-sm text-red-500">
              {error}{" "}
              <button type="button" onClick={() => void load(0)} className="font-bold text-primary">
                다시 시도
              </button>
            </p>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="mt-20 flex flex-col items-center">
              <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-white text-slate-300">
                <Pill size={26} />
              </span>
              <p className="mb-5 text-sm text-slate-500">저장한 약이 없어요</p>
              <button
                type="button"
                onClick={openScanSheet}
                className="flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
              >
                <ScanLine size={16} />
                약 스캔하기
              </button>
            </div>
          )}

          {items.map((drug) => {
            const sub = [drug.ingredientDisplay, drug.classificationName].filter(Boolean).join(" · ");
            const isPicked = picked.includes(drug.memberDrugId);
            return (
              <div key={drug.memberDrugId} className="rounded-[20px] bg-white p-4">
                <button
                  type="button"
                  onClick={() =>
                    editing ? togglePick(drug.memberDrugId) : navigate(singleMedicinePath(drug.drugId))
                  }
                  aria-pressed={editing ? isPicked : undefined}
                  className="flex w-full items-center gap-3 text-left"
                >
                  {editing && (
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${
                        isPicked ? "border-primary bg-primary text-white" : "border-slate-300"
                      }`}
                    >
                      {isPicked && <Check size={14} strokeWidth={3} />}
                    </span>
                  )}
                  <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f4f5f9]">
                    {drug.representativeImageStatus === "READY" && drug.imageUrl ? (
                      <RepresentativePhoto key={`${drug.drugId}:${drug.imageUrl}`} drugId={drug.drugId} url={drug.imageUrl} ready />
                    ) : (
                      <Pill size={22} className="text-slate-300" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block break-words font-bold text-slate-900">
                      {drug.name}
                      {newIds.includes(drug.memberDrugId) && (
                        <span className="ml-1.5 rounded-md bg-primary-50 px-1.5 py-0.5 align-middle text-[10px] font-bold text-primary">
                          NEW
                        </span>
                      )}
                    </span>
                    {sub && <span className="mt-0.5 block truncate text-xs text-slate-500">{sub}</span>}
                  </span>
                  {!editing && <ChevronRight size={20} className="shrink-0 text-slate-400" />}
                </button>
                {!editing && (
                  <button
                    type="button"
                    onClick={() => navigate(`${ROUTES.ALARM_NEW}?name=${encodeURIComponent(drug.name)}`)}
                    className="mt-3 flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary"
                  >
                    <Bell size={13} />
                    복약 알림 설정
                  </button>
                )}
              </div>
            );
          })}

          {loading && <p className="py-4 text-center text-sm text-slate-400">불러오는 중...</p>}
          {!loading && hasNext && (
            <button
              type="button"
              onClick={() => void load(page + 1)}
              className="w-full rounded-2xl bg-white py-3 text-sm font-bold text-slate-600"
            >
              더 보기
            </button>
          )}
        </div>

        {editing && (
          <div className="sticky bottom-0 border-t border-slate-100 bg-white px-4 pb-6 pt-3">
            <button
              type="button"
              disabled={!picked.length || removing}
              onClick={() => setConfirming(true)}
              className="w-full rounded-2xl bg-red-500 py-4 font-bold text-white disabled:opacity-40"
            >
              {removing ? "지우는 중..." : picked.length ? `${picked.length}개 지우기` : "지울 약을 골라 주세요"}
            </button>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={confirming}
        title={`선택한 약 ${picked.length}개를 지울까요?`}
        confirmLabel="지우기"
        cancelLabel="취소"
        tone="danger"
        onConfirm={() => void removePicked()}
        onCancel={() => setConfirming(false)}
      />
    </MobileLayout>
  );
}
