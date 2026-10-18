'use client';

import React from 'react';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { useFitFlow } from '@/context/FitFlowContext';
import { ArrowLeft, DocumentText, ShieldAlert, Award, Refresh } from 'reicon-react';

export function TermsView() {
  const { setShowTerms, showToast } = useFitFlow();

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
            onClick={() => setShowTerms(false)}
            aria-label="Back"
            className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#111312] hover:bg-[#F4F5F2] active:scale-95 transition"
            type="button"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="w-8 h-8 rounded-xl bg-[#FFF0DF] flex items-center justify-center text-[#FF9D42]">
            <DocumentText size={18} />
          </div>
          <div>
            <h1 className="text-[18px] font-bold tracking-tight text-[#111312]">Terms &amp; Conditions</h1>
            <span className="text-xs text-[#525650]">Version 3.4.1 · Effective October 2026</span>
          </div>
        </div>
      </motion.div>

      {/* Wellness Notice Banner */}
      <motion.div variants={itemVariants} className="w-full bg-[#FFF0DF] rounded-2xl p-5 mb-4 flex items-start gap-3 border border-[#FF9D42]/30 shadow-xs">
        <div className="w-10 h-10 rounded-full bg-[#FF9D42] flex items-center justify-center text-white shrink-0 font-bold text-lg">
          <ShieldAlert size={20} className="text-white" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-[15px] font-bold text-[#111312]">Wellness Advisory Notice</h2>
          <p className="text-xs text-[#525650] leading-relaxed mt-1">
            FitFlow is a fitness and habit tracker. It does not give medical advice or replace a doctor.
          </p>
        </div>
      </motion.div>

      {/* Terms Sections (Long & Deep Scroll) */}
      <div className="flex flex-col gap-3">
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFE4E6] flex items-center justify-center text-[#FF626C]">
              <ShieldAlert size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">1. Physical Exercise Safety</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            Check with your doctor before starting hard workouts. Exercise at your own pace and stop if you feel pain.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#E5FBC5] flex items-center justify-center text-[#456800]">
              <Award size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">2. Streaks, Consistency &amp; Milestones</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            Streaks and badges help you build daily habits. FitFlow may update habit rules to keep tracking fair.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#E4F7FE] flex items-center justify-center text-[#42BFEF]">
              <Refresh size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">3. Pro Membership &amp; Updates</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            FitFlow Pro gives you extra nutrition tips and offline tools. You can change or cancel your plan anytime in settings.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#E8F3FF] flex items-center justify-center text-[#1E88E5]">
              <DocumentText size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">4. Account Integrity &amp; Ownership</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            You own all your workout logs and notes. You can export your data anytime in standard file formats.
          </p>
        </motion.div>
      </div>

      {/* Done Button */}
      <motion.button
        variants={itemVariants}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          showToast('Terms of Service acknowledged');
          setShowTerms(false);
        }}
        className="w-full mt-6 py-3.5 rounded-2xl bg-[#111312] text-white text-xs font-semibold shadow-md active:scale-98 transition flex items-center justify-center"
        type="button"
      >
        I Agree &amp; Return
      </motion.button>
    </motion.div>
  );
}
