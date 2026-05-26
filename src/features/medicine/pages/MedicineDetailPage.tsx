import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../../../layout/MobileLayout";
import { medicineDetailMock } from "../mock/medicine.mock";
import MedicineItemRow from "../components/MedicineItemRow";

export default function MedicineDetailPage() {
  const navigate = useNavigate();
  const data = medicineDetailMock;

  return (
    <MobileLayout>
      <div className="px-5 pt-6">
        <div className="mb-5 flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">약 정보</h1>
        </div>

        <div className="rounded-[28px] bg-[#f8f8f8] p-4">
          <div className="grid grid-cols-3 gap-3">
            {data.gallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`medicine-${index}`}
                className="h-24 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-[24px] bg-[#f8f8f8] p-5">
          <h2 className="text-lg font-bold text-slate-900">💊 {data.title}</h2>
          <p className="mt-4 text-sm text-slate-700">{data.description}</p>

          <div className="mt-4 space-y-2 text-sm">
            <p className="text-green-600">✅ {data.safeMessage}</p>
            <p className="text-amber-600">⚠️ {data.warningMessage}</p>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] bg-white px-4">
          {data.medicines.map((medicine) => (
            <MedicineItemRow key={medicine.id} medicine={medicine} />
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}