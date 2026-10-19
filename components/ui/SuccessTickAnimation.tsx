'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SuccessTickAnimationProps {
  show: boolean;
  onComplete?: () => void;
  durationMs?: number;
  size?: number;
}

/**
 * High-end Payment-Style Success Tick Animation
 * Recreates the iconic Apple Pay / Google Pay / CRED animated success checkmark.
 * Pure, isolated checkmark animation with SVG stroke drawing & spring physics.
 */
export function SuccessTickAnimation({
  show,
  onComplete,
  durationMs = 900,
  size = 96,
}: SuccessTickAnimationProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onCompleteRef.current?.();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [show, durationMs]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md select-none"
        >
          {/* Animated Card Container */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 24,
            }}
            className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white shadow-2xl border border-[#ECECE9]"
            style={{ width: size + 64, height: size + 64 }}
          >
            {/* SVG Checkmark */}
            <svg
              width={size}
              height={size}
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible"
            >
              {/* Outer Glowing Circle Background */}
              <motion.circle
                cx="26"
                cy="26"
                r="25"
                fill="#F2FBF0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }}
              />

              {/* Outer Perimeter Circle Stroke (Draws in) */}
              <motion.circle
                cx="26"
                cy="26"
                r="24"
                stroke="#15803D"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="transparent"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}
              />

              {/* Success Tick Checkmark (Draws from left to right) */}
              <motion.path
                d="M14.5 26.5 L22.5 34.5 L37.5 17.5"
                stroke="#15803D"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="transparent"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.45,
                  ease: 'easeOut',
                  delay: 0.35,
                }}
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
