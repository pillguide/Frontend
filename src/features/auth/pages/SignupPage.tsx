import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { OnboardingForm } from "../types/onboarding";
import backIcon from "../../../assets/뒤로가기.png";
import maleIcon from "../../../assets/남자.png";
import femaleIcon from "../../../assets/여자.png";
import { fontScaleStorage, type FontScale } from "../../../utils/fontScale";

type Step = "NAME" | "GENDER_BIRTH" | "EMAIL" | "FONT_SIZE" | "DONE";

const stepOrder: Step[] = ["NAME", "GENDER_BIRTH", "EMAIL", "FONT_SIZE", "DONE"];

const fontOptions: FontScale[] = ["xs", "sm", "md", "lg", "xl"];
const fontLabels = ["최대 작게", "조금 작게", "중간", "조금 크게", "최대 크게"];

export default function ProfileOnboardingPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("NAME");
  const [form, setForm] = useState<OnboardingForm>({
    name: "",
    gender: null,
    birthDate: "",
    email: "",
  });

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

  const next = () => {
    if (!canNext) return;

    setStep((prev) => {
      if (prev === "NAME") return "GENDER_BIRTH";
      if (prev === "GENDER_BIRTH") return "EMAIL";
      if (prev === "EMAIL") return "FONT_SIZE";
      if (prev === "FONT_SIZE") return "DONE";
      return "DONE";
    });
  };

  const goBack = () => {
    const idx = stepOrder.indexOf(step);
    if (idx <= 0) {
      navigate("/login", { replace: true });
      return;
    }
    setStep(stepOrder[idx - 1]);
  };

  // 버튼 문구
  const bottomButtonText = useMemo(() => {
    if (step === "FONT_SIZE") return "회원가입";
    return "다음";
  }, [step]);

  return (
    <div className="min-h-[100dvh] bg-white flex justify-center px-4 py-6">
      <div className="w-full max-w-[390px] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-6">
          <button
            type="button"
            onClick={goBack}
            className="p-2 -ml-2 active:scale-[0.98] transition"
            aria-label="뒤로가기"
          >
            <img src={backIcon} alt="뒤로가기" className="w-5 h-5" draggable={false} />
          </button>
        </div>

        {/* 본문 */}
        {step === "NAME" && (
          <section className="flex-1">
            <p className="text-xs text-slate-700 mb-5">
              마지막으로 몇 가지만 입력하면 가입이 완료돼요!
            </p>
            <h1 className="text-xl font-extrabold mb-6">이름을 입력해 주세요</h1>
            <label className="block text-sm text-slate-400 mb-2">이름</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full border-b border-slate-200 py-3 outline-none focus:border-slate-400"
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
                selectedRingClass="ring-blue-500"
                onClick={() => setForm((p) => ({ ...p, gender: "MALE" }))}
              />
              <GenderIconButton
                label="여"
                iconSrc={femaleIcon}
                selected={form.gender === "FEMALE"}
                selectedRingClass="ring-red-400"
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
                className="w-full border border-slate-200 rounded-md px-3 py-3 outline-none focus:border-slate-400"
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
              className="w-full border-b border-slate-200 py-3 outline-none focus:border-slate-400"
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
              <div className="font-semibold">가나다라마바사</div>
              <div className="font-semibold">ABCDEFG</div>
              <div className="font-semibold">abcdefg</div>
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
                className="w-full"
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
              onClick={() => navigate("/")}
              className="mt-6 w-full h-12 rounded-md bg-slate-900 text-white font-semibold"
            >
              시작하기
            </button>
          </section>
        )}

        {/* 하단 고정 버튼 */}
        {step !== "DONE" && (
          <div className="sticky bottom-0 bg-white pt-4">
            <button
              onClick={next}
              disabled={!canNext}
              className={`w-full h-12 rounded-md font-semibold transition
                ${canNext ? "bg-[#BFDAF7] text-slate-900": "bg-[#F3F7FD] text-slate-400"}`}
            >
              {bottomButtonText}
            </button>
          </div>
        )}
      </div>
    </div>
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
        className={`w-20 h-20 rounded-full flex items-center justify-center bg-white
        ring-2 ${selected ? selectedRingClass : "ring-transparent"} transition`}
      >
        <img src={iconSrc} alt={label} className="w-12 h-12 object-contain" draggable={false} />
      </div>
      <div className="text-sm font-semibold text-slate-800">{label}</div>
    </button>
  );
}