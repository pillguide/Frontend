// src/features/alarm/pages/AlarmListPage.tsx
import { useState } from "react";
import { BellOff, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";
import { ROUTES, alarmEditPath } from "../../../constants/routes";
import { useAlarms } from "../context/AlarmContext";
import AlarmCard from "../components/AlarmCard";

export default function AlarmListPage() {
  const navigate = useNavigate();
  const { alarms, toggleAlarm, removeAlarms } = useAlarms();
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const isEmpty = alarms.length === 0;

  const exitEditMode = () => {
    setEditMode(false);
    setSelectedIds([]);
  };

  const toggleSelect = (id: number) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    removeAlarms(selectedIds);
    toast.success(`알람 ${selectedIds.length}개를 삭제했어요`);
    exitEditMode();
  };

  return (
    <MobileLayout showBottomNav={false}>
      <PageHeader
        title="복약 알람 설정"
        rightAction={
          <button
            type="button"
            onClick={() => navigate(ROUTES.ALARM_NEW)}
            aria-label="알람 추가"
            className="flex size-9 items-center justify-center rounded-full bg-primary text-white shadow-sm"
          >
            <Plus size={20} />
          </button>
        }
      />

      {/* 편집 툴바 */}
      <div className="flex h-12 items-center justify-between px-5">
        {editMode ? (
          <>
            <button type="button" onClick={exitEditMode} className="text-sm font-medium text-slate-500">
              취소
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={selectedIds.length === 0}
              className="text-sm font-semibold text-red-500 disabled:text-slate-300"
            >
              삭제{selectedIds.length > 0 && ` (${selectedIds.length})`}
            </button>
          </>
        ) : (
          <>
            <span />
            <button
              type="button"
              onClick={() => setEditMode(true)}
              disabled={isEmpty}
              className="text-sm font-medium text-primary disabled:text-slate-300"
            >
              편집
            </button>
          </>
        )}
      </div>

      <div className="px-5 pb-10">
        {isEmpty ? (
          <div className="mt-24 flex flex-col items-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <BellOff size={30} className="text-slate-400" />
            </div>
            <p className="text-base font-medium text-slate-700">알림이 없어요</p>
            <p className="mt-1 text-sm text-slate-500">드시는 약 알림을 설정해보세요</p>
            <button
              type="button"
              onClick={() => navigate(ROUTES.ALARM_NEW)}
              className="mt-6 rounded-full border border-primary bg-white px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
            >
              알람 추가하기
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {alarms.map((alarm) => (
              <AlarmCard
                key={alarm.id}
                alarm={alarm}
                editMode={editMode}
                selected={selectedIds.includes(alarm.id)}
                onSelect={() => toggleSelect(alarm.id)}
                onToggle={() => toggleAlarm(alarm.id)}
                onOpen={() => navigate(alarmEditPath(alarm.id))}
              />
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
