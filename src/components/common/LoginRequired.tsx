// 로그인이 필요한 화면에서 비로그인 상태일 때 보여주는 안내
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export default function LoginRequired({ message = "로그인하면 볼 수 있어요" }: { message?: string }) {
  const navigate = useNavigate();
  return (
    <div className="mt-20 flex flex-col items-center px-5 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <LogIn size={22} className="text-slate-400" />
      </div>
      <p className="mb-5 text-sm text-slate-500">{message}</p>
      <button
        type="button"
        onClick={() => navigate(ROUTES.LOGIN)}
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white"
      >
        로그인하기
      </button>
    </div>
  );
}
