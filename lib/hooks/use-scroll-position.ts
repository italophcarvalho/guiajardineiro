"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the vertical scroll position (window.scrollY).
 *
 * Used by the post page to reveal the mobile Sticky CTA Bar after the reader
 * scrolls past a threshold (~520px, per the design spec). The listener is
 * passive and throttled to one update per animation frame.
 *
 * @returns the current scrollY in pixels.
 */
export function useScrollPosition(): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        frame = 0;
      });
    };

    // Initialise + subscribe.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return scrollY;
}

export default useScrollPosition;
