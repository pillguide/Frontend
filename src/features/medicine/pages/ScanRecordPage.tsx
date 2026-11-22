// 스캔 기록 목록 (GET /api/v1/scan). 목록 API는 날짜·개수만 줘서 최근 기록은 상세 API로 약 이름·사진을 채운다
import { useEffect, useState } from "react";
import { ChevronRight, ScanLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";
import LoginRequired from "../../../components/common/LoginRequired";
import { scanSessionPath } from "../../../constants/routes";
import { authStorage } from "../../../utils/authStorage";
import { useScanSheet } from "../context/scanSheet";
import { scanApi, type ScanDrugSummary, type ScanSessionSummary } from "../api/scanApi";
import DrugThumb from "../components/DrugThumb";
import { formatKoreanTime, koreaToday, toDateKey, WEEKDAY_SHORT, addDays } from "../../intake/utils/date";

/** 약 이름·사진까지 불러올 최근 기록 수 */
const DETAIL_LIMIT = 20;

function dayLabel(dateKey: string, today: Date) {
  if (dateKey === toDateKey(today)) return "오늘";
  if (dateKey === toDateKey(addDays(today, -1))) return "어제";
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${m}월 ${d}일 ${WEEKDAY_SHORT[date.getDay()]}요일${y !== today.getFullYear() ? ` · ${y}년` : ""}`;
}

function timeOf(iso: string) {
  const [h, m] = (iso.split("T")[1] ?? "00:00").split(":").map(Number);
  return formatKoreanTime(h, m);
}

export default function ScanRecordPage() {
  const navigate = useNavigate();
  const openScanSheet = useScanSheet();
  const loggedIn = authStorage.isLoggedIn();
  const [records, setRecords] = useState<ScanSessionSummary[] | null>(null);
  const [drugs, setDrugs] = useState<Record<number, ScanDrugSummary[]>>({});
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!loggedIn) return;
    let cancelled = false;
    scanApi
      .list()
      .then((list) => {
        if (cancelled) return;
        const sorted = [...list].sort((a, b) => b.scannedAt.localeCompare(a.scannedAt));
        setRecords(sorted);
        setError(false);
        // 최근 기록의 약 이름·사진 (실패한 건 "약 N개"로만 보여줌)
        sorted.slice(0, DETAIL_LIMIT).forEach((item) => {
          scanApi
            .detail(item.sessionId)
            .then((detail) => {
              if (!cancelled) setDrugs((prev) => ({ ...prev, [item.sessionId]: detail.drugs }));
            })
            .catch(() => {});
        });
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [loggedIn, retry]);

  const today = koreaToday();
  const groups = (records ?? []).reduce<{ key: string; items: ScanSessionSummary[] }[]>((acc, item) => {
    const key = item.scannedAt.slice(0, 10);
    const last = acc[acc.length - 1];
    if (last?.key === key) last.items.push(item);
    else acc.push({ key, items: [item] });
    return acc;
  }, []);

  return (
    <MobileLayout>
      <PageHeader title="스캔 기록" />
      <div className="min-h-full bg-[#f4f5f9] px-4 pb-10 pt-4">
        {!loggedIn ? (
          <LoginRequired message="로그인하면 스캔한 약 기록을 모아 볼 수 있어요" />
        ) : error ? (
          <div className="mt-20 flex flex-col items-center text-center">
            <p className="text-sm text-slate-500">스캔 기록을 불러오지 못했어요</p>
            <button
              type="button"
              onClick={() => setRetry((n) => n + 1)}
              className="mt-4 rounded-full border border-primary bg-white px-6 py-2.5 text-sm font-bold text-primary"
            >
              다시 시도
            </button>
          </div>
        ) : records === null ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[84px] animate-pulse rounded-[20px] bg-white/70" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="mt-20 flex flex-col items-center">
            <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-white text-slate-300">
              <ScanLine size={26} />
            </span>
            <p className="mb-5 text-sm text-slate-500">약을 스캔하면 여기에 기록돼요</p>
            <button
              type="button"
              onClick={openScanSheet}
              className="flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
            >
              <ScanLine size={16} />
              약 스캔하기
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {groups.map((group) => (
              <section key={group.key}>
                <h2 className="mb-2 px-1 text-sm font-bold text-slate-500">{dayLabel(group.key, today)}</h2>
                <div className="space-y-2.5">
                  {group.items.map((item) => {
                    const list = drugs[item.sessionId];
                    const title = list?.length
                      ? `${list[0].name}${list.length > 1 ? ` 외 ${list.length - 1}개` : ""}`
                      : `약 ${item.drugCount}개`;
                    return (
                      <button
                        key={item.sessionId}
                        type="button"
                        onClick={() => navigate(scanSessionPath(item.sessionId))}
                        className="flex w-full items-center gap-3 rounded-[20px] bg-white p-3 text-left"
                      >
                        <span className="relative shrink-0">
                          {list?.length ? (
                            <>
                              <DrugThumb drug={list[0]} className="size-12 rounded-xl" />
                              {list.length > 1 && (
                                <span className="absolute -bottom-1 -right-1 rounded-full bg-slate-900/80 px-1.5 text-[10px] font-bold leading-4 text-white ring-2 ring-white">
                                  +{list.length - 1}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                              <ScanLine size={22} />
                            </span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-bold text-slate-900">{title}</span>
                          <span className="mt-0.5 block text-xs text-slate-500">
                            {timeOf(item.scannedAt)} · 약 {item.drugCount}개
                          </span>
                        </span>
                        <ChevronRight size={20} className="shrink-0 text-slate-400" />
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
