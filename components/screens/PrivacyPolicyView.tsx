'use client';

import React from 'react';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { useFitFlow } from '@/context/FitFlowContext';
import { ArrowLeft, ShieldTick, Lock, Eye, Trash2, DocumentText } from 'reicon-react';

export function PrivacyPolicyView() {
  const { setShowPrivacyPolicy, showToast } = useFitFlow();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.02,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 440,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col w-full pb-28 px-5 pt-4 bg-[#F8F8F6] text-[#111312]"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8EAE5]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowPrivacyPolicy(false)}
            aria-label="Back"
            className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#111312] hover:bg-[#F4F5F2] active:scale-95 transition"
            type="button"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="w-8 h-8 rounded-xl bg-[#E5FBC5] flex items-center justify-center text-[#456800]">
            <ShieldTick size={18} />
          </div>
          <div>
            <h1 className="text-[18px] font-bold tracking-tight text-[#111312]">Privacy Policy</h1>
            <span className="text-xs text-[#525650]">Updated October 2026 · GDPR &amp; HIPAA Compliant</span>
          </div>
        </div>
      </motion.div>

      {/* Hero Badge */}
      <motion.div variants={itemVariants} className="w-full bg-[#E5FBC5] rounded-2xl p-5 mb-4 flex items-start gap-3 border border-[#B8F45A]/40 shadow-xs">
        <div className="w-10 h-10 rounded-full bg-[#B8F45A] flex items-center justify-center text-[#111312] shrink-0 font-bold text-lg">
          <ShieldTick size={22} className="text-[#111312]" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-[15px] font-bold text-[#111312]">Your Health Data Stays Yours</h2>
          <p className="text-xs text-[#434937] leading-relaxed mt-1">
            FitFlow saves your workouts, water, calories, and health data on your device. We never sell your personal data.
          </p>
        </div>
      </motion.div>

      {/* Privacy Cards List (Long & Deep Scroll) */}
      <div className="flex flex-col gap-3">
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#E4F7FE] flex items-center justify-center text-[#42BFEF]">
              <Lock size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">1. On-Device Encryption</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            All sensitive wellness metrics (bodyweight, pacing, nutrition, and workout logs) are sealed with AES-256 encryption. Only you hold the decryption keys via Face ID or device passcode.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0DF] flex items-center justify-center text-[#FF9D42]">
              <Eye size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">2. Zero Advertising &amp; Tracking</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            FitFlow has no ads or outside trackers. What you log stays private on your phone.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#DFF8EE] flex items-center justify-center text-[#43D69C]">
              <ShieldTick size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">3. HealthKit &amp; Google Fit Sync</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            Syncing with Apple Health or Google Fit is 100% opt-in. You can revoke access anytime in your system settings without affecting core app functionality or historical trends.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#E8F3FF] flex items-center justify-center text-[#1E88E5]">
              <DocumentText size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">4. Local Secure Enclave Storage</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            Your name and profile details are locked on your device. Other apps cannot see or copy your info.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFE4E6] flex items-center justify-center text-[#FF626C]">
                <Trash2 size={16} />
              </div>
              <h3 className="text-sm font-bold text-[#111312]">5. Right to Permanent Erasure</h3>
            </div>
            <button
              onClick={() => showToast('All local cache and telemetry purged')}
              className="px-3 py-1 rounded-full bg-[#FFE4E6] text-[#FF626C] text-xs font-bold active:scale-95 transition"
              type="button"
            >
              Wipe Data
            </button>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            You are in complete control. Delete your history and health records anytime with a single tap.
          </p>
        </motion.div>
      </div>

      {/* Done Button */}
      <motion.button
        variants={itemVariants}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowPrivacyPolicy(false)}
        className="w-full mt-6 py-3.5 rounded-2xl bg-[#111312] text-white text-xs font-semibold shadow-md active:scale-98 transition flex items-center justify-center"
        type="button"
      >
        Understood &amp; Return
      </motion.button>
    </motion.div>
  );
}
