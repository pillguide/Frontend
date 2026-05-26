import { House, Camera, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const navItems = [
  { to: ROUTES.HOME, label: "홈", icon: House },
  { to: ROUTES.SCAN_RECORD, label: "스캔", icon: Camera, center: true },
  { to: ROUTES.MY_PAGE, label: "마이", icon: User },
];

export default function BottomNavigation() {
  return (
    <nav className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-6 py-3">
      <div className="flex items-end justify-between">
        {navItems.map(({ to, icon: Icon, center }) => (
          <NavLink key={to} to={to} className="flex flex-1 justify-center">
            {({ isActive }) =>
              center ? (
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full transition ${
                    isActive
                      ? "bg-[#BFDAF7] text-slate-900"
                      : "bg-[#EAF3FD] text-slate-500"
                  }`}
                >
                  <Icon size={30} strokeWidth={2.2} />
                </div>
              ) : (
                <div
                  className={`flex h-11 w-11 items-center justify-center transition ${
                    isActive ? "text-slate-900" : "text-slate-500"
                  }`}
                >
                  <Icon size={26} />
                </div>
              )
            }
          </NavLink>
        ))}
      </div>
    </nav>
  );
}