// src/features/home/components/NextDoseCard.tsx
import { AlarmClock, ChevronRight, PartyPopper, TriangleAlert } from "lucide-react";
import type { ScheduledDose } from "../../intake/utils/schedule";
import { formatKoreanTime } from "../../intake/utils/date";

interface NextDoseCardProps {
  doses: ScheduledDose[];
  now: Date;
  onOpen: (alarmId: number) => void;
}

function remaining(minutes: number) {
  if (minutes < 1) return "지금";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h > 0 ? `${h}시간 ` : ""}${m > 0 ? `${m}분 ` : ""}후`;
}

export default function NextDoseCard({ doses, now, onOpen }: NextDoseCardProps) {
  if (doses.length === 0) return null;

  const nowMin = now.getHours() * 60 + now.getMinutes();
  const pending = doses.filter((d) => !d.taken);
  const missed = pending.filter((d) => d.alarm.hour * 60 + d.alarm.minute < nowMin);
  const next = pending.find((d) => d.alarm.hour * 60 + d.alarm.minute >= nowMin);

  if (pending.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-[20px] bg-emerald-50 p-4">
        <span className="flex size-11 items-center justify-center rounded-full bg-white text-emerald-500">
          <PartyPopper size={22} />
        </span>
        <div>
          <p className="text-sm text-emerald-600">오늘 복약 완료</p>
          <p className="text-base font-semibold text-emerald-800">내일도 잊지 말고 챙겨요</p>
        </div>
      </div>
    );
  }

  const target = next ?? missed[missed.length - 1];
  const isMissed = !next;
  const diff = target.alarm.hour * 60 + target.alarm.minute - nowMin;

  return (
    <button
      type="button"
      onClick={() => onOpen(target.alarm.id)}
      className={`flex w-full items-center gap-3 rounded-[20px] p-4 text-left ${isMissed ? "bg-amber-50" : "bg-info-50"}`}
    >
      <span
        className={`flex size-11 flex-shrink-0 items-center justify-center rounded-full bg-white ${
          isMissed ? "text-amber-500" : "text-info-800"
        }`}
      >
        {isMissed ? <TriangleAlert size={22} /> : <AlarmClock size={22} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm ${isMissed ? "text-amber-600" : "text-info-800/80"}`}>
          {isMissed ? "아직 안 드신 약이 있어요" : `다음 복약 · ${remaining(diff)}`}
        </p>
        <p className={`truncate text-base font-semibold ${isMissed ? "text-amber-800" : "text-info-800"}`}>
          {formatKoreanTime(target.alarm.hour, target.alarm.minute)} · {target.alarm.medicineName}
        </p>
      </div>
      {missed.length > 0 && next && (
        <span className="flex-shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
          놓친 약 {missed.length}
        </span>
      )}
      <ChevronRight size={18} className="flex-shrink-0 text-slate-400" />
    </button>
  );
}
