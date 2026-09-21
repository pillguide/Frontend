// src/features/search/pages/SearchPage.tsx
import { useMemo, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, Clock, Search, SearchX, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import { ROUTES } from "../../../constants/routes";
import { medicineCatalog, type MedicineSearchItem } from "../../medicine/mock/medicine.mock";
import { recentSearchStorage, searchMedicines } from "../utils/searchMedicine";
import HighlightText from "../components/HighlightText";

const POPULAR_IDS = [14, 12, 11, 16, 13];

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>(() => recentSearchStorage.get());

  const results = useMemo(() => searchMedicines(query), [query]);
  const popular = POPULAR_IDS.map((id) => medicineCatalog.find((m) => m.id === id)).filter(
    (m): m is MedicineSearchItem => !!m,
  );
  const hasQuery = query.trim().length > 0;

  const updateRecent = (next: string[]) => {
    setRecent(next);
    recentSearchStorage.set(next);
  };

  const saveRecent = (term: string) => {
    const t = term.trim();
    if (t) updateRecent([t, ...recent.filter((r) => r !== t)]);
  };

  const openMedicine = (item: MedicineSearchItem) => {
    saveRecent(hasQuery ? query : item.name);
    navigate(`/medicine/single/${item.id}`);
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
            placeholder="약 이름이나 성분으로 검색"
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

            {/* 많이 찾는 약 */}
            <section>
              <h2 className="mb-3 text-base font-bold text-slate-900">많이 찾는 약</h2>
              <ol className="divide-y divide-slate-100 rounded-[20px] bg-white shadow-card">
                {popular.map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => openMedicine(item)}
                      className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                    >
                      <span className={`w-5 text-center text-base font-bold ${i < 3 ? "text-primary" : "text-slate-400"}`}>
                        {i + 1}
                      </span>
                      <span className="flex-1 truncate text-base text-slate-900">{item.name}</span>
                      <span className="text-xs text-slate-400">{item.category}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>

            <ScanBanner onClick={() => navigate(ROUTES.SCAN)} />
          </div>
        )}

        {hasQuery && results.length > 0 && (
          <section>
            <p className="mb-3 px-1 text-sm text-slate-500">
              검색 결과 <b className="text-primary">{results.length}</b>개
            </p>
            <div className="space-y-2.5">
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openMedicine(item)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-card transition hover:shadow-card-hover"
                >
                  <span className="flex size-14 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50">
                    <img src={item.imageUrl} alt="" className="size-11 object-contain" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-semibold text-slate-900">
                      <HighlightText text={item.name} query={query} />
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-xs">
                      <span className="rounded-full bg-primary-50 px-2 py-0.5 font-medium text-primary">{item.category}</span>
                      <span className="truncate text-slate-400">{item.ingredient}</span>
                    </span>
                  </span>
                  <ChevronRight size={20} className="flex-shrink-0 text-slate-300" />
                </button>
              ))}
            </div>
          </section>
        )}

        {hasQuery && results.length === 0 && (
          <div className="flex flex-col items-center pt-16 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white shadow-card">
              <SearchX size={28} className="text-slate-400" />
            </div>
            <p className="text-base font-semibold text-slate-700">‘{query.trim()}’ 검색 결과가 없어요</p>
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
