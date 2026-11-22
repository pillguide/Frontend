// 약 정보(효능·부작용·복용 방법·보관 방법)를 접고 펼치는 줄 목록으로 보여준다
import { ChevronDown } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { toTextItems } from "../utils/drugText";

export interface DrugInfoText {
  effect: string | null;
  sideEffects: string | null;
  dosageMethod: string | null;
  storageMethod: string | null;
}

export default function DrugInfoRows({ info }: { info: DrugInfoText }) {
  const rows = [
    { value: "effect", title: "효능", items: toTextItems(info.effect) },
    { value: "side-effects", title: "부작용", items: toTextItems(info.sideEffects) },
    { value: "usage", title: "복용 방법", items: toTextItems(info.dosageMethod) },
    { value: "storage", title: "보관 방법", items: toTextItems(info.storageMethod) },
  ].filter((row) => row.items.length > 0);

  if (rows.length === 0) return <p className="py-3 text-sm text-slate-400">등록된 약 정보가 없어요</p>;

  return (
    <Accordion.Root type="single" collapsible defaultValue={rows[0].value}>
      {rows.map((row) => (
        <Accordion.Item key={row.value} value={row.value} className="border-t border-slate-100 first:border-t-0">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between py-3 text-left">
              <span className="text-sm font-bold text-slate-900">{row.title}</span>
              <ChevronDown
                size={18}
                className="text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <ul className="space-y-1 pb-3 text-sm text-slate-600">
              {row.items.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
