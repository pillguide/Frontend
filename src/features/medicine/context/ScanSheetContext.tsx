// 카메라 버튼을 누르면 지금 보고 있는 화면 위에 "사진 가져오기" 시트를 띄운다
import { useCallback, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Camera, ChevronRight, Image as ImageIcon } from "lucide-react";
import BottomSheet from "../../../components/common/BottomSheet";
import { ROUTES } from "../../../constants/routes";
import { authStorage } from "../../../utils/authStorage";
import { isScanDraftRoute, scanDraft } from "../scanDraft";
import { ScanSheetContext, useStartScan } from "./scanSheet";

export function ScanSheetProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const startScan = useStartScan();

  const openSheet = useCallback(() => {
    if (!authStorage.isLoggedIn()) {
      navigate(ROUTES.SCAN);
      return;
    }
    setOpen(true);
  }, [navigate]);

  const openCamera = () => {
    setOpen(false);
    navigate(ROUTES.SCAN_CAMERA, { replace: isScanDraftRoute(pathname, scanDraft.get()) });
  };

  const pickFromAlbum = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    setOpen(false);
    if (file) startScan(file);
  };

  const row = "flex w-full cursor-pointer items-center gap-3 rounded-2xl py-3 active:bg-slate-50";
  const icon = "flex size-11 items-center justify-center rounded-full bg-primary-50 text-primary";

  return (
    <ScanSheetContext.Provider value={openSheet}>
      {children}
      <BottomSheet open={open} onClose={() => setOpen(false)} title="사진 가져오기">
        <button type="button" className={row} onClick={openCamera}>
          <span className={icon}><Camera size={22} /></span>
          <span className="flex-1 text-left font-medium text-slate-900">사진 찍기</span>
          <ChevronRight size={20} className="text-slate-400" />
        </button>
        <label className={row}>
          <span className={icon}><ImageIcon size={22} /></span>
          <span className="flex-1 text-left font-medium text-slate-900">앨범에서 선택</span>
          <ChevronRight size={20} className="text-slate-400" />
          <input type="file" accept="image/jpeg,image/png" onChange={pickFromAlbum} className="hidden" />
        </label>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-3 w-full py-2 text-sm text-slate-500"
        >
          취소
        </button>
      </BottomSheet>
    </ScanSheetContext.Provider>
  );
}
