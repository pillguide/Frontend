// src/features/home/pages/HomePage.tsx
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MobileLayout from "../../../layout/MobileLayout";
import { ROUTES, alarmEditPath } from "../../../constants/routes";
import { useUser } from "../../user/context/UserContext";
import { useIntake } from "../../intake/context/IntakeContext";
import { useDoses, useStreak } from "../../intake/hooks/useIntakeStats";
import { useNow } from "../hooks/useNow";
import HomeGreeting from "../components/HomeGreeting";
import TodayHeroCard from "../components/TodayHeroCard";
import NextDoseCard from "../components/NextDoseCard";
import QuickMenu from "../components/QuickMenu";
import MedicationChecklist from "../components/MedicationChecklist";
import HealthTipCard from "../components/HealthTipCard";

export default function HomePage() {
  const navigate = useNavigate();
  const now = useNow();
  const { profile } = useUser();
  const { toggleTaken } = useIntake();
  const { doses, total, taken } = useDoses(now);
  const streak = useStreak();

  const openAlarm = (alarmId: number) => navigate(alarmEditPath(alarmId));

  const handleToggle = (alarmId: number) => {
    const nowTaken = toggleTaken(now, alarmId);
    if (!nowTaken) return;
    const remain = total - taken - 1;
    toast.success(remain === 0 ? "오늘 약을 모두 챙겼어요!" : `복용 완료! ${remain}개 남았어요`);
  };

  return (
    <MobileLayout>
      <div className="bg-gradient-to-b from-primary-50/70 to-transparent">
        <HomeGreeting userName={profile.name} now={now} />
        <div className="px-4">
          <TodayHeroCard total={total} taken={taken} streak={streak} onClick={() => navigate(ROUTES.CHECK_RECORD)} />
        </div>
      </div>

      <div className="space-y-5 px-4 pb-8 pt-4">
        <NextDoseCard doses={doses} now={now} onOpen={openAlarm} />
        <QuickMenu />
        <MedicationChecklist
          doses={doses}
          onToggle={handleToggle}
          onOpen={openAlarm}
          onManage={() => navigate(ROUTES.ALARM)}
          onAdd={() => navigate(ROUTES.ALARM_NEW)}
        />
        <HealthTipCard date={now} />
      </div>
    </MobileLayout>
  );
}
