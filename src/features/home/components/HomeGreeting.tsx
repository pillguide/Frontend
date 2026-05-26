import { Search } from "lucide-react";

interface HomeGreetingProps {
  userName: string;
}

export default function HomeGreeting({ userName }: HomeGreetingProps) {
  return (
    <header className="flex items-start justify-between bg-[#BFDAF7] px-5 pb-5 pt-8">
      <div className="text-slate-900">
        <p className="text-[18px] font-medium leading-7">안녕하세요</p>
        <h1 className="text-[30px] font-bold leading-9">{userName}님!</h1>
      </div>
      <button className="mt-1 text-slate-900">
        <Search size={28} />
      </button>
    </header>
  );
}