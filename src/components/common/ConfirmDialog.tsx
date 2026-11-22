// 가운데 뜨는 확인 팝업 (예: "저장하지 않고 나갈까요?")
import { AnimatePresence, motion } from "framer-motion";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** danger: 삭제처럼 되돌릴 수 없는 확인 버튼을 빨간색으로 */
  tone?: "default" | "danger";
}

export default function ConfirmDialog({
  open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, tone = "default",
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-8">
          <motion.button
            type="button"
            aria-label="닫기"
            onClick={onCancel}
            className="absolute inset-0 bg-slate-900/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-label={title}
            className="relative w-full max-w-[340px] rounded-[24px] bg-white p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            {message && <p className="mt-2 text-sm text-slate-500">{message}</p>}
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={onConfirm}
                className={`flex-1 rounded-2xl border py-3 font-bold ${
                  tone === "danger" ? "border-red-200 text-red-500" : "border-primary text-primary"
                }`}
              >
                {confirmLabel}
              </button>
              <button
                type="button"
                onClick={onCancel}
                autoFocus
                className="flex-1 rounded-2xl bg-primary py-3 font-bold text-white"
              >
                {cancelLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
