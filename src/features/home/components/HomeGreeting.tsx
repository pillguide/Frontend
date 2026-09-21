// src/features/home/components/HomeGreeting.tsx
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { WEEKDAY_SHORT, formatMonthDay } from "../../intake/utils/date";

interface HomeGreetingProps {
  userName: string;
  now: Date;
}

function greeting(hour: number) {
  if (hour < 6) return "편안한 밤 보내세요";
  if (hour < 12) return "좋은 아침이에요";
  if (hour < 18) return "좋은 오후예요";
  return "오늘 하루도 수고했어요";
}

export default function HomeGreeting({ userName, now }: HomeGreetingProps) {
  const navigate = useNavigate();

  return (
    <header className="flex items-start justify-between px-5 pb-5 pt-7">
      <div>
        <p className="text-sm font-medium text-primary">
          {formatMonthDay(now)} {WEEKDAY_SHORT[now.getDay()]}요일
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-snug text-slate-900">
          {greeting(now.getHours())},
          <br />
          {userName}님
        </h1>
      </div>
      <button
        type="button"
        onClick={() => navigate(ROUTES.SEARCH)}
        aria-label="약 검색"
        className="flex size-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-card"
      >
        <Search size={22} />
      </button>
    </header>
  );
}
