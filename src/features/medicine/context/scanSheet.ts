// 카메라 시트 열기 / 고른 사진으로 분석 시작 — 어디서든 쓰는 훅
import { createContext, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ROUTES } from "../../../constants/routes";
import { isScanDraftRoute, scanDraft, validateScanFile } from "../scanDraft";

export const ScanSheetContext = createContext<() => void>(() => {});

/** 지금 화면 위에 "사진 가져오기" 시트를 연다 */
export const useScanSheet = () => useContext(ScanSheetContext);

/**
 * 스캔 플로우 안(/scan, /scan/camera, /scan/result …)에서 이동할 때는 replace를 써서
 * 히스토리에 [시트를 연 화면, 스캔 화면 하나]만 남긴다 → 뒤로 가기 한 번이면 시트를 연 화면으로 돌아감
 */
export function useStartScan() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return useCallback(
    (file: File) => {
      const error = validateScanFile(file);
      if (error) {
        toast.error(error);
        return;
      }
      const inFlow = isScanDraftRoute(pathname, scanDraft.get());
      scanDraft.select(file);
      void scanDraft.start();
      if (pathname !== ROUTES.SCAN) navigate(ROUTES.SCAN, { replace: inFlow });
    },
    [navigate, pathname],
  );
}
