// src/features/home/components/MedicationChecklist.tsx
import { Check, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { ScheduledDose } from "../../intake/utils/schedule";
import { formatKoreanTime, timeOfDayLabel } from "../../intake/utils/date";

interface MedicationChecklistProps {
  doses: ScheduledDose[];
  onToggle: (alarmId: number) => void;
  onOpen: (alarmId: number) => void;
  onManage: () => void;
  onAdd: () => void;
}

export default function MedicationChecklist({ doses, onToggle, onOpen, onManage, onAdd }: MedicationChecklistProps) {
  // 아침/점심/저녁/자기 전 묶음
  const groups = doses.reduce<{ label: string; items: ScheduledDose[] }[]>((acc, dose) => {
    const label = timeOfDayLabel(dose.alarm.hour);
    const last = acc[acc.length - 1];
    if (last?.label === label) last.items.push(dose);
    else acc.push({ label, items: [dose] });
    return acc;
  }, []);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-slate-900">복약 체크리스트</h2>
        <button type="button" onClick={onManage} className="flex items-center text-sm font-medium text-slate-500">
          알람 관리 <ChevronRight size={16} />
        </button>
      </div>

      {doses.length === 0 ? (
        <div className="rounded-[24px] bg-white px-6 py-8 text-center shadow-card">
          <p className="font-semibold text-slate-700">오늘 예정된 약이 없어요</p>
          <p className="mt-1 text-sm text-slate-500">복약 알람을 추가하면 여기에서 체크할 수 있어요</p>
          <button
            type="button"
            onClick={onAdd}
            className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            알람 추가하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{group.label}</p>
              <div className="overflow-hidden rounded-[24px] bg-white shadow-card">
                {group.items.map(({ alarm, taken }, i) => (
                  <div
                    key={alarm.id}
                    className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-slate-100" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => onToggle(alarm.id)}
                      aria-pressed={taken}
                      aria-label={`${alarm.medicineName} ${taken ? "복용 취소" : "복용 완료"}`}
                      className={`flex size-11 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        taken ? "border-primary bg-primary" : "border-slate-200 bg-white hover:border-primary-200"
                      }`}
                    >
                      <AnimatePresence initial={false}>
                        {taken && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 22 }}
                          >
                            <Check size={22} strokeWidth={3} className="text-white" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>

                    <button type="button" onClick={() => onOpen(alarm.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-base font-semibold transition-colors ${
                            taken ? "text-slate-400 line-through decoration-slate-300" : "text-slate-900"
                          }`}
                        >
                          {alarm.medicineName}
                          {alarm.dosage && <span className="ml-1 text-sm font-medium no-underline">{alarm.dosage}</span>}
                        </span>
                        <span className="mt-0.5 block text-sm text-slate-500">
                          {formatKoreanTime(alarm.hour, alarm.minute)} · {taken ? "복용 완료" : "예정"}
                          {alarm.memo && ` · ${alarm.memo}`}
                        </span>
                      </span>
                      <ChevronRight size={18} className="flex-shrink-0 text-slate-300" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
