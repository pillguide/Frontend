import { useEffect, useState } from "react";
import type { ScanDrugSummary, ScanSessionDetail } from "../api/scanApi";
import RepresentativePhoto from "./RepresentativePhoto";
import { photoCrop } from "../utils/photoCrop";

export default function ReferenceComparison({ drugId, imageUrl, ready, preview, detection, imageSize }: {
  drugId: number; imageUrl: string | null; ready: boolean; preview: string | null;
  detection?: ScanDrugSummary; imageSize: ScanSessionDetail["imageSize"];
}) {
  const [crop, setCrop] = useState<{ source: string; data?: string; failed?: boolean }>();
  const bbox = detection?.bboxXyxy ?? null;
  const source = `${preview ?? ""}:${detection?.detectionId ?? ""}`;
  useEffect(() => {
    if (!preview || !detection) return;
    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (cancelled) return;
      const area = photoCrop(image.naturalWidth, image.naturalHeight, imageSize, bbox);
      if (!area) { setCrop({ source, failed: true }); return; }
      try {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, 480 / Math.max(area.width, area.height));
        canvas.width = Math.max(1, Math.round(area.width * scale));
        canvas.height = Math.max(1, Math.round(area.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("CANVAS_UNAVAILABLE");
        ctx.drawImage(image, area.left, area.top, area.width, area.height, 0, 0, canvas.width, canvas.height);
        setCrop({ source, data: canvas.toDataURL("image/jpeg", 0.9) });
      } catch { setCrop({ source, failed: true }); }
    };
    image.onerror = () => { if (!cancelled) setCrop({ source, failed: true }); };
    image.src = preview;
    return () => { cancelled = true; image.onload = null; image.onerror = null; };
  }, [preview, detection, bbox, imageSize, source]);
  const current = crop?.source === source ? crop : undefined;
  return <section className="mb-4 rounded-2xl bg-white p-4">
    <h3 className="mb-3 text-[15px] font-bold text-slate-900">사진 참고 비교</h3>
    <div className="grid grid-cols-2 gap-2.5">
      <div className="min-w-0">
        <div className="flex h-[140px] items-center justify-center overflow-hidden rounded-xl border border-[#ecedf2]">
          {current?.data ? <img src={current.data} alt={`촬영 사진의 검출 ${detection?.detectionIndex ?? ""} 영역`} className="h-full w-full object-contain" />
            : <p className="px-2 text-center text-xs text-slate-500">{!preview || !detection ? "현재 촬영 사진이 없어요." : current?.failed ? "사진 방향·크기가 맞지 않거나 영역을 표시할 수 없어요." : "촬영 영역 불러오는 중..."}</p>}
        </div>
        <p className="mt-1.5 text-center text-xs text-slate-500">내가 찍은 사진</p>
      </div>
      <div className="min-w-0">
        <div className="flex h-[140px] items-center justify-center overflow-hidden rounded-xl border border-[#ecedf2]">
          <RepresentativePhoto key={`${drugId}:${imageUrl}`} drugId={drugId} url={imageUrl} ready={ready} />
        </div>
        <p className="mt-1.5 text-center text-xs text-slate-500">데이터셋 대표 이미지</p>
      </div>
    </div>
    <p className="mt-3 text-xs leading-relaxed text-slate-500">참고용 이미지예요. 촬영한 면과 조명에 따라 다르게 보일 수 있어요. 다른 약으로 보이면 다시 촬영하거나 저장에서 제외해 주세요.</p>
    {(!preview || !detection) && <p className="mt-2 text-xs text-slate-500">사용자 사진은 보관하지 않아 과거 이력이나 새로고침 후에는 다시 표시할 수 없어요.</p>}
  </section>;
}
