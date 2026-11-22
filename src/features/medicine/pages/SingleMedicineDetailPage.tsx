// 약 정보: 검색·내 약에서 들어오는 약 상세 (GET /api/v1/drugs/{drugId})
import { useEffect, useState } from "react";
import { Bell, ChevronDown, Pill } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import * as Accordion from "@radix-ui/react-accordion";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";
import { ROUTES } from "../../../constants/routes";
import { drugApi, type DrugDetail } from "../api/drugApi";
import { toTextItems } from "../utils/drugText";
import RepresentativePhoto from "../components/RepresentativePhoto";
import DrugTextBlocks from "../components/DrugTextBlocks";


export default function SingleMedicineDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, setState] = useState<{ id?: string; data?: DrugDetail; error?: boolean }>({});

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    drugApi
      .detail(Number(id))
      .then((data) => {
        if (!cancelled) setState({ id, data });
      })
      .catch(() => {
        if (!cancelled) setState({ id, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const data = state.id === id ? state.data : undefined;
  const error = state.id === id && state.error;

  if (!data) {
    return (
      <MobileLayout>
        <PageHeader title="약 정보" />
        <p className="p-6 text-center text-sm text-slate-500">
          {error ? "약 정보를 불러오지 못했어요" : "불러오는 중..."}
        </p>
      </MobileLayout>
    );
  }

  const hasEffect = toTextItems(data.effect).length > 0;
  const sections = [
    { value: "side-effects", title: "부작용", text: data.sideEffects },
    { value: "usage", title: "복용 방법", text: data.dosageMethod },
    { value: "storage", title: "보관 방법", text: data.storageMethod },
  ].filter((section) => toTextItems(section.text).length > 0);
  const classification = data.reference?.classificationName;
  const ingredient = data.reference?.ingredientDisplay;
  const imageReady = data.reference?.representativeImageStatus === "READY" && !!data.imageUrl;
  const card = "rounded-[20px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]";

  return (
    <MobileLayout>
      <PageHeader title="약 정보" />
      <div className="space-y-3 bg-[#f4f5f9] px-4 pb-8 pt-6">
        <div className="flex flex-col items-center">
          <span className="mb-4 flex size-28 items-center justify-center overflow-hidden rounded-3xl bg-white">
            {imageReady ? (
              <RepresentativePhoto key={`${data.drugId}:${data.imageUrl}`} drugId={data.drugId} url={data.imageUrl} ready />
            ) : (
              <Pill size={40} className="text-slate-300" />
            )}
          </span>
          <h2 className="max-w-full break-words text-center text-xl font-bold text-slate-900">{data.name}</h2>
          {(classification || ingredient) && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {classification && (
                <span className="rounded-full bg-slate-200/70 px-3 py-1 text-xs text-slate-700">{classification}</span>
              )}
              {ingredient && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">{ingredient}</span>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate(`${ROUTES.ALARM_NEW}?name=${encodeURIComponent(data.name)}`)}
          className="flex h-12 w-full items-center justify-center gap-1.5 rounded-2xl bg-primary font-bold text-white"
        >
          <Bell size={18} />
          복약 알림 설정하기
        </button>

        {!hasEffect && sections.length === 0 ? (
          <p className={`${card} p-5 text-center text-sm text-slate-400`}>등록된 약 정보가 없어요</p>
        ) : (
          <>
            {hasEffect && (
              <section className={`${card} p-5`}>
                <h3 className="mb-3 font-bold text-slate-900">주요 효능</h3>
                <DrugTextBlocks text={data.effect} limit={3} />
              </section>
            )}

            <Accordion.Root type="single" collapsible className="space-y-3">
              {sections.map((section) => (
                <Accordion.Item key={section.value} value={section.value} className={`${card} overflow-hidden`}>
                  <Accordion.Header>
                    <Accordion.Trigger className="group flex w-full items-center justify-between p-5 text-left">
                      <span className="font-bold text-slate-900">{section.title}</span>
                      <ChevronDown
                        size={20}
                        className="text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180"
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="px-5 pb-5">
                      <DrugTextBlocks text={section.text} />
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </>
        )}
      </div>
    </MobileLayout>
  );
}
