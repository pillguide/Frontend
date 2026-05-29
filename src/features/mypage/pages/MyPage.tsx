// src/features/mypage/pages/MyPage.tsx
import { ChevronRight } from "lucide-react";
import MobileLayout from "../../../layout/MobileLayout";
import { myPageMockData } from "../mock/mypage.mock";
import QuickActionButtons from "../components/QuickActionButtons";
import MenuList from "../components/MenuList";

export default function MyPage() {
  const data = myPageMockData;

  return (
    <MobileLayout>
      {/* Header with border-bottom */}
      <div className="border-b border-slate-100 px-5 pb-5 pt-8">
        <div className="mb-2 flex items-start justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            {data.userName}님
          </h1>
          <button className="flex items-center gap-1 text-sm text-slate-500">
            정보수정 <ChevronRight size={16} />
          </button>
        </div>
        <p className="text-sm text-slate-500">오늘도 건강하세요!</p>
      </div>

      <div className="px-5 pt-6">
        <div className="mb-6">
          <QuickActionButtons actions={data.quickActions} />
        </div>

        <MenuList menus={data.menus} />

        {/* Logout button - centered, narrower */}
        <div className="mt-8 flex justify-center">
          <button className="rounded-full border border-red-300 px-12 py-2.5 text-sm font-medium text-red-400 hover:bg-red-50">
            로그아웃
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}