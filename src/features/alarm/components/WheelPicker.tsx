// src/features/alarm/components/WheelPicker.tsx
// iOS 스타일 휠 피커 (scroll-snap 기반). 가운데 칸이 선택값.
import { useEffect, useRef } from "react";

export interface WheelOption<T> {
  value: T;
  label: string;
}

interface WheelPickerProps<T> {
  options: WheelOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  itemHeight?: number;
  visibleCount?: number; // 홀수
  className?: string;
}

export default function WheelPicker<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  itemHeight = 40,
  visibleCount = 5,
  className = "",
}: WheelPickerProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const padding = itemHeight * Math.floor(visibleCount / 2);

  // 외부에서 값이 바뀌면(초기 진입 포함) 해당 위치로 스크롤
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = selectedIndex * itemHeight;
    if (Math.abs(el.scrollTop - target) > 1) el.scrollTop = target;
  }, [selectedIndex, itemHeight]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handleScroll = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const index = Math.min(options.length - 1, Math.max(0, Math.round(el.scrollTop / itemHeight)));
      if (options[index].value !== value) onChange(options[index].value);
    }, 80);
  };

  const scrollToIndex = (index: number) => {
    ref.current?.scrollTo({ top: index * itemHeight, behavior: "smooth" });
  };

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={ariaLabel}
      onScroll={handleScroll}
      className={`no-scrollbar relative z-10 snap-y snap-mandatory overflow-y-scroll overscroll-contain ${className}`}
      style={{ height: itemHeight * visibleCount }}
    >
      <div style={{ height: padding }} />
      {options.map((option, index) => {
        const distance = Math.abs(index - selectedIndex);
        return (
          <button
            key={String(option.value)}
            type="button"
            role="option"
            aria-selected={index === selectedIndex}
            onClick={() => scrollToIndex(index)}
            className={`flex w-full snap-center items-center justify-center transition-colors ${
              distance === 0
                ? "text-xl font-semibold text-slate-900"
                : distance === 1
                  ? "text-lg text-slate-400"
                  : "text-base text-slate-300"
            }`}
            style={{ height: itemHeight }}
          >
            {option.label}
          </button>
        );
      })}
      <div style={{ height: padding }} />
    </div>
  );
}
