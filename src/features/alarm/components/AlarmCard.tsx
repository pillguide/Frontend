// src/features/alarm/components/AlarmCard.tsx
import { Check, ClockPlus } from "lucide-react";
import type { Alarm } from "../types/alarm";
import { formatAlarmTime, formatRepeatDays } from "../utils/alarmFormat";
import Toggle from "./Toggle";

interface AlarmCardProps {
  alarm: Alarm;
  editMode: boolean;
  selected: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onOpen: () => void;
}

export default function AlarmCard({ alarm, editMode, selected, onSelect, onToggle, onOpen }: AlarmCardProps) {
  const repeat = formatRepeatDays(alarm.repeatDays);

  return (
    <div className="flex items-center gap-3">
      {editMode && (
        <button
          type="button"
          onClick={onSelect}
          aria-label={`${alarm.medicineName} 선택`}
          aria-pressed={selected}
          className={`flex size-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            selected ? "border-primary bg-primary" : "border-slate-300 bg-white"
          }`}
        >
          {selected && <Check size={16} strokeWidth={3} className="text-white" />}
        </button>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={editMode ? onSelect : onOpen}
        onKeyDown={(e) => e.key === "Enter" && (editMode ? onSelect() : onOpen())}
        className="flex flex-1 cursor-pointer items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
      >
        <div className={alarm.enabled ? "" : "opacity-50"}>
          <p className="text-lg font-semibold text-slate-900">
            {alarm.medicineName}
            {alarm.dosage && <span className="ml-1 text-sm font-medium text-slate-500">{alarm.dosage}</span>}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
            <ClockPlus size={15} />
            {formatAlarmTime(alarm.hour, alarm.minute)}
            {repeat !== "안 함" && <span className="text-slate-400">· {repeat}</span>}
          </p>
        </div>
        <Toggle
          checked={alarm.enabled}
          onChange={onToggle}
          label={`${alarm.medicineName} 알람 켜기`}
          disabled={editMode}
        />
      </div>
    </div>
  );
}
