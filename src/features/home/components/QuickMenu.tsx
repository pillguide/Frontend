// src/features/home/components/QuickMenu.tsx
import { BellRing, CalendarCheck, ScanLine, Search, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

const items: { label: string; to: string; icon: LucideIcon; className: string }[] = [
  { label: "약 스캔", to: ROUTES.SCAN, icon: ScanLine, className: "bg-primary-50 text-primary" },
  { label: "약 검색", to: ROUTES.SEARCH, icon: Search, className: "bg-info-50 text-info-800" },
  { label: "복약 기록", to: ROUTES.CHECK_RECORD, icon: CalendarCheck, className: "bg-emerald-50 text-emerald-600" },
  { label: "알람 설정", to: ROUTES.ALARM, icon: BellRing, className: "bg-amber-50 text-amber-600" },
];

export default function QuickMenu() {
  const navigate = useNavigate();

  return (
    <nav aria-label="바로가기" className="grid grid-cols-4 gap-2 rounded-[24px] bg-white p-3 shadow-card">
      {items.map(({ label, to, icon: Icon, className }) => (
        <button
          key={label}
          type="button"
          onClick={() => navigate(to)}
          className="flex flex-col items-center gap-1.5 rounded-2xl py-2 transition active:scale-95"
        >
          <span className={`flex size-12 items-center justify-center rounded-2xl ${className}`}>
            <Icon size={24} />
          </span>
          <span className="text-xs font-medium text-slate-700">{label}</span>
        </button>
      ))}
    </nav>
  );
}
