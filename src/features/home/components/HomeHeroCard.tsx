import { Pill } from "lucide-react";

interface HomeHeroCardProps {
  message: string;
}

export default function HomeHeroCard({ message }: HomeHeroCardProps) {
  return (
    <div className="mx-4 -mt-3 rounded-[28px] bg-white px-5 py-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#8ec5ff]">
          <Pill size={28} className="text-[#3a8dde]" />
        </div>
        <p className="text-[18px] font-semibold text-slate-900">{message}</p>
      </div>
    </div>
  );
}