// src/features/medicine/pages/ScanRecordPage.tsx
import { ChevronRight, ScanLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import { scanRecordMock } from "../mock/medicine.mock";
import PageHeader from "../../../components/common/PageHeader";

export default function ScanRecordPage() {
  const navigate = useNavigate();
  const records = scanRecordMock;
  const hasRecords = records.length > 0;

  return (
    <MobileLayout>
      <PageHeader title="스캔기록" />

      <div className="min-h-screen bg-slate-50 px-5 pt-6 pb-24">
        {/* Section label */}
        <p className="mb-3 text-xs text-slate-500">최근 스캔한 약 조합</p>

        {/* Records list */}
        {hasRecords && (
          <div className="space-y-3">
            {records.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(`/medicine/${item.id}`)}
                className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.scannedAt}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
              </button>
            ))}
          </div>
        )}

        {/* Empty state / CTA */}
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <ScanLine size={24} className="text-slate-400" />
          </div>
          <p className="mb-5 text-sm text-slate-500">
            약을 스캔하면 여기에 기록돼요
          </p>
          <button
            onClick={() => navigate("/scan")}
            className="rounded-full border border-[#534AB7] bg-white px-6 py-2.5 text-sm font-medium text-[#534AB7] transition-colors hover:bg-[#534AB7] hover:text-white"
          >
            약 스캔하기
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}