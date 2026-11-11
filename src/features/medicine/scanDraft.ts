import { useSyncExternalStore } from "react";
import type { ScanSessionDetail } from "./api/scanApi";
interface Draft {
  file: File | null;
  preview: string | null;
  requestId: string | null;
  result: ScanSessionDetail | null;
  selected: number[];
  generation: number;
}
let state: Draft = {
  file: null,
  preview: null,
  requestId: null,
  result: null,
  selected: [],
  generation: 0,
};
const listeners = new Set<() => void>();
let controller: AbortController | null = null;
function update(next: Draft) {
  state = next;
  listeners.forEach((listener) => listener());
}
export const scanDraft = {
  get: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  clear: () => {
    controller?.abort();
    controller = null;
    if (state.preview) URL.revokeObjectURL(state.preview);
    update({
      file: null,
      preview: null,
      requestId: null,
      result: null,
      selected: [],
      generation: state.generation + 1,
    });
  },
  select: (file: File) => {
    scanDraft.clear();
    update({
      ...state,
      file,
      preview: URL.createObjectURL(file),
      requestId: crypto.randomUUID(),
    });
  },
  begin: () => {
    controller?.abort();
    controller = new AbortController();
    update({ ...state, generation: state.generation + 1 });
    return { generation: state.generation, signal: controller.signal };
  },
  complete: (generation: number, result: ScanSessionDetail) => {
    if (generation !== state.generation) return false;
    controller = null;
    update({ ...state, result });
    return true;
  },
  setSelected: (selected: number[]) => update({ ...state, selected }),
  isCurrent: (generation: number) => generation === state.generation,
};
export function useScanDraft() {
  return useSyncExternalStore(scanDraft.subscribe, scanDraft.get);
}

export function isScanDraftRoute(pathname: string, draft: Draft): boolean {
  if (pathname === "/scan" || pathname === "/scan/result") return true;
  return (
    !!draft.result &&
    draft.result.drugs.some(
      (drug) => pathname === `/medicine/single/${drug.drugId}`,
    )
  );
}
