// src/layout/MobileLayout.tsx
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavigation from "../components/common/BottomNavigation";

interface MobileLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

// src/layout/MobileLayout.tsx

export default function MobileLayout({
  children,
  showBottomNav = true,
}: MobileLayoutProps) {
  const location = useLocation();

  return (
    // h-dvh: 실제로 보이는 화면 높이. 아이폰 사파리의 100vh(h-screen)는 툴바가 숨었을 때 기준이라
    // 하단바가 화면 아래로 밀려 잘림
    <div className="h-dvh bg-[#f7f8fb] flex justify-center">
      {/* min-h-screen → h-full, overflow-hidden 유지 */}
      <div className="relative w-full max-w-[420px] h-full bg-slate-50 shadow-sm flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            // flex-1 + overflow-y-auto 추가, pb-24 제거
            className="flex-1 overflow-y-auto"
          >
            {children}
          </motion.main>
        </AnimatePresence>
        {showBottomNav && <BottomNavigation />}
      </div>
    </div>
  );
}