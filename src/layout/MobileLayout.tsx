import type { ReactNode } from "react";
import BottomNavigation from "../components/common/BottomNavigation";

interface MobileLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

export default function MobileLayout({
  children,
  showBottomNav = true,
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f8fb] flex justify-center">
      <div className="relative w-full max-w-[420px] min-h-screen bg-slate-50 shadow-sm">
        <main className={showBottomNav ? "pb-24" : ""}>{children}</main>
        {showBottomNav && <BottomNavigation />}
      </div>
    </div>
  );
}