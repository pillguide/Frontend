// src/features/home/pages/HomePage.tsx
import { ChevronRight, ScanLine } from "lucide-react";
import MobileLayout from "../../../layout/MobileLayout";
import HomeGreeting from "../components/HomeGreeting";
import TodayProgressCard from "../components/TodayProgressCard";
import NextMedicationCard from "../components/NextMedicationCard";
import MedicationChecklist from "../components/MedicationChecklist";
import { useHomeData } from "../hooks/useHomeData";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { data, isLoading } = useHomeData();
  const navigate = useNavigate();

  if (isLoading || !data) {
    return (
      <MobileLayout>
        <div className="p-6 text-slate-500">홈 데이터를 불러오는 중...</div>
      </MobileLayout>
    );
  }

  const completed = data.todayMedications.filter(m => m.taken).length;
  const total = data.todayMedications.length;

  return (
    <MobileLayout>
      <HomeGreeting userName={data.userName} />
      
      <div className="space-y-3 px-4 pb-6">
        <TodayProgressCard total={total} completed={completed} />
        <NextMedicationCard next={data.nextMedication} />
        <MedicationChecklist medications={data.todayMedications} />
        
        {/* 스캔 진입점 - 한 줄짜리로 단순화 */}
        <button
          onClick={() => navigate("/scan")}
          className="mt-3 flex w-full items-center gap-2.5 rounded-xl bg-white p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <ScanLine size={20} className="text-slate-700" />
          <span className="flex-1 text-left text-sm font-medium text-slate-900">
            약 스캔하기
          </span>
          <ChevronRight size={18} className="text-slate-400" />
        </button>
      </div>
    </MobileLayout>
  );
}