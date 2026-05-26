import { ScanSearch } from "lucide-react";
import SectionCard from "../../../components/common/SectionCard";
import type { ScanPreview } from "../types/home";
import { useNavigate } from "react-router-dom";

interface ScanPreviewCardProps {
  scan: ScanPreview | null;
}

export default function ScanPreviewCard({ scan }: ScanPreviewCardProps) {
  const navigate = useNavigate();

  return (
    <SectionCard
      title="스캔 기록"
      icon={<ScanSearch size={20} className="text-slate-700" />}
      onClick={() => navigate("/scan-record")}
      rightSlot={<span className="text-sm text-slate-400">더보기</span>}
    >
      {!scan ? (
        <p className="text-sm text-slate-400">최근 스캔 기록이 없어요.</p>
      ) : (
        <div className="flex items-center gap-4 rounded-2xl bg-white p-3">
          <img
            src={scan.imageUrl}
            alt={scan.title}
            className="h-16 w-16 rounded-2xl object-cover"
          />
          <div>
            <p className="font-semibold text-slate-900">{scan.title}</p>
            <p className="text-sm text-slate-500">최근 스캔한 약 정보예요.</p>
          </div>
        </div>
      )}
    </SectionCard>
  );
}