// src/features/medicine/pages/ScanResultPage.tsx
// 스캔 직후 결과 화면 (데모). AI 서버 연동 전까지 mock 결과를 보여준다.
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import { medicineDetailMock } from "../mock/medicine.mock";
import MedicineItemRow from "../components/MedicineItemRow";
import PageHeader from "../../../components/common/PageHeader";

export default function ScanResultPage() {
  const navigate = useNavigate();
  const data = medicineDetailMock;

  return (
    <MobileLayout>
      <PageHeader title="스캔 결과" />

      <div className="bg-slate-50 px-5 pt-6 pb-10">
        {/* Gallery */}
        <div className="rounded-[28px] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-3 gap-3">
            {data.gallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`medicine-${index}`}
                className="h-24 w-full rounded-2xl object-contain"
              />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-[24px] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-lg font-bold text-slate-900">💊 {data.title}</h2>
          <p className="mt-3 text-sm text-slate-700">{data.description}</p>

          <div className="mt-4 space-y-2 text-sm">
            {data.safeMessage && (
              <p className="text-green-600">✅ {data.safeMessage}</p>
            )}
            {data.warningMessage && (
              <p className="rounded-xl bg-amber-50 p-3 text-amber-700">
                ⚠️ {data.warningMessage}
              </p>
            )}
          </div>
        </div>

        {/* Medicines list */}
        <div className="mt-6">
          <p className="mb-3 text-base font-bold text-slate-900">포함된 약</p>
          <div className="space-y-2.5">
            {data.medicines.map((medicine) => (
              <MedicineItemRow
                key={medicine.id}
                medicine={medicine}
                onClick={() => navigate(`/scan/result/medicine/${medicine.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}