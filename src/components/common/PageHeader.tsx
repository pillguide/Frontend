// src/components/common/PageHeader.tsx
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
}

export default function PageHeader({
  title,
  showBack = true,
  onBack,
  rightAction,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <header className="sticky top-0 z-10 flex items-center justify-center border-b border-slate-100 bg-white px-4 py-4">
      {showBack && (
        <button
          onClick={handleBack}
          className="absolute left-3 p-2"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      <h1 className="text-base font-bold text-slate-900">{title}</h1>
      {rightAction && <div className="absolute right-3">{rightAction}</div>}
    </header>
  );
}