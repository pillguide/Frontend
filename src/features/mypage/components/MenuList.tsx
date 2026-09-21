import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { MyPageMenuItem } from "../types/mypage";

interface MenuListProps {
  menus: MyPageMenuItem[];
}

export default function MenuList({ menus }: MenuListProps) {
  const navigate = useNavigate();

  return (
    <div className="divide-y divide-slate-100 rounded-[20px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {menus.map((menu) => (
        <button
          key={menu.id}
          onClick={() => navigate(menu.path)}
          className="flex w-full items-center justify-between px-4 py-5 text-left"
        >
          <span className="text-base text-slate-900">{menu.label}</span>
          <ChevronRight size={20} className="text-slate-400" />
        </button>
      ))}
    </div>
  );
}