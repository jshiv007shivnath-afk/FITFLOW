'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFitFlow } from '@/context/FitFlowContext';

/**
 * DynamicIslandToast
 * An ultra-crafted Apple Dynamic Island notification HUD.
 * Morphing fluidly between idle hardware pill and active health activity HUD.
 * Designed according to anti-slop principles: zero collisions, purposeful vectors,
 * WCAG-compliant contrast, and physics-driven spring motion.
 */
export function DynamicIslandToast() {
  const { toastMessage, dismissToast } = useFitFlow();

  const isExpanded = Boolean(toastMessage);

  return (
    <div className="relative flex items-center justify-center select-none">
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 460,
          damping: 28,
          mass: 0.8,
        }}
        onClick={isExpanded ? dismissToast : undefined}
        role={isExpanded ? 'status' : undefined}
        aria-live={isExpanded ? 'polite' : undefined}
        className={`bg-black text-white rounded-full flex items-center justify-between border border-white/[0.12] shadow-[0_12px_32px_rgba(0,0,0,0.5),_inset_0_1px_1.5px_rgba(255,255,255,0.18)] transition-colors ${
          isExpanded
            ? 'h-[38px] px-3.5 py-1.5 min-w-[210px] max-w-[340px] cursor-pointer'
            : 'h-[30px] w-[120px] px-3 pointer-events-none'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isExpanded ? (
            <motion.div
              key="expanded-content"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.16, ease: [0.2, 0.9, 0.3, 1] }}
              className="flex items-center justify-between w-full gap-2.5 overflow-hidden"
            >
              {/* Handcrafted Vector Activity Rings (Move, Exercise, Stand) */}
              <div className="w-5 h-5 shrink-0 relative flex items-center justify-center" aria-hidden="true">
                <svg viewBox="0 0 28 28" className="w-5 h-5 -rotate-90 transform">
                  {/* Outer Ring (Move / Burn - Coral Flame) */}
                  <circle cx="14" cy="14" r="11" fill="none" stroke="#371018" strokeWidth="2.5" />
                  <circle
                    cx="14"
                    cy="14"
                    r="11"
                    fill="none"
                    stroke="#FA114F"
                    strokeWidth="2.5"
                    strokeDasharray="69.1"
                    strokeDashoffset="18"
                    strokeLinecap="round"
                  />
                  {/* Middle Ring (Exercise - FitFlow Electric Lime) */}
                  <circle cx="14" cy="14" r="7.5" fill="none" stroke="#182E06" strokeWidth="2.5" />
                  <circle
                    cx="14"
                    cy="14"
                    r="7.5"
                    fill="none"
                    stroke="#B8F45A"
                    strokeWidth="2.5"
                    strokeDasharray="47.1"
                    strokeDashoffset="12"
                    strokeLinecap="round"
                  />
                  {/* Inner Ring (Stand - Electric Cyan) */}
                  <circle cx="14" cy="14" r="4" fill="none" stroke="#062230" strokeWidth="2.2" />
                  <circle
                    cx="14"
                    cy="14"
                    r="4"
                    fill="none"
                    stroke="#00E5FF"
                    strokeWidth="2.2"
                    strokeDasharray="25.1"
                    strokeDashoffset="7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Message Typography */}
              <span className="text-[12.5px] font-semibold text-white tracking-[-0.01em] truncate leading-tight flex-1">
                {toastMessage}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="idle-hardware"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-center justify-between w-full"
              aria-hidden="true"
            >
              {/* Camera Lens Aperture Cutout with Glass Reflection */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#050810] ring-1 ring-white/10 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#0c1326]" />
              </div>

              {/* Microphone / Ambient Light Sensor Dot */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#070b14] ring-1 ring-white/10" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
