import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import PageHeader from "../../../components/common/PageHeader";
import LoginRequired from "../../../components/common/LoginRequired";
import { ROUTES } from "../../../constants/routes";
import { authStorage } from "../../../utils/authStorage";
import { ApiError } from "../../../api/http";
import { scanApi } from "../api/scanApi";
import { scanDraft, useScanDraft } from "../scanDraft";

export default function ScanPage() {
  const navigate = useNavigate();
  const draft = useScanDraft();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);
  async function run(file: File, requestId: string) {
    const { generation, signal } = scanDraft.begin();
    setLoading(true);
    setError("");
    setConflict(false);
    try {
      const result = await scanApi.scan(file, requestId, signal);
      if (scanDraft.complete(generation, result)) navigate(ROUTES.SCAN_RESULT);
    } catch (e) {
      if (scanDraft.isCurrent(generation)) {
        setConflict(e instanceof ApiError && e.status === 409);
        setError(
          e instanceof ApiError && e.status === 409
            ? "사진을 다시 선택해 주세요."
            : e instanceof ApiError && e.status === 413
              ? "사진 크기 또는 해상도가 허용 범위를 넘었어요."
              : e instanceof ApiError && e.status === 415
                ? "지원하지 않거나 손상된 사진이에요."
                : "분석하지 못했어요. 같은 사진으로 다시 시도할 수 있어요.",
        );
      }
    } finally {
      if (scanDraft.isCurrent(generation)) setLoading(false);
    }
  }
  function select(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (
      !["image/jpeg", "image/png"].includes(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      setError("10 MiB 이하의 JPEG 또는 PNG 사진을 선택해 주세요.");
      return;
    }
    scanDraft.select(file);
    const current = scanDraft.get();
    void run(file, current.requestId!);
  }
  return (
    <MobileLayout>
      <PageHeader title="알약 스캔" />
      <div className="px-5 pt-6">
        {!authStorage.isLoggedIn() ? (
          <LoginRequired />
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-600">
              알약들을 밝은 곳 흰 배경에 놓고 한 번에 찍어주세요.
            </p>
            {draft.preview && (
              <img
                src={draft.preview}
                alt="선택한 사진"
                className="mb-4 h-64 w-full rounded-2xl bg-white object-contain"
              />
            )}
            {loading ? (
              <>
                <p className="text-center text-sm text-slate-600">
                  사진을 분석하고 있어요...
                </p>
                <button
                  className="mt-4 w-full rounded-xl border p-3"
                  onClick={() => {
                    scanDraft.clear();
                    setLoading(false);
                  }}
                >
                  취소
                </button>
              </>
            ) : (
              <>
                {error && (
                  <p role="alert" className="mb-3 text-sm text-red-600">
                    {error}
                  </p>
                )}
                {draft.file && draft.requestId && !conflict && (
                  <button
                    className="mb-3 w-full rounded-xl bg-primary p-3 text-white"
                    onClick={() => void run(draft.file!, draft.requestId!)}
                  >
                    같은 사진으로 다시 시도
                  </button>
                )}
                <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-300 bg-white text-slate-500">
                  <span className="text-4xl">📷</span>
                  <span className="mt-2 text-sm">
                    {draft.file ? "다른 사진 선택" : "사진 찍기 또는 선택"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    capture="environment"
                    onChange={select}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </>
        )}
      </div>
    </MobileLayout>
  );
}
