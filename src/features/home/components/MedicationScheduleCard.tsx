import { ClipboardCheck } from "lucide-react";
import SectionCard from "../../../components/common/SectionCard";
import type { TodayMedication } from "../types/home";

interface MedicationScheduleCardProps {
  medications: TodayMedication[];
}

export default function MedicationScheduleCard({
  medications,
}: MedicationScheduleCardProps) {
  return (
    <SectionCard
      title="오늘의 복약"
      icon={<ClipboardCheck size={20} className="text-slate-700" />}
    >
      <div className="space-y-3">
        {medications.length === 0 ? (
          <p className="text-sm text-slate-400">오늘 등록된 복약 일정이 없어요.</p>
        ) : (
          medications.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-900">{item.medicineName}</p>
                <p className="text-sm text-slate-500">{item.time}</p>
              </div>
              <div
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  item.taken
                    ? "bg-[#EAF7EE] text-[#248a3d]"
                    : "bg-[#FFF4E5] text-[#b57400]"
                }`}
              >
                {item.taken ? "복약 완료" : "복약 전"}
              </div>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
}