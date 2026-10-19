'use client';

import React from 'react';
import { motion } from 'motion/react';

interface LoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  label?: string;
  className?: string;
}

/**
 * Premium Branded Loading Animation
 * Features an athletic, high-precision dual-ring spinner with spring pulsing.
 */
export function LoadingAnimation({
  size = 'md',
  label,
  className = '',
}: LoadingAnimationProps) {
  const sizeMap = {
    sm: { container: 'w-6 h-6', stroke: 2.5, radius: 10 },
    md: { container: 'w-10 h-10', stroke: 3, radius: 16 },
    lg: { container: 'w-16 h-16', stroke: 3.5, radius: 26 },
    fullscreen: { container: 'w-14 h-14', stroke: 3.5, radius: 22 },
  };

  const { container, stroke, radius } = sizeMap[size];
  const circumference = 2 * Math.PI * radius;

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className={`relative ${container} flex items-center justify-center`}>
        {/* SVG Dual-Ring Athletic Spinner */}
        <svg
          className="w-full h-full animate-spin"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Muted Track */}
          <circle
            cx="30"
            cy="30"
            r={radius}
            stroke="#ECECE9"
            strokeWidth={stroke}
            fill="none"
          />

          {/* Primary Spinning Head */}
          <circle
            cx="30"
            cy="30"
            r={radius}
            stroke="#111312"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.72}
            fill="none"
          />

          {/* Energetic Lime Tip */}
          <circle
            cx="30"
            cy="30"
            r={radius}
            stroke="#B8F45A"
            strokeWidth={stroke + 0.5}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.94}
            fill="none"
          />
        </svg>

        {/* Center Pulsing Energy Core */}
        <motion.div
          animate={{
            scale: [0.75, 1.25, 0.75],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-2 h-2 rounded-full bg-[#111312]"
        />
      </div>

      {label && (
        <span className="text-xs font-semibold text-[#525650] tracking-tight animate-pulse">
          {label}
        </span>
      )}
    </div>
  );

  if (size === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm select-none">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}
