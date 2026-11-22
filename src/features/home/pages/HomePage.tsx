// src/features/home/pages/HomePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MobileLayout from "../../../layout/MobileLayout";
import { ROUTES, alarmEditPath } from "../../../constants/routes";
import { useUser } from "../../user/context/UserContext";
import { useIntake } from "../../intake/context/IntakeContext";
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
  const serverDoses = data?.doses.map(toScheduledDose) ?? [];
  const doses = serverDoses.map((d) => (d.doseId in overrides ? { ...d, taken: overrides[d.doseId] } : d));
  const total = data?.progress.total ?? 0;
  const taken =
    (data?.progress.taken ?? 0) +
    doses.reduce((n, d, i) => n + (d.taken === serverDoses[i].taken ? 0 : d.taken ? 1 : -1), 0);
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
