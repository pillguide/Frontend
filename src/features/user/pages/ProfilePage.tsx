// src/features/user/pages/ProfilePage.tsx
// 마이페이지 > 정보수정
import { useState } from "react";
import { ChevronRight, Type } from "lucide-react";
import toast from "react-hot-toast";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";
import BottomSheet from "../../../components/common/BottomSheet";
import { useUser } from "../context/UserContext";
import type { UserProfile } from "../types/user";
import type { Gender } from "../../auth/types/onboarding";
import FontScaleControl from "../components/FontScaleControl";
import maleIcon from "../../../assets/남자.png";
import femaleIcon from "../../../assets/여자.png";

type Field = "name" | "gender" | "birthDate" | "email";

const FIELD_LABEL: Record<Field, string> = {
  name: "이름",
  gender: "성별",
  birthDate: "생년월일",
  email: "이메일 주소",
};

const genderLabel = (g: Gender) => (g === "MALE" ? "남자" : g === "FEMALE" ? "여자" : "선택 안 함");
const birthLabel = (d: string) => (d ? d.replaceAll("-", ".") : "입력 안 함");
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function ProfilePage() {
  const { profile, updateProfile } = useUser();
  const [editing, setEditing] = useState<Field | null>(null);

  const rows: { field: Field; value: string }[] = [
    { field: "name", value: profile.name },
    { field: "gender", value: genderLabel(profile.gender) },
    { field: "birthDate", value: birthLabel(profile.birthDate) },
    { field: "email", value: profile.email },
  ];

  const save = (patch: Partial<UserProfile>) => {
    updateProfile(patch);
    setEditing(null);
    toast.success("정보를 수정했어요");
  };

  return (
    <MobileLayout showBottomNav={false}>
      <PageHeader title={`${profile.name}님의 정보`} />

      <div className="space-y-4 px-5 pb-10 pt-5">
        {/* 프로필 카드 */}
        <div className="flex items-center gap-4 rounded-[24px] bg-gradient-to-br from-primary to-primary-400 p-5 text-white shadow-card">
          <div className="flex size-14 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">
            {profile.name.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold">{profile.name}님</p>
            <p className="truncate text-sm text-white/80">{profile.email}</p>
          </div>
        </div>

        {/* 기본 정보 */}
        <section>
          <h2 className="mb-2 px-1 text-sm font-medium text-slate-500">기본 정보</h2>
          <div className="divide-y divide-slate-100 rounded-[20px] bg-white shadow-card">
            {rows.map(({ field, value }) => (
              <button
                key={field}
                type="button"
                onClick={() => setEditing(field)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="flex-shrink-0 text-base text-slate-900">{FIELD_LABEL[field]}</span>
                <span className="flex min-w-0 items-center gap-1 text-slate-500">
                  <span className="truncate">{value}</span>
                  <ChevronRight size={18} className="flex-shrink-0 text-slate-400" />
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 글자 크기 */}
        <section>
          <h2 className="mb-2 flex items-center gap-1 px-1 text-sm font-medium text-slate-500">
            <Type size={14} /> 글자 크기 조정
          </h2>
          <div className="rounded-[20px] bg-white p-5 shadow-card">
            <FontScaleControl />
          </div>
        </section>
      </div>

      {editing && (
        <EditSheet
          key={editing}
          field={editing}
          profile={profile}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </MobileLayout>
  );
}

function EditSheet({
  field,
  profile,
  onClose,
  onSave,
}: {
  field: Field;
  profile: UserProfile;
  onClose: () => void;
  onSave: (patch: Partial<UserProfile>) => void;
}) {
  const [text, setText] = useState(field === "gender" ? "" : profile[field] ?? "");
  const [gender, setGender] = useState<Gender>(profile.gender);

  const valid =
    field === "gender"
      ? gender !== null
      : field === "email"
        ? isEmail(text.trim())
        : field === "birthDate"
          ? /^\d{4}-\d{2}-\d{2}$/.test(text)
          : text.trim().length > 0;

  const submit = () => {
    if (!valid) return;
    onSave(field === "gender" ? { gender } : { [field]: text.trim() });
  };

  return (
    <BottomSheet open onClose={onClose} title={`${FIELD_LABEL[field]} 수정`}>
      {field === "gender" ? (
        <div className="mb-6 grid grid-cols-2 gap-3">
          {(
            [
              { value: "MALE", label: "남자", icon: maleIcon },
              { value: "FEMALE", label: "여자", icon: femaleIcon },
            ] as const
          ).map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setGender(g.value)}
              aria-pressed={gender === g.value}
              className={`flex flex-col items-center gap-2 rounded-2xl border-2 py-5 transition ${
                gender === g.value ? "border-primary bg-primary-50" : "border-slate-100 bg-slate-50"
              }`}
            >
              <img src={g.icon} alt="" className="size-14 object-contain" />
              <span className={`font-semibold ${gender === g.value ? "text-primary" : "text-slate-700"}`}>
                {g.label}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-6">
          <input
            autoFocus
            type={field === "email" ? "email" : field === "birthDate" ? "date" : "text"}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-3.5 text-lg outline-none focus:border-primary"
          />
          {field === "email" && text && !valid && (
            <p className="mt-2 px-1 text-sm text-red-500">이메일 형식을 확인해 주세요</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-[1fr_2fr] gap-2">
        <button type="button" onClick={onClose} className="h-14 rounded-2xl bg-slate-100 font-semibold text-slate-600">
          취소
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!valid}
          className="h-14 rounded-2xl bg-primary font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
        >
          저장
        </button>
      </div>
    </BottomSheet>
  );
}
