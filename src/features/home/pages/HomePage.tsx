// src/features/home/pages/HomePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MobileLayout from "../../../layout/MobileLayout";
import { ROUTES, alarmEditPath } from "../../../constants/routes";
import { useUser } from "../../user/context/UserContext";
import { useIntake } from "../../intake/context/IntakeContext";
import { useAlarms } from "../../alarm/context/AlarmContext";
import { toScheduledDose, useHomeStats } from "../../intake/hooks/useIntakeStats";
import { koreaToday } from "../../intake/utils/date";
import type { Home } from "../../intake/api/medicationApi";
import { authStorage } from "../../../utils/authStorage";
import LoginRequired from "../../../components/common/LoginRequired";
import { useNow } from "../hooks/useNow";
import HomeGreeting from "../components/HomeGreeting";
import TodayHeroCard from "../components/TodayHeroCard";
import NextDoseCard from "../components/NextDoseCard";
import QuickMenu from "../components/QuickMenu";
import MedicationChecklist from "../components/MedicationChecklist";
import HealthTipCard from "../components/HealthTipCard";

export default function HomePage() {
  const navigate = useNavigate();
  const clock = useNow();
  const now = koreaToday(clock);
  const { profile, error: profileError } = useUser();
  const { toggleTaken, refresh } = useIntake();
  const { data, loading, error } = useHomeStats();
  // 체크하면 서버 응답을 기다리지 않고 바로 반영 (새 데이터가 오면 서버 값으로 교체, 실패하면 되돌림)
  const [optimistic, setOptimistic] = useState<{ base?: Home; taken: Record<number, boolean> }>({ taken: {} });
  const overrides = optimistic.base === data ? optimistic.taken : {};
  // 알람 설정과 맞추기: 시간이 지난 뒤 지운 알람의 오늘 기록은 숨기고(복용 완료한 건 남김),
  // 시간이 지난 뒤 바꾼 알람은 지금 설정된 이름·시간으로 보여준다 (백엔드는 지난 기록을 보존함)
  const { alarms, loading: alarmsLoading, error: alarmsError } = useAlarms();
  const alarmsReady = !alarmsLoading && !alarmsError;
  const doses = (data?.doses.map(toScheduledDose) ?? [])
    .map((d) => (d.doseId in overrides ? { ...d, taken: overrides[d.doseId] } : d))
    .flatMap((d) => {
      if (!alarmsReady) return [d];
      const current = alarms.find((a) => a.id === d.alarm.id);
      if (!current) return d.taken ? [d] : [];
      return [{ ...d, alarm: { ...d.alarm, medicineName: current.medicineName, dosage: current.dosage,
        hour: current.hour, minute: current.minute, memo: current.memo } }];
    })
    .sort((a, b) => a.alarm.hour * 60 + a.alarm.minute - (b.alarm.hour * 60 + b.alarm.minute));
  const total = doses.length;
  const taken = doses.filter((d) => d.taken).length;
  const streak = data?.streak ?? 0;

  const openAlarm = (alarmId: number) => navigate(alarmEditPath(alarmId));

  const handleToggle = async (doseId: number) => {
    const dose = doses.find((item) => item.doseId === doseId);
    if (!dose) return;
    const next = !dose.taken;
    setOptimistic((prev) => ({
      base: data,
      taken: { ...(prev.base === data ? prev.taken : {}), [doseId]: next },
    }));
    try {
      await toggleTaken(doseId, next);
      if (next) toast.success("복용을 기록했어요");
    } catch {
      setOptimistic((prev) => {
        const rest = { ...prev.taken };
        delete rest[doseId];
        return { ...prev, taken: rest };
      });
      toast.error("복용 기록을 저장하지 못했어요");
    }
  };

  return (
    <MobileLayout>
      <div className="bg-gradient-to-b from-primary-50/70 to-transparent">
        <HomeGreeting userName={profile.name} now={now} />
        {profileError && <p role="alert" className="px-5 pb-2 text-sm">{profileError}</p>}
        <div className="px-4">
          {data && <TodayHeroCard total={total} taken={taken} streak={streak} onClick={() => navigate(ROUTES.CHECK_RECORD)} />}
        </div>
      </div>

      <div className="space-y-5 px-4 pb-8 pt-4">
        {data?.nextDose && <NextDoseCard doses={[toScheduledDose(data.nextDose)]} now={now} onOpen={openAlarm} />}
        <QuickMenu />
        {!authStorage.isLoggedIn() ? <LoginRequired /> : loading ? <p>복약 정보를 불러오는 중...</p> : error ? <div><p role="alert">{error}</p><button onClick={refresh} className="text-primary">다시 시도</button></div> : data && <MedicationChecklist
          doses={doses}
          onToggle={(id) => void handleToggle(id)}
          onOpen={openAlarm}
          onManage={() => navigate(ROUTES.ALARM)}
          onAdd={() => navigate(ROUTES.ALARM_NEW)}
        />}
        <HealthTipCard date={now} />
      </div>
    </MobileLayout>
  );
}
