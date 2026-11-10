// src/features/alarm/components/WheelPicker.tsx
// iOS 스타일 휠 피커. 가운데 칸이 선택값.
// 브라우저 기본 스크롤(관성)을 쓰면 살짝만 끌어도 한 번에 쭉 넘어가서,
// 손가락/마우스를 끈 거리만큼만 움직이도록 직접 드래그를 처리한다.
// - 드래그: 끈 거리 1:1로 이동, 놓을 때 아주 약한 관성(최대 2칸)만 적용
// - 마우스 휠: 딸깍 1번에 1칸 / 트랙패드: 쓸기 1번에 1칸 (손 뗀 뒤 관성 무시)
// - 키보드 ↑↓, 항목 클릭으로도 선택 가능
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

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

const MAX_MOMENTUM_ITEMS = 2; // 놓을 때 관성으로 더 갈 수 있는 최대 칸 수
const MOMENTUM_MS = 120; // 놓는 순간 속도 × 이 시간만큼만 더 이동
const WHEEL_STEP_PX = 30; // 트랙패드 누적 이동량이 이만큼이면 1칸
const WHEEL_NOTCH_PX = 50; // 한 번에 이 이상 오면 마우스 휠 딸깍 1번으로 봄
const WHEEL_GESTURE_GAP_MS = 220; // 휠 이벤트가 이만큼 끊기면 새 동작
const TAP_SLOP_PX = 6; // 이보다 적게 움직였으면 드래그가 아니라 탭

export default function WheelPicker<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  itemHeight = 40,
  visibleCount = 5,
  className = "",
}: WheelPickerProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; startOffset: number; moved: boolean; samples: { y: number; t: number }[] } | null>(null);
  const wheel = useRef({ lastTime: -Infinity, accum: 0, locked: false });
  const [dragOffset, setDragOffset] = useState<number | null>(null);

  const maxIndex = options.length - 1;
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const offset = dragOffset ?? selectedIndex * itemHeight; // 위에서부터 몇 px 내려왔는지
  const centerIndex = Math.min(maxIndex, Math.max(0, Math.round(offset / itemHeight)));
  const padding = itemHeight * Math.floor(visibleCount / 2);

  const clampIndex = (i: number) => Math.min(maxIndex, Math.max(0, i));
  const select = (index: number) => {
    const next = options[clampIndex(index)];
    if (next && next.value !== value) onChange(next.value);
  };

  // 범위 밖으로 끌면 고무줄처럼 덜 움직이게
  const rubberBand = (raw: number) => {
    const max = maxIndex * itemHeight;
    if (raw < 0) return raw / 3;
    if (raw > max) return max + (raw - max) / 3;
    return raw;
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startY: e.clientY, startOffset: offset, moved: false, samples: [{ y: e.clientY, t: e.timeStamp }] };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.abs(dy) < TAP_SLOP_PX) return;
    d.moved = true;
    d.samples.push({ y: e.clientY, t: e.timeStamp });
    if (d.samples.length > 6) d.samples.shift();
    setDragOffset(rubberBand(d.startOffset - dy));
  };

  const finishDrag = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;

    if (!d.moved) {
      // 탭: 누른 위치의 항목 선택
      const rect = e.currentTarget.getBoundingClientRect();
      const fromCenter = e.clientY - (rect.top + rect.height / 2);
      setDragOffset(null);
      select(selectedIndex + Math.round(fromCenter / itemHeight));
      return;
    }

    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const dt = Math.max(1, last.t - first.t);
    const velocity = (last.y - first.y) / dt; // px/ms, 아래로 끌면 +
    const momentum = Math.max(-MAX_MOMENTUM_ITEMS * itemHeight, Math.min(MAX_MOMENTUM_ITEMS * itemHeight, -velocity * MOMENTUM_MS));
    const current = rubberBand(d.startOffset - (last.y - d.startY));
    setDragOffset(null);
    select(Math.round((current + momentum) / itemHeight));
  };

  // 휠은 페이지 스크롤을 막아야 해서 passive: false 로 직접 등록
  // - 마우스 휠(한 칸씩 딸깍): 딸깍 한 번 = 1칸
  // - 트랙패드(작은 값이 연달아 + 손 뗀 뒤 관성 이벤트): 쓸어내리는 동작 한 번 = 1칸
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * WHEEL_STEP_PX : e.deltaY; // 줄 단위 → px
      if (delta === 0) return;
      const w = wheel.current;
      const isNotch = Math.abs(delta) >= WHEEL_NOTCH_PX;

      if (e.timeStamp - w.lastTime > WHEEL_GESTURE_GAP_MS) {
        // 잠깐 멈췄다가 다시 굴리면 새 동작
        w.locked = false;
        w.accum = 0;
      }
      w.lastTime = e.timeStamp;

      let direction = 0;
      if (isNotch) {
        direction = Math.sign(delta);
      } else if (!w.locked) {
        w.accum += delta;
        if (Math.abs(w.accum) >= WHEEL_STEP_PX) {
          direction = Math.sign(w.accum);
          w.locked = true; // 이번 쓸기 동작(관성 포함)은 1칸으로 끝
        }
      }
      if (direction === 0) return;
      const next = options[Math.min(options.length - 1, Math.max(0, selectedIndex + direction))];
      if (next && next.value !== value) onChange(next.value);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [options, selectedIndex, value, onChange]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") select(selectedIndex + 1);
    else if (e.key === "ArrowUp") select(selectedIndex - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={rootRef}
      role="listbox"
      aria-label={ariaLabel}
      aria-activedescendant={`${ariaLabel}-${selectedIndex}`}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onKeyDown={onKeyDown}
      className={`relative z-10 cursor-grab touch-none select-none overflow-hidden outline-none active:cursor-grabbing ${className}`}
      style={{ height: itemHeight * visibleCount }}
    >
      <div
        className={dragOffset === null ? "transition-transform duration-200 ease-out" : ""}
        style={{ transform: `translateY(${padding - offset}px)` }}
      >
        {options.map((option, index) => {
          const distance = Math.abs(index - centerIndex);
          return (
            <div
              key={String(option.value)}
              id={`${ariaLabel}-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              className={`flex w-full items-center justify-center transition-colors ${
                distance === 0
                  ? "text-xl font-semibold text-slate-900"
                  : distance === 1
                    ? "text-lg text-slate-400"
                    : "text-base text-slate-300"
              }`}
              style={{ height: itemHeight }}
            >
              {option.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
