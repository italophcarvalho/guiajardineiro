"use client";

import { useEffect } from "react";

export interface ToastProps {
  message: string;
  /** Called after the toast auto-dismisses (~2.6s). */
  onDone: () => void;
}

/**
 * Fixed bottom-center toast notification.
 * Enters with `animate-toast` (defined in tailwind.config.ts keyframes).
 * Auto-dismisses after 2.6s via the `onDone` callback.
 */
export function Toast({ message, onDone }: ToastProps) {
  useEffect(() => {
    const id = setTimeout(onDone, 2600);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-toast whitespace-nowrap rounded-[12px] bg-green-900 px-5 py-3.5 font-inter text-[14.5px] font-semibold text-white shadow-toast"
    >
      {message}
    </div>
  );
}

export default Toast;
