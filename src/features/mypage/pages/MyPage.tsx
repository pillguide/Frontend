// src/features/mypage/pages/MyPage.tsx
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MobileLayout from "../../../layout/MobileLayout";
import { ROUTES } from "../../../constants/routes";
import { authStorage } from "../../../utils/authStorage";
import { scanDraft } from "../../medicine/scanDraft";
import { logout } from "../../auth/api/authApi";
import { useUser } from "../../user/context/UserContext";
import { myPageMockData } from "../mock/mypage.mock";
import QuickActionButtons from "../components/QuickActionButtons";
import MenuList from "../components/MenuList";
import WeeklySummaryCard from "../components/WeeklySummaryCard";

export default function MyPage() {
  const data = myPageMockData;
  const navigate = useNavigate();
  const { profile, loading, error } = useUser();
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [logoutError, setLogoutError] = useState(false);

  const handleLogout = async () => {
    if (logoutBusy) return;
    setLogoutBusy(true);
    setLogoutError(false);
    try {
      await logout();
      scanDraft.clear();
      authStorage.clear();
      navigate(ROUTES.LOGIN, { replace: true });
    } catch {
      setLogoutError(true);
    } finally {
      setLogoutBusy(false);
    }
  };

  return (
    <MobileLayout>
      <div className="bg-gradient-to-b from-primary-50/70 to-transparent px-5 pb-5 pt-8">
        <div className="flex items-center gap-4">
          <div className="flex size-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-400 text-2xl font-bold text-white shadow-card">
            {profile.name.slice(0, 1) || "•"}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-bold text-slate-900">
              {loading ? "불러오는 중..." : error ? "정보를 불러오지 못했어요" : profile.name ? `${profile.name}님` : "내 정보"}
            </h1>
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
        <MenuList
          menus={[
            { id: 0, label: "내 약", path: ROUTES.MY_DRUGS },
            ...data.menus,
          ]}
        />

        <div className="flex flex-col items-center gap-2 pt-2">
          {logoutError && (
            <p role="alert" className="text-sm text-red-500">
              로그아웃에 실패했어요. 다시 시도해 주세요.
            </p>
          )}
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutBusy}
            className="rounded-full border border-red-200 px-12 py-2.5 text-sm font-medium text-red-400 hover:bg-red-50"
          >
            {logoutBusy ? "로그아웃 중..." : "로그아웃"}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
