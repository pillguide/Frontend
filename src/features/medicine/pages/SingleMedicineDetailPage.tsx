// src/features/medicine/pages/SingleMedicineDetailPage.tsx
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronDown, Bell } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import * as Accordion from "@radix-ui/react-accordion";
import MobileLayout from "../../../layout/MobileLayout";
import MedicineHero from "../components/MedicineHero";
import { getSingleMedicine } from "../mock/medicine.mock";
import type { SingleMedicineDetail } from "../types/medicine";
import PageHeader from "../../../components/common/PageHeader";


export default function SingleMedicineDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<SingleMedicineDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    getSingleMedicine(Number(id)).then(setData);
  }, [id]);

  if (!data) {
    return (
      <MobileLayout>
        <div className="p-6 text-slate-500">불러오는 중...</div>
      </MobileLayout>
    );
  }

  const sections = [
    { value: "side-effects", title: "부작용", items: data.sideEffects },
    { value: "usage", title: "복용 방법", items: data.usage },
    { value: "storage", title: "보관 방법", items: data.storage },
  ];

  return (
    <MobileLayout>
      {/* Header */}
      <PageHeader title="약 정보" showBack={true} />

      {/* Content */}
      <div className="px-4 pb-6">
        <MedicineHero
          name={data.name}
          imageUrl={data.imageUrl}
          tags={data.tags}
        />

        {/* Primary CTA */}
        <button
          onClick={() => navigate(`/mypage/alarm?medicineId=${data.id}`)}
          className="mb-4 flex h-12 w-full items-center justify-center gap-1 rounded-xl bg-[#534AB7] font-medium text-white"
        >
          <Bell size={18} />
          복약 알림 설정하기
        </button>

        {/* Always-expanded: 주요 효능 */}
        <div className="mb-3 rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h3 className="mb-3 text-base font-bold text-slate-900">주요 효능</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            {data.effects.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Accordion: one open at a time */}
        <Accordion.Root type="single" collapsible className="space-y-3">
          {sections.map((section) => (
            <Accordion.Item
              key={section.value}
              value={section.value}
              className="overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between p-4 text-left hover:bg-slate-50">
                  <span className="text-base font-bold text-slate-900">
                    {section.title}
                  </span>
                  <ChevronDown
                    size={20}
                    className="text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden text-sm text-slate-700 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <ul className="space-y-2 px-4 pb-4">
                  {section.items.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </MobileLayout>
  );
}