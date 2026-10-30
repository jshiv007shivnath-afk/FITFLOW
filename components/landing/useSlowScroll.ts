'use client';

import { useEffect } from 'react';

/**
 * useSlowScroll hook provides a smooth, luxurious momentum scroll experience on desktop
 * while preserving native high-refresh-rate touch gestures on mobile devices.
 */
export function useSlowScroll(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Skip on touch devices or if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (prefersReducedMotion || isTouchDevice) return;

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let isRunning = false;
    let rafId = 0;

    const ease = 0.085; // Luxurious deceleration factor

    const onWheel = (e: WheelEvent) => {
      // Don't intercept if user is inside a horizontally scrollable element
      let target = e.target as HTMLElement | null;
      while (target && target !== document.body) {
        if (target.scrollWidth > target.clientWidth && ['auto', 'scroll'].includes(getComputedStyle(target).overflowX)) {
          return;
        }
        target = target.parentElement;
      }

      e.preventDefault();

      // Normalize wheel delta across browsers and mouse vs trackpad
      const delta = e.deltaY;
      targetY += delta * 1.05;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetY = Math.max(0, Math.min(targetY, maxScroll));

      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      currentY += (targetY - currentY) * ease;

      if (Math.abs(targetY - currentY) < 0.5) {
        currentY = targetY;
        window.scrollTo(0, currentY);
        isRunning = false;
        return;
      }

      window.scrollTo(0, currentY);
      rafId = requestAnimationFrame(tick);
    };

    // Sync targetY if window is scrolled by other means (keyboard, scrollbar drag)
    const onNativeScroll = () => {
      if (!isRunning) {
        targetY = window.scrollY;
        currentY = window.scrollY;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onNativeScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onNativeScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enabled]);
}
