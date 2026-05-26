import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";

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
    // 나중에 진짜 연결되면 여기서 API 호출하고, 받은 id로 이동하면 됨
    setTimeout(() => {
      navigate("/medicine/1"); // 이미 만들어둔 MedicineDetailPage로 이동
    }, 1500);
  }

  return (
    <MobileLayout>
      <div className="px-5 pt-6">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">알약 스캔</h1>
        </div>

        <p className="mb-4 text-sm text-slate-600">
          알약들을 밝은 곳 흰 배경에 놓고 한 번에 찍어주세요.
        </p>

        {!preview && (
          <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-300 bg-[#f8f8f8] text-slate-400">
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
          <div className="rounded-[24px] bg-[#f8f8f8] p-4">
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