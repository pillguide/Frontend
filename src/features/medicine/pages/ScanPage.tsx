// src/features/medicine/pages/ScanPage.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";

const TOTAL_MS = 6000;

function remainingText(progress: number, totalMs: number): string {
  const remainingMs = ((100 - progress) / 100) * totalMs;
  const sec = Math.ceil(remainingMs / 1000);
  if (sec >= 60) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}분 ${s}초`;
  }
  return `${sec}초`;
}

export default function ScanPage() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setProgress(0);

    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.floor((elapsed / TOTAL_MS) * 100), 99);
      setProgress(pct);
    }, 100);

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      toast.success("분석이 완료됐어요!");
      navigate("/medicine/1"); // 300ms 딜레이 제거하고 바로 이동
    }, TOTAL_MS);
  }

  return (
    <MobileLayout>
      <PageHeader title="알약 스캔" />

      <div className="px-5 pt-6">
        <p className="mb-4 text-sm text-slate-600">
          알약들을 밝은 곳 흰 배경에 놓고 한 번에 찍어주세요.
        </p>

        {!preview && (
          <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-300 bg-white text-slate-400 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <span className="text-5xl">📷</span>
            <span className="mt-3 text-sm">사진 찍기</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}

        {preview && (
          <div className="rounded-[24px] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <img
              src={preview}
              alt="찍은 알약"
              className="h-64 w-full rounded-2xl object-cover"
            />
            {loading && (
              <div className="mt-4 space-y-2">
                {progress < 100 && (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-base">💊</span>
                      <p className="text-sm font-semibold text-slate-700">
                        분석 완료까지{" "}
                        <span className="text-[#534AB7]">
                          {remainingText(progress, TOTAL_MS)}
                        </span>{" "}
                        남았어요
                      </p>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full transition-all duration-100"
                        style={{ width: `${progress}%`, backgroundColor: "#534AB7" }}
                      />
                    </div>
                    <p className="text-right text-xs text-slate-400 text-black">{progress}%</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}