// 스캔 결과 카드 안의 약 정보: 주요 효능은 칸에 펼쳐 두고, 나머지는 칸마다 접고 펼친다
import { ChevronDown } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { toTextItems } from "../utils/drugText";
import DrugTextBlocks from "./DrugTextBlocks";

export interface DrugInfoText {
  effect: string | null;
  sideEffects: string | null;
  dosageMethod: string | null;
  storageMethod: string | null;
}

const box = "rounded-2xl bg-[#f4f5f9]";

export default function DrugInfoRows({ info }: { info: DrugInfoText }) {
  const hasEffect = toTextItems(info.effect).length > 0;
  const rows = [
    { value: "side-effects", title: "부작용", text: info.sideEffects },
    { value: "usage", title: "복용 방법", text: info.dosageMethod },
    { value: "storage", title: "보관 방법", text: info.storageMethod },
  ].filter((row) => toTextItems(row.text).length > 0);

  if (!hasEffect && rows.length === 0)
    return <p className={`${box} p-4 text-center text-sm text-slate-400`}>등록된 약 정보가 없어요</p>;

  return (
    <div className="space-y-2">
      {hasEffect && (
        <section className={`${box} p-4`}>
          <h4 className="mb-2 text-sm font-bold text-slate-900">주요 효능</h4>
          <DrugTextBlocks text={info.effect} limit={3} />
        </section>
      )}
      <Accordion.Root type="single" collapsible className="space-y-2">
        {rows.map((row) => (
          <Accordion.Item key={row.value} value={row.value} className={`${box} overflow-hidden`}>
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between px-4 py-3.5 text-left">
                <span className="text-sm font-bold text-slate-900">{row.title}</span>
                <ChevronDown
                  size={18}
                  className="text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="px-4 pb-4">
                <DrugTextBlocks text={row.text} />
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
