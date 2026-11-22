import { useEffect, useRef, useState } from "react";
import { ImageOff, Pill } from "lucide-react";
import { drugApi } from "../api/drugApi";

/**
 * 대표 이미지 주소는 백엔드가 10분짜리 서명(S3 presigned URL)을 붙여 주는데, API를 부를 때마다 주소가 바뀐다.
 * 주소가 다르면 브라우저 캐시를 못 쓰고 같은 사진을 매번 다시 받으므로,
 * 같은 약은 처음 받은 주소를 서명이 살아 있는 동안 계속 쓴다 → 두 번째부터는 캐시에서 바로 뜸
 */
const URL_TTL_MS = 9 * 60 * 1000;
const urlCache = new Map<number, { url: string; at: number }>();

function stableUrl(drugId: number, url: string): string {
  const cached = urlCache.get(drugId);
  if (cached && Date.now() - cached.at < URL_TTL_MS) return cached.url;
  urlCache.set(drugId, { url, at: Date.now() });
  return url;
}

/** One automatic URL renewal; an unavailable image never blocks selection.
 *  데이터셋 대표 이미지는 세로로 긴 사진이라 칸을 꽉 채우도록 잘라서(cover) 보여준다.
 *  불러오는 동안은 회색 칸, 다 오면 부드럽게 나타난다. */
export default function RepresentativePhoto({ drugId, url, ready }: {
  drugId: number; url: string | null; ready: boolean;
}) {
  const [current, setCurrent] = useState(() => (url ? stableUrl(drugId, url) : null));
  const [status, setStatus] = useState<"ready" | "loading" | "failed">("ready");
  const [loaded, setLoaded] = useState(false);
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
    urlCache.delete(drugId);
    try {
      const detail = await drugApi.detail(drugId);
      if (!mounted.current) return;
      if (detail.reference?.representativeImageStatus !== "READY" || !detail.imageUrl) {
        setStatus("failed"); return;
      }
      setLoaded(false);
      setCurrent(stableUrl(drugId, detail.imageUrl));
      setStatus("ready");
    } catch {
      if (mounted.current) setStatus("failed");
    }
  }
  if (!ready || !current) return <Pill size={20} className="text-slate-300" aria-label="대표 이미지 준비 중" />;
  if (status === "failed") {
    return (
      <button type="button" onClick={(e) => { e.stopPropagation(); void renew(); }}
        className="flex h-full w-full items-center justify-center text-slate-300" aria-label="이미지 다시 불러오기">
        <ImageOff size={20} />
      </button>
    );
  }
  return (
    <span className="relative block h-full w-full">
      {(!loaded || status === "loading") && <span className="absolute inset-0 animate-pulse bg-slate-200/70" />}
      {status !== "loading" && (
        <img src={current} alt="데이터셋 대표 이미지" loading="lazy" decoding="async"
          className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => { if (!attempted.current) void renew(); else setStatus("failed"); }} />
      )}
    </span>
  );
}
