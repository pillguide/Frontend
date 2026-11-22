import { useSyncExternalStore } from "react";
import { ApiError } from "../../api/http";
import { scanApi, type ScanSessionDetail } from "./api/scanApi";

export type ScanStatus = "idle" | "analyzing" | "failed";

interface Draft {
  file: File | null;
  preview: string | null;
  requestId: string | null;
  result: ScanSessionDetail | null;
  selected: number[];
  generation: number;
  status: ScanStatus;
  error: string;
  /** 서버가 같은 requestId를 거부한 경우(409) — 같은 사진 재시도 불가 */
  conflict: boolean;
}

const EMPTY = {
  file: null,
  preview: null,
  requestId: null,
  result: null,
  selected: [],
  status: "idle" as ScanStatus,
  error: "",
  conflict: false,
};

let state: Draft = { ...EMPTY, generation: 0 };
const listeners = new Set<() => void>();
let controller: AbortController | null = null;

function update(next: Draft) {
  state = next;
  listeners.forEach((listener) => listener());
}

const MAX_BYTES = 10 * 1024 * 1024;

/** 스캔에 쓸 수 없는 사진이면 안내 문구, 괜찮으면 null */
export function validateScanFile(file: File): string | null {
  if (!["image/jpeg", "image/png"].includes(file.type) || file.size > MAX_BYTES)
    return "10MB 이하의 JPG·PNG 사진만 쓸 수 있어요";
  return null;
}

function errorMessage(e: unknown): string {
  if (e instanceof ApiError && e.status === 409) return "사진을 다시 선택해 주세요";
  if (e instanceof ApiError && e.status === 413) return "사진이 너무 커요";
  if (e instanceof ApiError && e.status === 415) return "열 수 없는 사진이에요";
  return "같은 사진으로 다시 시도해 주세요";
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
    update({ ...EMPTY, generation: state.generation + 1 });
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
  /** 현재 사진으로 분석 요청. 결과는 draft.result / status로 전달된다 */
  start: async () => {
    const { file, requestId } = state;
    if (!file || !requestId) return;
    controller?.abort();
    const current = new AbortController();
    controller = current;
    const generation = state.generation + 1;
    update({ ...state, generation, status: "analyzing", error: "", conflict: false, result: null });
    try {
      const result = await scanApi.scan(file, requestId, current.signal);
      if (generation !== state.generation) return;
      controller = null;
      update({ ...state, result, status: "idle" });
    } catch (e) {
      if (generation !== state.generation || current.signal.aborted) return;
      controller = null;
      update({
        ...state,
        status: "failed",
        error: errorMessage(e),
        conflict: e instanceof ApiError && e.status === 409,
      });
    }
  },
  setSelected: (selected: number[]) => update({ ...state, selected }),
  isCurrent: (generation: number) => generation === state.generation,
};

export function useScanDraft() {
  return useSyncExternalStore(scanDraft.subscribe, scanDraft.get);
}

export function isScanDraftRoute(pathname: string, draft: Draft): boolean {
  if (pathname === "/scan" || pathname === "/scan/camera" || pathname === "/scan/result") return true;
  return (
    !!draft.result &&
    draft.result.drugs.some(
      (drug) => pathname === `/medicine/single/${drug.drugId}`,
    )
  );
}
