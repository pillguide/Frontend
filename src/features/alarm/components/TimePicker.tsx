// src/features/alarm/components/TimePicker.tsx
import WheelPicker, { type WheelOption } from "./WheelPicker";

interface TimePickerProps {
  hour: number;   // 0~23
  minute: number; // 0~59
  onChange: (hour: number, minute: number) => void;
}

const periodOptions: WheelOption<"AM" | "PM">[] = [
  { value: "AM", label: "오전" },
  { value: "PM", label: "오후" },
];
const hourOptions: WheelOption<number>[] = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1),
}));
const minuteOptions: WheelOption<number>[] = Array.from({ length: 60 }, (_, i) => ({
  value: i,
  label: String(i).padStart(2, "0"),
}));

const ITEM_HEIGHT = 44;

export default function TimePicker({ hour, minute, onChange }: TimePickerProps) {
  const period = hour < 12 ? "AM" : "PM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  const to24 = (p: "AM" | "PM", h12: number) => (h12 % 12) + (p === "PM" ? 12 : 0);

  return (
    <div className="relative rounded-[24px] bg-white px-4 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {/* 선택 영역 하이라이트 */}
      <div
        className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-xl bg-primary-50"
        style={{ height: ITEM_HEIGHT }}
      />
      <div className="grid grid-cols-3">
        <WheelPicker
          ariaLabel="오전 오후"
          options={periodOptions}
          value={period}
          itemHeight={ITEM_HEIGHT}
          onChange={(p) => onChange(to24(p, hour12), minute)}
        />
        <WheelPicker
          ariaLabel="시"
          options={hourOptions}
          value={hour12}
          itemHeight={ITEM_HEIGHT}
          onChange={(h) => onChange(to24(period, h), minute)}
        />
        <WheelPicker
          ariaLabel="분"
          options={minuteOptions}
          value={minute}
          itemHeight={ITEM_HEIGHT}
          onChange={(m) => onChange(hour, m)}
        />
      </div>
    </div>
  );
}
