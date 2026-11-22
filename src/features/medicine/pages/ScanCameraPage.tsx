// 약 스캔 - 촬영 가이드 (앱 안 카메라). 카메라를 못 열면 기기 기본 카메라로 넘긴다
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon, X, Zap, ZapOff } from "lucide-react";
import { useStartScan } from "../context/scanSheet";

type CameraState = "starting" | "ready" | "unavailable";
const canOpenCamera = () => typeof navigator !== "undefined" && !!navigator.mediaDevices && "getUserMedia" in navigator.mediaDevices;
type TorchCapabilities = MediaTrackCapabilities & { torch?: boolean };

export default function ScanCameraPage() {
  const navigate = useNavigate();
  const startScan = useStartScan();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camera, setCamera] = useState<CameraState>(() =>
    canOpenCamera() ? "starting" : "unavailable",
  );
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [shooting, setShooting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!canOpenCamera()) return;
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1440 } },
        audio: false,
      })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        const caps = stream.getVideoTracks()[0]?.getCapabilities?.() as TorchCapabilities | undefined;
        setTorchSupported(!!caps?.torch);
        setCamera("ready");
      })
      .catch(() => {
        if (!cancelled) setCamera("unavailable");
      });
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn } as MediaTrackConstraintSet] });
      setTorchOn(!torchOn);
    } catch {
      setTorchSupported(false);
    }
  };

  const shoot = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || shooting) return;
    setShooting(true);
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        setShooting(false);
        if (!blob) return;
        streamRef.current?.getTracks().forEach((t) => t.stop());
        startScan(new File([blob], `scan-${Date.now()}.jpg`, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );
  };

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) startScan(file);
  };

  const roundButton = "flex size-12 items-center justify-center rounded-full bg-white/15 text-white";

  return (
    <div className="flex h-dvh justify-center bg-black">
      <div className="relative flex h-full w-full max-w-[420px] flex-col text-white">
        <header className="relative flex h-14 items-center justify-center">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-2" aria-label="닫기">
            <X size={24} />
          </button>
          <h1 className="text-base font-bold">알약 스캔</h1>
        </header>

        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 h-full w-full object-cover ${camera === "ready" ? "" : "invisible"}`}
          />
          {camera === "unavailable" ? (
            <div className="relative flex flex-col items-center gap-4 px-8 text-center">
              <p className="text-sm text-white/80">카메라를 열 수 없어요</p>
              <label className="cursor-pointer rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900">
                기본 카메라로 찍기
                <input type="file" accept="image/jpeg,image/png" capture="environment" onChange={pick} className="hidden" />
              </label>
            </div>
          ) : (
            <>
              <div className="relative aspect-square w-[80%]">
                <span className="absolute left-0 top-0 size-10 rounded-tl-2xl border-l-4 border-t-4 border-white" />
                <span className="absolute right-0 top-0 size-10 rounded-tr-2xl border-r-4 border-t-4 border-white" />
                <span className="absolute bottom-0 left-0 size-10 rounded-bl-2xl border-b-4 border-l-4 border-white" />
                <span className="absolute bottom-0 right-0 size-10 rounded-br-2xl border-b-4 border-r-4 border-white" />
              </div>
              <p className="relative mt-5 text-center text-sm leading-relaxed text-white/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
                알약을 밝은 단색 배경 위에
                <br />
                겹치지 않게 놓아 주세요
              </p>
            </>
          )}
        </div>

        <div className="flex items-center justify-between px-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-6">
          <label className={`${roundButton} cursor-pointer`} aria-label="앨범에서 선택">
            <ImageIcon size={22} />
            <input type="file" accept="image/jpeg,image/png" onChange={pick} className="hidden" />
          </label>
          <button
            type="button"
            onClick={shoot}
            disabled={camera !== "ready" || shooting}
            aria-label="촬영"
            className="flex size-[76px] items-center justify-center rounded-full border-4 border-white disabled:opacity-40"
          >
            <span className="size-[60px] rounded-full bg-white transition active:scale-90" />
          </button>
          {torchSupported ? (
            <button type="button" onClick={() => void toggleTorch()} className={roundButton} aria-label="플래시">
              {torchOn ? <Zap size={22} fill="currentColor" /> : <ZapOff size={22} />}
            </button>
          ) : (
            <span className="size-12" />
          )}
        </div>
      </div>
    </div>
  );
}
