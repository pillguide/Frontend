// src/features/home/components/TodayProgressCard.tsx
interface TodayProgressCardProps {
  total: number;
  completed: number;
}

export default function TodayProgressCard({ total, completed }: TodayProgressCardProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  return (
    <div className="rounded-2xl bg-[#EEEDFE] p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-[#534AB7]">오늘의 복약</p>
          <p className="text-base font-semibold text-[#26215C] mt-0.5">
            {total}개 중 {completed}개 완료
          </p>
        </div>
        <div className="h-12 w-12 rounded-full bg-[#534AB7]" />
        {/* 캐릭터 이미지 자리 — 나중에 실제 이미지로 교체 */}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#CECBF6]">
        <div
          className="h-full bg-[#534AB7] transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}