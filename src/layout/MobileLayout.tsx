// src/layout/MobileLayout.tsx
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavigation from "../components/common/BottomNavigation";

interface MobileLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

export default function MobileLayout({
  children,
  showBottomNav = true,
}: MobileLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f7f8fb] flex justify-center">
      <div className="relative w-full max-w-[420px] min-h-screen bg-slate-50 shadow-sm overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={showBottomNav ? "pb-24" : ""}
          >
            {children}
          </motion.main>
        </AnimatePresence>
        {showBottomNav && <BottomNavigation />}
      </div>
    </div>
  );
}