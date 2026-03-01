import { useSearchParams } from "react-router-dom";
import logo from "../../../assets/약학다식 로고.png";
import kakaoIcon from "../../../assets/카카오톡로고.png";
import naverIcon from "../../../assets/네이버로고.png";
import googleIcon from "../../../assets/구글.svg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
type Provider = "kakao" | "naver" | "google";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  const moveToOAuth = (provider: Provider) => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="min-h-[100dvh] w-full bg-sky-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-[390px] flex flex-col items-center">
        <div className="h-6" />

        <div className="flex flex-col items-center gap-4">
          <img
            src={logo}
            alt="약학다식 로고"
            className="w-[190px] h-auto select-none"
            draggable={false}
          />

          <p className="text-center text-slate-900 text-xl font-extrabold leading-snug tracking-[-0.02em]">
            지금 약학다식과 <br />
            안전하게 관리하세요!
            </p>

          {error && (
            <div className="w-full rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
              로그인 실패: {error}
            </div>
          )}
        </div>

        <div className="w-full flex items-center gap-3 mt-8 mb-5">
          <div className="h-px flex-1 bg-slate-300" />
          <div className="text-xs text-slate-500">소셜 로그인</div>
          <div className="h-px flex-1 bg-slate-300" />
        </div>

        <div className="w-full flex flex-col items-center gap-3">
            {/* Kakao */}
            <button
                onClick={() => moveToOAuth("kakao")}
                className="w-[320px] max-w-full h-12 rounded-full bg-[#FEE500] text-slate-900 font-semibold
                        flex items-center justify-start px-5 shadow-sm
                        active:scale-[0.99] transition"
            >
                {/* 아이콘: 왼쪽 고정 */}
                <span className="w-10 h-10 flex items-center justify-center shrink-0">
                <img
                    src={kakaoIcon}
                    alt="카카오톡로고"
                    className="w-full h-full object-contain"
                    draggable={false}
                />
                </span>

                {/* 텍스트: 가운데처럼 보이게 */}
                <span className="flex-1 text-center">카카오로 이용하기</span>

                {/* 오른쪽 밸런스용 더미(텍스트가 진짜 중앙에 오게) */}
                <span className="w-7 h-7 shrink-0" />
            </button>

            {/* Naver */}
            <button
                onClick={() => moveToOAuth("naver")}
                className="w-[320px] max-w-full h-12 rounded-full bg-[#03C75A] text-white font-semibold
                        flex items-center justify-start px-5 shadow-sm
                        active:scale-[0.99] transition"
            >
                <span className="w-10 h-10 flex items-center justify-center shrink-0">
                <img
                    src={naverIcon}
                    alt="네이버로고"
                    className="w-full h-full object-contain"
                    draggable={false}
                />
                </span>

                <span className="flex-1 text-center">네이버로 이용하기</span>
                <span className="w-7 h-7 shrink-0" />
            </button>

            {/* Google */}
            <button
                onClick={() => moveToOAuth("google")}
                className="w-[320px] max-w-full h-12 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold
                        flex items-center justify-start px-5 shadow-sm
                        active:scale-[0.99] transition"
            >
                <span className="w-6 h-6 flex items-center justify-center shrink-0">
                <img
                    src={googleIcon}
                    alt="구글"
                    className="w-full h-full object-contain"
                    draggable={false}
                />
                </span>

                <span className="flex-1 text-center">구글로 이용하기</span>
                <span className="w-7 h-7 shrink-0" />
            </button>
            </div>

        <div className="flex-1" />
      </div>
    </div>
  );
}