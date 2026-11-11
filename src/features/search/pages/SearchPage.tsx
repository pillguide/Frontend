// src/features/search/pages/SearchPage.tsx
import { useEffect, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, Clock, Pill, Search, SearchX, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import { ROUTES, singleMedicinePath } from "../../../constants/routes";
import { drugApi, type DrugSearchItem } from "../../medicine/api/drugApi";
import { recentSearchStorage } from "../utils/searchMedicine";
import HighlightText from "../components/HighlightText";

const PAGE_SIZE = 20;
const DEBOUNCE_MS = 300;

interface SearchState {
  keyword: string; // 이 결과가 어떤 검색어의 결과인지
  items: DrugSearchItem[];
  total: number;
  page: number;
  hasNext: boolean;
  error?: string;
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>(() => recentSearchStorage.get());
  const [result, setResult] = useState<SearchState | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const keyword = query.trim();
  const hasQuery = keyword.length > 0;


  // 입력이 멈추면 서버 검색
  useEffect(() => {
    if (!keyword) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      drugApi
        .search(keyword, 0, PAGE_SIZE)
        .then((res) => {
          if (!cancelled)
            setResult({ keyword, items: res.items, total: res.totalElements, page: res.page, hasNext: res.hasNext });
        })
        .catch((e: unknown) => {
          if (!cancelled)
            setResult({ keyword, items: [], total: 0, page: 0, hasNext: false, error: e instanceof Error ? e.message : "검색하지 못했어요" });
        });
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [keyword]);

  const current = result && result.keyword === keyword ? result : null; // null이면 검색 중
  const results = current?.items ?? [];

  const loadMore = async () => {
    if (!current?.hasNext || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await drugApi.search(current.keyword, current.page + 1, PAGE_SIZE);
      setResult((prev) =>
        prev && prev.keyword === current.keyword
          ? { ...prev, items: [...prev.items, ...res.items], page: res.page, hasNext: res.hasNext, total: res.totalElements }
          : prev,
      );
    } catch {
      // 다음 페이지 실패는 버튼으로 다시 시도
    } finally {
      setLoadingMore(false);
    }
  };

  const updateRecent = (next: string[]) => {
    setRecent(next);
    recentSearchStorage.set(next);
  };

  const saveRecent = (term: string) => {
    const t = term.trim();
    if (t) updateRecent([t, ...recent.filter((r) => r !== t)]);
  };

  const openMedicine = (item: DrugSearchItem) => {
    saveRecent(query);
    navigate(singleMedicinePath(item.drugId));
  };

  return (
    <MobileLayout>
      {/* 검색 바 */}
      <div className="sticky top-0 z-10 flex items-center gap-2 bg-white px-3 py-3 shadow-[0_1px_0_rgba(15,23,42,0.06)]">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로 가기" className="p-2">
          <ChevronLeft size={24} />
        </button>
        <label className="flex h-11 flex-1 items-center gap-2 rounded-full bg-slate-100 px-4 focus-within:ring-2 focus-within:ring-primary-200">
          <Search size={18} className="flex-shrink-0 text-slate-400" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveRecent(query);
            }}
            placeholder="약 이름으로 검색"
            enterKeyHint="search"
            className="min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="검색어 지우기"
              className="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-300 text-white"
            >
              <X size={14} strokeWidth={3} />
            </button>
          )}
        </label>
      </div>

      <div className="px-5 pb-8 pt-5">
        {!hasQuery && (
          <div className="space-y-7">
            {/* 최근 검색어 */}
            {recent.length > 0 && (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">최근 검색어</h2>
                  <button type="button" onClick={() => updateRecent([])} className="text-sm text-slate-400">
                    전체 삭제
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.map((term) => (
                    <span
                      key={term}
                      className="inline-flex items-center gap-1 rounded-full bg-white py-1.5 pl-3 pr-1.5 text-sm text-slate-700 shadow-card"
                    >
                      <button type="button" onClick={() => setQuery(term)} className="inline-flex items-center gap-1">
                        <Clock size={13} className="text-slate-400" />
                        {term}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateRecent(recent.filter((r) => r !== term))}
                        aria-label={`${term} 삭제`}
                        className="flex size-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </section>
            )}

            <ScanBanner onClick={() => navigate(ROUTES.SCAN)} />
          </div>
        )}

        {hasQuery && !current && (
          <div className="space-y-2.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/70" />
            ))}
          </div>
        )}

        {hasQuery && current?.error && (
          <p className="pt-16 text-center text-sm text-slate-500">검색하지 못했어요. 잠시 후 다시 시도해 주세요</p>
        )}

        {hasQuery && current && !current.error && results.length > 0 && (
          <section>
            <p className="mb-3 px-1 text-sm text-slate-500">
              검색 결과 <b className="text-primary">{current.total}</b>개
            </p>
            <div className="space-y-2.5">
              {results.map((item) => (
                <button
                  key={item.drugId}
                  type="button"
                  onClick={() => openMedicine(item)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-card transition hover:shadow-card-hover"
                >
                  <span className="flex size-14 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" className="size-11 object-contain" />
                    ) : (
                      <Pill size={22} className="text-slate-300" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold leading-snug text-slate-900">
                      <HighlightText text={item.name} query={query} />
                    </span>
                  </span>
                  <ChevronRight size={20} className="flex-shrink-0 text-slate-300" />
                </button>
              ))}
            </div>
            {current.hasNext && (
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="mt-4 w-full rounded-2xl bg-white py-3 text-sm font-medium text-primary shadow-card disabled:text-slate-400"
              >
                {loadingMore ? "불러오는 중..." : "결과 더 보기"}
              </button>
            )}
          </section>
        )}

        {hasQuery && current && !current.error && results.length === 0 && (
          <div className="flex flex-col items-center pt-16 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white shadow-card">
              <SearchX size={28} className="text-slate-400" />
            </div>
            <p className="text-base font-semibold text-slate-700">‘{keyword}’ 검색 결과가 없어요</p>
            <p className="mt-1 text-sm text-slate-500">약 이름을 다시 확인하거나 사진으로 찾아보세요</p>
            <div className="mt-6 w-full">
              <ScanBanner onClick={() => navigate(ROUTES.SCAN)} />
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

function ScanBanner({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[20px] bg-primary-50 p-4 text-left"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-primary text-white">
        <Camera size={20} />
      </span>
      <span className="flex-1">
        <span className="block text-base font-semibold text-primary-800">이름을 모르겠다면?</span>
        <span className="block text-sm text-primary-600">알약 사진을 찍어서 찾아보세요</span>
      </span>
      <ChevronRight size={20} className="text-primary-300" />
    </button>
  );
}
