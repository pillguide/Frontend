import { useEffect, useRef, useState } from "react";
import { drugApi } from "../api/drugApi";

/** One automatic URL renewal; an unavailable image never blocks selection. */
export default function RepresentativePhoto({ drugId, url, ready }: {
  drugId: number; url: string | null; ready: boolean;
}) {
  const [current, setCurrent] = useState(url);
  const [status, setStatus] = useState<"ready" | "loading" | "failed">("ready");
  const attempted = useRef(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  async function renew() {
    if (status === "loading") return;
    attempted.current = true;
    setStatus("loading");
    try {
      const detail = await drugApi.detail(drugId);
      if (!mounted.current) return;
      if (detail.reference?.representativeImageStatus !== "READY" || !detail.imageUrl) {
        setStatus("failed"); return;
      }
      setCurrent(detail.imageUrl);
      setStatus("ready");
    } catch {
      if (mounted.current) setStatus("failed");
    }
  }
  if (!ready || !url) return <span className="px-2 text-center text-xs text-slate-500">대표 이미지 준비 중</span>;
  if (status === "loading") return <span className="text-xs text-slate-500">이미지 불러오는 중...</span>;
  if (status === "failed") return <div className="px-2 text-center text-xs text-slate-500">
    <p>이미지를 불러오지 못했어요.</p>
    <button type="button" onClick={() => void renew()} className="mt-2 text-primary underline">다시 불러오기</button>
  </div>;
  return <img src={current ?? undefined} alt="데이터셋 대표 이미지" className="h-full w-full rounded-xl object-contain"
    onError={() => { if (!attempted.current) void renew(); else setStatus("failed"); }} />;
}
