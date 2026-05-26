import { ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import { scanRecordMock } from "../mock/medicine.mock";

export default function ScanRecordPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="px-5 pt-6">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">스캔기록</h1>
        </div>

        <div className="space-y-3">
          {scanRecordMock.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/medicine/${item.id}`)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <span className="font-medium text-slate-900">{item.title}</span>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}