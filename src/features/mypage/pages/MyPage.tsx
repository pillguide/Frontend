import MobileLayout from "../../../layout/MobileLayout";
import { myPageMockData } from "../mock/mypage.mock";
import QuickActionButtons from "../components/QuickActionButtons";
import MenuList from "../components/MenuList";
import { ChevronRight } from "lucide-react";

export default function MyPage() {
  const data = myPageMockData;

  return (
    <MobileLayout>
      <div className="px-5 pt-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900">
              {data.userName}님
            </h1>
            <p className="mt-1 text-slate-600">오늘도 건강하세요!</p>
          </div>

          <button className="flex items-center gap-1 text-sm text-slate-500">
            정보수정 <ChevronRight size={16} />
          </button>
        </div>

        <div className="mb-8">
          <QuickActionButtons actions={data.quickActions} />
        </div>

        <div className="space-y-5">
          <MenuList menus={data.menus} />

          <button className="w-full rounded-full border border-red-400 py-3 text-sm font-medium text-red-500">
            로그아웃
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}