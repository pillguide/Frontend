import { Bell, Check, ScanSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { QuickAction } from "../types/mypage";

interface QuickActionButtonsProps {
  actions: QuickAction[];
}

const iconMap = [Bell, Check, ScanSearch];

export default function QuickActionButtons({
  actions,
}: QuickActionButtonsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center gap-6">
      {actions.map((action, index) => {
        const Icon = iconMap[index] ?? Bell;

        return (
          <button
            key={action.id}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#BFDAF7] text-slate-900">
              <Icon size={22} />
            </div>
            <span className="text-xs text-slate-700">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}