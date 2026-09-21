// src/features/home/components/HomeGreeting.tsx
import { Search } from "lucide-react";

interface HomeGreetingProps {
  userName: string;
}

export default function HomeGreeting({ userName }: HomeGreetingProps) {
  return (
    <header className="flex items-start justify-between px-5 pt-6 pb-4">
      <div>
        <p className="text-sm text-slate-400">안녕하세요</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{userName}님</h1>
      </div>
      <button className="p-2 text-slate-700">
        <Search size={24} />
      </button>
    </header>
  );
}