// src/features/mypage/components/QuickActionButtons.tsx
import { Bell, FileText, ScanLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { QuickAction } from "../types/mypage";

interface QuickActionButtonsProps {
  actions: QuickAction[];
}

const iconMap = [Bell, FileText, ScanLine];

export default function QuickActionButtons({ actions }: QuickActionButtonsProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action, index) => {
        const Icon = iconMap[index] ?? Bell;
        const isPrimary = action.variant === "primary";

        return (
          <button
            key={action.id}
            onClick={() => navigate(action.path)}
            className={`flex flex-col items-center justify-center rounded-2xl p-4 ${
              isPrimary 
                ? "bg-[#534AB7]" 
                : "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            }`}
          >
            {/* 아이콘 컨테이너 부분도 살짝 손봐야 자연스러움 */}
            <div
              className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                isPrimary ? "bg-white/20" : "bg-slate-100"
              }`}
            >
              <Icon
                size={20}
                className={isPrimary ? "text-white" : "text-slate-600"}
              />
            </div>
            <span
              className={`text-center text-xs font-medium leading-tight ${
                isPrimary ? "text-white" : "text-slate-700"
              }`}
            >
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}