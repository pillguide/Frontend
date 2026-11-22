// src/components/layout/BottomNavigation.tsx (경로는 본인 프로젝트 구조에 맞게)
import { Home, Camera, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useScanSheet } from "../../features/medicine/context/scanSheet";

const navItems = [
  { to: ROUTES.HOME, label: "홈", icon: Home },
  { to: ROUTES.SCAN, label: "스캔", icon: Camera, center: true },
  { to: ROUTES.MY_PAGE, label: "마이", icon: User },
];

export default function BottomNavigation() {
  const openScanSheet = useScanSheet();
  return (
    // 아이폰 홈 바(화면 아래 가로줄) 영역만큼 아래 여백
<nav className="flex-shrink-0 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-16 items-center justify-around px-4">
        {navItems.map(({ to, icon: Icon, center, label }) =>
          center ? (
            // 카메라 버튼: 페이지 이동 대신 지금 화면 위에 사진 가져오기 시트
            <button
              key={to}
              type="button"
              onClick={openScanSheet}
              className="flex flex-1 items-center justify-center"
              aria-label={label}
            >
              <div className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#534AB7] shadow-lg">
                <Icon size={24} className="text-white" />
              </div>
            </button>
          ) : (
          <NavLink
            key={to}
            to={to}
            className="flex flex-1 items-center justify-center"
            aria-label={label}
          >
            {({ isActive }) => (
              <Icon
                size={24}
                className={isActive ? "text-[#534AB7]" : "text-slate-400"}
                fill={isActive ? "#534AB7" : "none"}
              />
            )}
          </NavLink>
          ),
        )}
      </div>
    </nav>
  );
}