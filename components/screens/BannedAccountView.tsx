'use client';

import React from 'react';
import { motion } from 'motion/react';

interface BannedAccountViewProps {
  email?: string;
  onTryOtherEmail: () => void;
}

export function BannedAccountView({ email, onTryOtherEmail }: BannedAccountViewProps) {
  return (
    <div className="relative w-full min-h-full flex flex-col justify-between bg-[#F8F8F6] text-[#111312] selection:bg-[#B8F45A] selection:text-[#111312] overflow-y-auto no-scrollbar font-sans px-6 py-10">
      <div className="my-auto w-full max-w-sm mx-auto flex flex-col items-center text-center">
        {/* Ban Badge Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
          className="w-20 h-20 rounded-full bg-[#FFF1F2] border-2 border-[#FECDD3] flex items-center justify-center text-3xl mb-6 shadow-sm"
        >
          🚫
        </motion.div>

        {/* Exact User Requested Title */}
        <motion.h1
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-[26px] font-black text-[#111312] tracking-tight leading-tight mb-2"
        >
          Your ID is ban
        </motion.h1>

        {/* Clarifying Explanation */}
        <motion.p
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-xs text-[#525650] leading-relaxed max-w-xs mb-4"
        >
          This account has been deleted by an administrator and cannot be accessed.
        </motion.p>

        {email && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-3.5 py-1.5 rounded-full bg-[#ECECE9] border border-[#D5D5D0] text-[#111312] text-xs font-mono font-semibold mb-8 break-all max-w-[280px]"
          >
            {email}
          </motion.div>
        )}

        {/* Primary Action Button: "Try with other email" */}
        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onTryOtherEmail}
          className="w-full h-12 rounded-2xl bg-[#111312] hover:bg-black text-[#B8F45A] hover:text-white font-bold text-sm tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Try with other email</span>
        </motion.button>
      </div>

      <div className="w-full text-center pt-6">
        <span className="text-[11px] text-[#858980]">
          FitFlow Athletics · Security Enforcement
        </span>
      </div>
    </div>
  );
}
