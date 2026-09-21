// src/features/mypage/pages/MyPage.tsx
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import { ROUTES } from "../../../constants/routes";
import { authStorage } from "../../../utils/authStorage";
import { useUser } from "../../user/context/UserContext";
import { myPageMockData } from "../mock/mypage.mock";
import QuickActionButtons from "../components/QuickActionButtons";
import MenuList from "../components/MenuList";
import WeeklySummaryCard from "../components/WeeklySummaryCard";

export default function MyPage() {
  const data = myPageMockData;
  const navigate = useNavigate();
  const { profile } = useUser();

  const handleLogout = () => {
    authStorage.clear();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <MobileLayout>
      <div className="bg-gradient-to-b from-primary-50/70 to-transparent px-5 pb-5 pt-8">
        <div className="flex items-center gap-4">
          <div className="flex size-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-400 text-2xl font-bold text-white shadow-card">
            {profile.name.slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-bold text-slate-900">{profile.name}님</h1>
            <p className="text-sm text-slate-500">오늘도 건강하세요!</p>
          </div>
          <button
            type="button"
            onClick={() => navigate(ROUTES.PROFILE)}
            className="flex flex-shrink-0 items-center gap-0.5 rounded-full bg-white px-3 py-1.5 text-sm text-slate-600 shadow-card"
          >
            정보수정 <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-5 px-5 pb-8">
        <WeeklySummaryCard onClick={() => navigate(ROUTES.CHECK_RECORD)} />
        <QuickActionButtons actions={data.quickActions} />
        <MenuList menus={data.menus} />

        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-red-200 px-12 py-2.5 text-sm font-medium text-red-400 hover:bg-red-50"
          >
            로그아웃
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
