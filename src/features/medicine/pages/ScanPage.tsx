// src/features/medicine/pages/ScanPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";

export default function ScanPage() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);

    // 발표용: 1.5초 "분석 중" 후 상세페이지로 이동
    setTimeout(() => {
      navigate("/medicine/1");
    }, 1500);
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
              <p className="mt-4 text-center text-sm text-blue-600">
                💊 알약을 분석하고 있어요...
              </p>
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}