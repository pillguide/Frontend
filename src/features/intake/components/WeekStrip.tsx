// src/features/intake/components/WeekStrip.tsx
import ProgressRing from "../../../components/ui/ProgressRing";
import { WEEKDAY_SHORT, toDateKey } from "../utils/date";

export interface WeekDay {
  date: Date;
  total: number;
  taken: number;
  rate: number;
  isFuture: boolean;
}

interface WeekStripProps {
  days: WeekDay[];
  selected: Date;
  onSelect: (date: Date) => void;
}

export default function WeekStrip({ days, selected, onSelect }: WeekStripProps) {
  const selectedKey = toDateKey(selected);
  const todayKey = toDateKey(new Date());

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((d) => {
        const key = toDateKey(d.date);
        const isSelected = key === selectedKey;
        const isToday = key === todayKey;
        const done = d.total > 0 && d.taken === d.total;
        const dow = d.date.getDay();

        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(d.date)}
            aria-pressed={isSelected}
            aria-label={`${d.date.getMonth() + 1}월 ${d.date.getDate()}일, ${d.total}개 중 ${d.taken}개 복용`}
            className="flex flex-col items-center gap-1.5 py-1"
          >
            <span
              className={`text-xs font-medium ${
                isSelected ? "text-primary" : dow === 0 ? "text-red-400" : dow === 6 ? "text-sky-500" : "text-slate-500"
              }`}
            >
              {isToday ? "오늘" : WEEKDAY_SHORT[dow]}
            </span>
            <ProgressRing
              value={d.isFuture ? 0 : d.rate}
              size={40}
              stroke={4}
              trackClassName={isSelected ? "stroke-primary-100" : "stroke-slate-100"}
              barClassName={done ? "stroke-emerald-400" : "stroke-primary"}
            >
              <span
                className={`flex size-7 items-center justify-center rounded-full text-sm font-semibold transition ${
                  isSelected ? "bg-primary text-white" : d.isFuture ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {d.date.getDate()}
              </span>
            </ProgressRing>
            <span className={`size-1 rounded-full ${d.total > 0 && !d.isFuture ? (done ? "bg-emerald-400" : "bg-primary-200") : "bg-transparent"}`} />
          </button>
        );
      })}
    </div>
  );
}
