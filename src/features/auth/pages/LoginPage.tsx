// src/features/auth/pages/LoginPage.tsx
import { useNavigate, useSearchParams } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import { ROUTES } from "../../../constants/routes";
import logo from "../../../assets/약학다식 로고.png";
import kakaoIcon from "../../../assets/카카오톡로고.png";
import naverIcon from "../../../assets/네이버로고.png";
import googleIcon from "../../../assets/구글.svg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

type Provider = "kakao" | "naver" | "google";

const providers: {
  id: Provider;
  label: string;
  icon: string;
  className: string;
}[] = [
  { id: "kakao", label: "카카오로 이용하기", icon: kakaoIcon, className: "bg-[#FEE500] text-black/85" },
  { id: "naver", label: "네이버로 이용하기", icon: naverIcon, className: "bg-[#03C75A] text-white" },
  { id: "google", label: "구글로 이용하기", icon: googleIcon, className: "bg-white text-slate-800 border border-slate-200" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  const moveToOAuth = (provider: Provider) => {
    window.location.assign(`${API_BASE_URL}/oauth2/authorization/${provider}`);
  };

  return (
    <MobileLayout showBottomNav={false}>
      <div className="flex min-h-full flex-col bg-white px-6 pb-10 pt-24">
        {/* 로고 + 문구 */}
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="약학다식"
            className="w-56 select-none"
            draggable={false}
          />
          <h1 className="mt-10 text-center text-2xl font-bold leading-snug text-slate-900">
            지금 약학다식과
            <br />
            안전하게 관리하세요!
          </h1>
        </div>

        {error && (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500">
            로그인에 실패했어요. 다시 시도해 주세요.
          </p>
        )}

        {/* 소셜 로그인 */}
        <div className="mb-5 mt-auto flex items-center gap-3 pt-12">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-sm text-slate-400">소셜 로그인</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="space-y-3">
          {providers.map(({ id, label, icon, className }) => (
            <button
              key={id}
              type="button"
              onClick={() => moveToOAuth(id)}
              className={`relative flex h-[52px] w-full items-center justify-center rounded-full text-base font-medium shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition active:scale-[0.99] ${className}`}
            >
              <span className="absolute left-4 flex size-8 items-center justify-center">
                <img src={icon} alt="" className="size-full object-contain" draggable={false} />
              </span>
              {label}
            </button>
          ))}
        </div>

        {/* 백엔드 연결 전 데모용 진입점 */}
        <button
          type="button"
          onClick={() => navigate(ROUTES.HOME)}
          className="mt-6 text-sm text-slate-400 underline underline-offset-4"
        >
          로그인 없이 둘러보기
        </button>
      </div>
    </MobileLayout>
  );
}
