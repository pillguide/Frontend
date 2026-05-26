import MobileLayout from "../../../layout/MobileLayout";
import HomeGreeting from "../components/HomeGreeting";
import HomeHeroCard from "../components/HomeHeroCard";
import MedicationScheduleCard from "../components/MedicationScheduleCard";
import ScanPreviewCard from "../components/ScanPreviewCard";
import { useHomeData } from "../hooks/useHomeData";

export default function HomePage() {
  const { data, isLoading } = useHomeData();

  if (isLoading || !data) {
    return (
      <MobileLayout>
        <div className="p-6 text-slate-500">홈 데이터를 불러오는 중...</div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <HomeGreeting userName={data.userName} />

      <div className="space-y-5 px-4 py-4">
        <HomeHeroCard message={data.heroMessage} />
        <MedicationScheduleCard medications={data.todayMedications} />
        <ScanPreviewCard scan={data.recentScan} />
      </div>
    </MobileLayout>
  );
}