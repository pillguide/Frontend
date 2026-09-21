import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  rightSlot?: ReactNode;
}

export default function SectionCard({
  title,
  icon,
  children,
  onClick,
  rightSlot,
}: SectionCardProps) {
  return (
    <section
      onClick={onClick}
      className="rounded-[24px] bg-[#f8f8f8] p-5 shadow-sm cursor-pointer"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-[18px] font-semibold text-slate-900">{title}</h3>
        </div>
        {rightSlot}
      </div>

      <div>{children}</div>
    </section>
  );
}