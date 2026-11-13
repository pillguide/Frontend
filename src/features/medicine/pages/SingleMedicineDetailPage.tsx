// src/features/medicine/pages/SingleMedicineDetailPage.tsx
import { useEffect, useState } from "react";
import { ChevronDown, Bell } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as Accordion from "@radix-ui/react-accordion";
import MobileLayout from "../../../layout/MobileLayout";
import MedicineHero from "../components/MedicineHero";
import { getSingleMedicine } from "../mock/medicine.mock";
import type { SingleMedicineDetail } from "../types/medicine";
import PageHeader from "../../../components/common/PageHeader";
import { ROUTES } from "../../../constants/routes";
import { drugApi } from "../api/drugApi";
import { toTextItems } from "../utils/drugText";
import ReferenceComparison from "../components/ReferenceComparison";
import { scanDraft, useScanDraft } from "../scanDraft";
import { infoStatusLabel, authorizationStatusLabel } from "../utils/referenceLabels";

/** 서버 약 상세 → 화면 모델 */
async function loadFromApi(id: number): Promise<SingleMedicineDetail> {
  const d = await drugApi.detail(id);
  return {
    id: d.drugId,
    name: d.name,
    imageUrl: d.imageUrl,
    reference: d.reference,
    tags: [],
    effects: toTextItems(d.effect),
    sideEffects: toTextItems(d.sideEffects),
    usage: toTextItems(d.dosageMethod),
    storage: toTextItems(d.storageMethod),
  };
}

interface Props {
  /** "mock": 스캔 결과 데모 화면에서 들어온 경우 (AI 연동 전) */
  source?: "api" | "mock";
}

export default function SingleMedicineDetailPage({ source = "api" }: Props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [params] = useSearchParams();
  const draft = useScanDraft();
  const detectionId = params.get("detectionId");
  const detection = detectionId ? draft.result?.drugs.find((d) =>
    d.drugId === Number(id) && d.detectionId !== null && String(d.detectionId) === detectionId) : undefined;
  const [state, setState] = useState<{ id?: string; data?: SingleMedicineDetail; error?: string }>({});

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = source === "mock" ? getSingleMedicine(Number(id)) : loadFromApi(Number(id));
    load
      .then((data) => {
        if (!cancelled) setState({ id, data });
      })
      .catch((e: unknown) => {
        if (!cancelled) setState({ id, error: e instanceof Error ? e.message : "약 정보를 불러오지 못했어요" });
      });
    return () => {
      cancelled = true;
    };
  }, [id, source]);

  const data = state.id === id ? state.data : undefined;
  const error = state.id === id ? state.error : undefined;

  if (!data) {
    return (
      <MobileLayout>
        <PageHeader title="약 정보" showBack={true} />
        <div className="p-6 text-center text-slate-500">{error ?? "불러오는 중..."}</div>
      </MobileLayout>
    );
  }

  const sections = [
    { value: "side-effects", title: "부작용", items: data.sideEffects },
    { value: "usage", title: "복용 방법", items: data.usage },
    { value: "storage", title: "보관 방법", items: data.storage },
  ].filter((section) => section.items.length > 0);
  const empty = <li className="text-slate-400">등록된 정보가 없어요</li>;

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
          hideImage={source === "api"}
        />

        {source === "api" && <>
          <ReferenceComparison drugId={data.id} imageUrl={data.imageUrl}
            ready={data.reference?.representativeImageStatus === "READY"}
            preview={detection ? draft.preview : null} detection={detection}
            imageSize={draft.result?.imageSize ?? null} />
          {data.reference && <p className="mb-4 text-xs text-slate-500">
            자료: {infoStatusLabel(data.reference.infoStatus)} · 허가: {authorizationStatusLabel(data.reference.authorizationStatus)}
            {data.reference.sourceAsOf && ` · 기준일 ${data.reference.sourceAsOf}`}
          </p>}
          {detection && <div className="mb-4 grid grid-cols-2 gap-2">
            <button type="button" className="rounded-xl border p-3 text-sm" onClick={() => {
              scanDraft.setSelected(draft.selected.filter((selected) => selected !== detection.detectionId));
              navigate(ROUTES.SCAN_RESULT);
            }}>이 검출 저장에서 제외</button>
            <button type="button" className="rounded-xl border p-3 text-sm" onClick={() => {
              scanDraft.clear(); navigate(ROUTES.SCAN);
            }}>다시 촬영</button>
          </div>}
        </>}

        {/* Primary CTA */}
        <button
          onClick={() => navigate(`${ROUTES.ALARM_NEW}?name=${encodeURIComponent(data.name)}`)}
          className="mb-4 flex h-12 w-full items-center justify-center gap-1 rounded-xl bg-[#534AB7] font-medium text-white"
        >
          <Bell size={18} />
          복약 알림 설정하기
        </button>

        {/* Always-expanded: 주요 효능 */}
        <div className="mb-3 rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h3 className="mb-3 text-base font-bold text-slate-900">주요 효능</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            {data.effects.length === 0
              ? empty
              : data.effects.map((item, idx) => <li key={idx}>• {item}</li>)}
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
