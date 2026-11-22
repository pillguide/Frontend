import { useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import type { OnboardingForm } from "../types/onboarding";
import { ChevronLeft } from "lucide-react";
import MobileLayout from "../../../layout/MobileLayout";
import { ROUTES } from "../../../constants/routes";
import { useUser } from "../../user/context/UserContext";
import { isProfileComplete } from "../../user/types/user";
import maleIcon from "../../../assets/남자.png";
import femaleIcon from "../../../assets/여자.png";
import { fontScaleStorage, type FontScale } from "../../../utils/fontScale";
import toast from "react-hot-toast";
import { authStorage } from "../../../utils/authStorage";
import { logout } from "../api/authApi";
import { scanDraft } from "../../medicine/scanDraft";

type Step = "NAME" | "GENDER_BIRTH" | "EMAIL" | "FONT_SIZE" | "DONE";

const fontOptions: FontScale[] = ["xs", "sm", "md", "lg", "xl"];
const fontLabels = ["최대 작게", "조금 작게", "중간", "조금 크게", "최대 크게"];

/**
 * 소셜 로그인으로 못 받은 정보 입력 (로그인 직후 AuthGate·OAuth 콜백이 보내는 곳)
 * 내 정보를 다 불러온 뒤에 단계를 정해야 이미 받은 항목을 다시 묻지 않는다
 */
export default function SignupPage() {
  const { profile, loading, error, reload } = useUser();
  // 처음 들어올 때 이미 다 채워져 있으면 입력할 게 없으니 홈으로 (입력을 마친 뒤의 완료 화면은 유지)
  const [completeOnEnter] = useState(() => !loading && isProfileComplete(profile));
  if (completeOnEnter) return <Navigate to={ROUTES.HOME} replace />;
  if (loading || error) {
    return (
      <MobileLayout showBottomNav={false}>
        <p className="p-10 text-center text-sm text-slate-500">
          {error ? (
            <>
              정보를 불러오지 못했어요{" "}
              <button type="button" onClick={reload} className="font-bold text-primary">
                다시 시도
              </button>
            </>
          ) : (
            "불러오는 중..."
          )}
        </p>
      </MobileLayout>
    );
  }
  return <ProfileOnboarding />;
}

function ProfileOnboarding() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUser();

  // 소셜 로그인으로 이미 받은 정보는 채워 두고, 빠진 항목의 단계만 보여준다
  // (구글·네이버: 성별·생년월일, 카카오: 성별·생년월일·이메일)
  const stepOrder = useRef<Step[]>([
    ...(profile.name.trim() ? [] : (["NAME"] as Step[])),
    ...(profile.gender && profile.birthDate ? [] : (["GENDER_BIRTH"] as Step[])),
    ...(profile.email ? [] : (["EMAIL"] as Step[])),
    "FONT_SIZE",
    "DONE",
  ]).current;
  const [step, setStep] = useState<Step>(stepOrder[0]);
  const [form, setForm] = useState<OnboardingForm>({
    name: profile.name,
    gender: profile.gender,
    birthDate: profile.birthDate,
    email: profile.email,
  });

  const [submitting, setSubmitting] = useState(false);

  // 글자 크기 상태(기본값은 storage에서)
  const [fontScale, setFontScale] = useState<FontScale>(() => fontScaleStorage.get());

  const canNext = useMemo(() => {
    if (step === "NAME") return form.name.trim().length > 0;
    if (step === "GENDER_BIRTH") return !!form.gender && form.birthDate.length === 10;
    if (step === "EMAIL") return form.email.includes("@");
    if (step === "FONT_SIZE") return true; // 글자크기는 선택값이 항상 존재
    return false;
  }, [step, form]);

  const applyFontScale = (scale: FontScale) => {
    setFontScale(scale);
    document.documentElement.setAttribute("data-font-scale", scale);
    fontScaleStorage.set(scale);
  };

  // 성별·생년월일·이메일은 서버에 저장 (이름·글자 크기는 아직 서버 항목이 없어 기기에만 저장)
  const submit = async () => {
    if (!form.gender) return;
    if (!authStorage.isLoggedIn()) { toast.error("로그인이 필요합니다."); return; }
    setSubmitting(true);
    try {
      await updateProfile({ ...form, name: form.name.trim(), email: form.email.trim() });
    } catch {
      toast.error("정보를 저장하지 못했어요");
      return;
    } finally { setSubmitting(false); }
    setStep("DONE");
  };

  const next = () => {
    if (!canNext || submitting) return;
    if (step === "FONT_SIZE") {
      void submit();
      return;
    }

    setStep((prev) => stepOrder[stepOrder.indexOf(prev) + 1] ?? "DONE");
  };

  // 첫 단계에서 뒤로 가면 로그아웃하고 로그인 화면으로 (다른 계정으로 로그인할 수 있게)
  const goBack = async () => {
    const idx = stepOrder.indexOf(step);
    if (idx > 0) {
      setStep(stepOrder[idx - 1]);
      return;
    }
    try {
      await logout();
    } catch {
      /* 서버 로그아웃에 실패해도 이 기기에서는 로그아웃 */
    }
    scanDraft.clear();
    authStorage.clear();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  // 버튼 문구
  const bottomButtonText = useMemo(() => {
    if (step === "FONT_SIZE") return submitting ? "가입 중..." : "회원가입";
    return "다음";
  }, [step, submitting]);

  return (
    <MobileLayout showBottomNav={false}>
      <div className="flex min-h-full flex-col bg-white px-5 pt-4">
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => void goBack()}
            className="p-2 -ml-2 active:scale-[0.98] transition"
            aria-label="뒤로가기"
          >
            <ChevronLeft size={24} className="text-slate-900" />
          </button>
        </div>

        {/* 본문 */}
        {step === stepOrder[0] && step !== "FONT_SIZE" && (
          <p className="mb-3 text-sm text-slate-500">몇 가지만 입력하면 시작할 수 있어요</p>
        )}
        {step === "NAME" && (
          <section className="flex-1">
            <h1 className="text-xl font-extrabold mb-6">이름을 입력해 주세요</h1>
            <label className="block text-sm text-slate-400 mb-2">이름</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full border-b-2 border-slate-200 py-3 text-lg outline-none focus:border-primary"
              placeholder="홍길동"
            />
          </section>
        )}

        {step === "GENDER_BIRTH" && (
          <section className="flex-1">
            <h1 className="text-xl font-extrabold mb-6">성별을 선택해 주세요</h1>

            <div className="flex justify-center gap-10 items-start mb-10">
              <GenderIconButton
                label="남"
                iconSrc={maleIcon}
                selected={form.gender === "MALE"}
                selectedRingClass="ring-primary"
                onClick={() => setForm((p) => ({ ...p, gender: "MALE" }))}
              />
              <GenderIconButton
                label="여"
                iconSrc={femaleIcon}
                selected={form.gender === "FEMALE"}
                selectedRingClass="ring-primary"
                onClick={() => setForm((p) => ({ ...p, gender: "FEMALE" }))}
              />
            </div>

            <h2 className="text-xl font-extrabold mb-4">생일을 입력해 주세요</h2>
            <label className="block text-sm text-slate-400 mb-2">생년월일</label>

            <div className="relative">
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm((p) => ({ ...p, birthDate: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
              />
            </div>
          </section>
        )}

        {step === "EMAIL" && (
          <section className="flex-1">
            <h1 className="text-xl font-extrabold mb-6">이메일을 입력해 주세요</h1>
            <label className="block text-sm text-slate-400 mb-2">이메일</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full border-b-2 border-slate-200 py-3 text-lg outline-none focus:border-primary"
              placeholder="1234@gmail.com"
            />
          </section>
        )}

        {/* 글자 크기 설정 단계 */}
        {step === "FONT_SIZE" && (
          <section className="flex-1">
            <h1 className="text-lg font-extrabold mb-8">원하는 글자 크기로 맞출 수 있어요</h1>

            {/* 미리보기 */}
            <div className="text-center mb-10">
              <div className="rounded-2xl bg-slate-50 py-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="font-semibold">가나다라마바사</div>
              <div className="font-semibold">ABCDEFG</div>
              <div className="font-semibold">abcdefg</div>
              </div>
            </div>

            {/* 슬라이더 */}
            <div className="px-2">
              <input
                type="range"
                min={0}
                max={4}
                step={1}
                value={fontOptions.indexOf(fontScale)}
                onChange={(e) => applyFontScale(fontOptions[Number(e.target.value)])}
                className="w-full accent-primary"
              />

              <div className="mt-3 grid grid-cols-5 text-[10px] text-slate-500">
                {fontLabels.map((t) => (
                  <div key={t} className="text-center">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {step === "DONE" && (
          <section className="flex-1">
            <h1 className="text-xl font-extrabold mb-2">완료!</h1>
            <p className="text-slate-500">회원가입이 완료됐어요.</p>

            {/*  홈으로 */}
            <button
              type="button"
              onClick={() => navigate(ROUTES.HOME, { replace: true })}
              className="mt-6 w-full h-14 rounded-2xl bg-primary text-white font-semibold"
            >
              시작하기
            </button>
          </section>
        )}

        {/* 하단 고정 버튼 */}
        {step !== "DONE" && (
          <div className="sticky bottom-0 bg-white pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
            <button
              onClick={next}
              disabled={!canNext}
              className={`w-full h-14 rounded-2xl font-semibold transition
                ${canNext ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}
            >
              {bottomButtonText}
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

function GenderIconButton({
  label,
  iconSrc,
  selected,
  selectedRingClass,
  onClick,
}: {
  label: string;
  iconSrc: string;
  selected: boolean;
  selectedRingClass: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-2">
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center bg-slate-50
        ring-2 ${selected ? selectedRingClass : "ring-transparent"} transition`}
      >
        <img src={iconSrc} alt={label} className="w-12 h-12 object-contain" draggable={false} />
      </div>
      <div className="text-sm font-semibold text-slate-800">{label}</div>
    </button>
  );
}