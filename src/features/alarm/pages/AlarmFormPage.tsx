// src/features/alarm/pages/AlarmFormPage.tsx
// 복약 알람 추가(/mypage/alarm/new) · 편집(/mypage/alarm/:id) 공용 페이지
import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";
import { ROUTES } from "../../../constants/routes";
import { useAlarms } from "../context/AlarmContext";
import type { Alarm, AlarmDraft } from "../types/alarm";
import { formatRepeatDays } from "../utils/alarmFormat";
import TimePicker from "../components/TimePicker";
import RepeatSelector from "../components/RepeatSelector";

const emptyDraft: AlarmDraft = {
  medicineName: "",
  dosage: "",
  hour: 8,
  minute: 0,
  repeatDays: [0, 1, 2, 3, 4, 5, 6],
  memo: "",
};

function toDraft(alarm: Alarm): AlarmDraft {
  return {
    medicineName: alarm.medicineName,
    dosage: alarm.dosage ?? "",
    hour: alarm.hour,
    minute: alarm.minute,
    repeatDays: alarm.repeatDays,
    memo: alarm.memo,
  };
}

const iconButton = "flex size-9 items-center justify-center rounded-full";

export default function AlarmFormPage() {
  const { id } = useParams();
  const { getAlarm, loading, error } = useAlarms();
  const alarm = id ? getAlarm(Number(id)) : undefined;
  const [searchParams] = useSearchParams();
  const presetName = searchParams.get("name") ?? "";

  if (id && loading) return <MobileLayout><PageHeader title="복약 알람" /><p className="p-5">불러오는 중...</p></MobileLayout>;
  if (id && error) return <MobileLayout><PageHeader title="복약 알람" /><p role="alert" className="p-5">알람을 불러오지 못했어요.</p></MobileLayout>;

  // 잘못된 id로 들어오면 목록으로
  if (id && !alarm) return <Navigate to={ROUTES.ALARM} replace />;

  // key로 대상이 바뀔 때 폼 상태 초기화
  return <AlarmForm key={id ?? "new"} alarm={alarm} presetName={presetName} />;
}

function AlarmForm({ alarm, presetName = "" }: { alarm?: Alarm; presetName?: string }) {
  const navigate = useNavigate();
  const { addAlarm, updateAlarm, removeAlarms } = useAlarms();
  const isEdit = !!alarm;

  const [draft, setDraft] = useState<AlarmDraft>(alarm ? toDraft(alarm) : { ...emptyDraft, medicineName: presetName });
  const [view, setView] = useState<"form" | "repeat">("form");
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof AlarmDraft>(key: K, value: AlarmDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const canSave = draft.medicineName.trim().length > 0 && (draft.dosage ?? "").trim().length > 0 && !saving;

  const handleSave = async () => {
    if (saving) return;
    if (!draft.medicineName.trim()) {
      toast.error("약 이름을 입력해 주세요");
      return;
    }
    if (!draft.dosage?.trim()) {
      toast.error("복용량을 입력해 주세요");
      return;
    }
    const payload: AlarmDraft = {
      ...draft,
      medicineName: draft.medicineName.trim(),
      dosage: draft.dosage.trim(),
      memo: draft.memo.trim(),
    };
    setSaving(true);
    try {
      if (alarm) await updateAlarm(alarm.id, payload);
      else await addAlarm(payload);
      toast.success(isEdit ? "알람을 수정했어요" : "알람을 추가했어요");
      navigate(ROUTES.ALARM, { replace: true });
    } catch {
      toast.error("알람을 저장하지 못했어요. 잠시 후 다시 시도해 주세요");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!alarm) return;
    try {
      await removeAlarms([alarm.id]);
      toast.success("알람을 삭제했어요");
      navigate(ROUTES.ALARM, { replace: true });
    } catch {
      toast.error("알람을 삭제하지 못했어요");
    }
  };

  // 반복 요일 선택 화면
  if (view === "repeat") {
    return (
      <MobileLayout showBottomNav={false}>
        <PageHeader
          title="반복"
          leftAction={
            <button
              type="button"
              onClick={() => setView("form")}
              aria-label="뒤로 가기"
              className={`${iconButton} bg-slate-100`}
            >
              <ChevronLeft size={22} />
            </button>
          }
        />
        <div className="px-5 pt-6">
          <RepeatSelector value={draft.repeatDays} onChange={(days) => set("repeatDays", days)} />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showBottomNav={false}>
      <PageHeader
        title={isEdit ? "복약 알람 편집" : "복약 알람 추가"}
        leftAction={
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="닫기"
            className={`${iconButton} bg-slate-100 text-slate-700`}
          >
            <X size={20} />
          </button>
        }
        rightAction={
          <button
            type="button"
            onClick={handleSave}
            aria-label="저장"
            className={`${iconButton} ${canSave ? "bg-primary text-white" : "bg-slate-100 text-slate-300"}`}
          >
            <Check size={20} />
          </button>
        }
      />

      <div className="space-y-4 px-5 pb-10 pt-5">
        {/* 약 정보 */}
        <div className="divide-y divide-slate-100 rounded-[20px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <label className="flex items-center justify-between gap-4 px-5 py-4">
            <span className="flex-shrink-0 text-base text-slate-900">약 이름</span>
            <input
              value={draft.medicineName}
              onChange={(e) => set("medicineName", e.target.value)}
              placeholder="예) 아스피린"
              className="min-w-0 flex-1 bg-transparent text-right text-base text-slate-700 outline-none placeholder:text-slate-300"
            />
          </label>
          <label className="flex items-center justify-between gap-4 px-5 py-4">
            <span className="flex-shrink-0 text-base text-slate-900">복용량</span>
            <input
              value={draft.dosage ?? ""}
              onChange={(e) => set("dosage", e.target.value)}
              placeholder="예) 1알"
              className="min-w-0 flex-1 bg-transparent text-right text-base text-slate-700 outline-none placeholder:text-slate-300"
            />
          </label>
        </div>

        {/* 시간 */}
        <TimePicker
          hour={draft.hour}
          minute={draft.minute}
          onChange={(hour, minute) => setDraft((prev) => ({ ...prev, hour, minute }))}
        />

        {/* 알람 옵션 */}
        <div className="divide-y divide-slate-100 rounded-[20px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <button
            type="button"
            onClick={() => setView("repeat")}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-base text-slate-900">반복</span>
            <span className="flex items-center gap-1 text-sm text-slate-500">
              {formatRepeatDays(draft.repeatDays)}
              <ChevronRight size={18} className="text-slate-400" />
            </span>
          </button>

          <label className="flex items-center justify-between gap-4 px-5 py-4">
            <span className="flex-shrink-0 text-base text-slate-900">메모</span>
            <input
              value={draft.memo}
              onChange={(e) => set("memo", e.target.value)}
              placeholder="예) 식후 30분"
              className="min-w-0 flex-1 bg-transparent text-right text-sm text-slate-700 outline-none placeholder:text-slate-300"
            />
          </label>
        </div>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-full rounded-2xl border border-red-200 bg-white py-3.5 text-base font-medium text-red-500 hover:bg-red-50"
          >
            알람 삭제
          </button>
        )}
      </div>
    </MobileLayout>
  );
}
