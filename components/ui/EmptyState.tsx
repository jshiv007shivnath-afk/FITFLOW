import React from 'react';
import { motion } from 'motion/react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`w-full bg-white rounded-2xl p-6 sm:p-8 border border-[#ECECE9] shadow-2xs flex flex-col items-center text-center ${className}`}
    >
      {icon ? (
        <div className="w-12 h-12 rounded-2xl bg-[#F4F5F2] text-[#111312] flex items-center justify-center mb-3.5 shadow-2xs">
          {icon}
        </div>
      ) : (
        <div className="w-12 h-12 rounded-2xl bg-[#F4F5F2] text-[#111312] font-extrabold text-xl flex items-center justify-center mb-3.5 shadow-2xs">
          F
        </div>
      )}

      <h3 className="text-base font-bold text-[#111312] tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-xs text-[#525650] max-w-xs leading-relaxed mb-5">
        {description}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs justify-center">
          {actionLabel && onAction && (
            <motion.button
              type="button"
              onClick={onAction}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto h-10 px-5 rounded-xl bg-[#111312] text-white text-xs font-semibold hover:bg-black transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              {actionLabel}
            </motion.button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <motion.button
              type="button"
              onClick={onSecondaryAction}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto h-10 px-4 rounded-xl bg-[#F4F5F2] text-[#111312] text-xs font-medium hover:bg-[#EAECE8] transition-colors flex items-center justify-center"
            >
              {secondaryActionLabel}
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}
