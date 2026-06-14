"use client";

import { StickyCTABar } from "@/components/conversion";
import { useScrollPosition } from "@/lib/hooks/use-scroll-position";

export interface StickyProductCTAProps {
  name: string;
  rating: number | string;
  price: string;
  affiliateUrl: string;
  tint?: string;
  imageSrc?: string;
  ctaLabel?: string;
  /** Scroll distance (px) before the bar slides in. Default 520. */
  threshold?: number;
}

/**
 * Mobile-only scroll-driven affiliate bar.
 *
 * Thin client wrapper around <StickyCTABar>: it watches the scroll position
 * and reveals the bar once the reader passes the threshold (~520px per the
 * design spec). Lives in a Client Component so the article page itself can
 * stay a Server Component.
 */
export function StickyProductCTA({
  threshold = 520,
  ...bar
}: StickyProductCTAProps) {
  const scrollY = useScrollPosition();
  return <StickyCTABar visible={scrollY > threshold} {...bar} />;
}

export default StickyProductCTA;
