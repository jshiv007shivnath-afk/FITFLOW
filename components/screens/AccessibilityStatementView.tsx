'use client';

import React from 'react';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { useFitFlow } from '@/context/FitFlowContext';
import { ArrowLeft, CheckCircle, ShieldTick, Eye, Setting2 } from 'reicon-react';

export function AccessibilityStatementView() {
  const { setShowAccessibilityStatement, showToast } = useFitFlow();

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
      {/* 1. Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8EAE5]">
        <div className="flex items-center gap-2.5">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setShowAccessibilityStatement(false)}
            aria-label="Back"
            className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#111312] hover:bg-[#F4F5F2] transition-colors cursor-pointer"
            type="button"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <div className="w-8 h-8 rounded-xl bg-[#E5FBC5] flex items-center justify-center text-[#15803D]">
            <CheckCircle size={18} />
          </div>
          <div>
            <h1 className="text-[18px] font-bold tracking-tight text-[#111312]">Accessibility Statement</h1>
            <span className="text-xs text-[#525650]">WCAG 2.2 Level AA Standards</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Commitment Banner */}
      <motion.div variants={itemVariants} className="w-full bg-[#E5FBC5] rounded-2xl p-5 mb-4 flex items-start gap-3 border border-[#B8F45A]/40 shadow-xs">
        <div className="w-10 h-10 rounded-full bg-[#B8F45A] flex items-center justify-center text-[#111312] shrink-0 font-bold text-lg">
          <CheckCircle size={22} className="text-[#111312]" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-[15px] font-bold text-[#111312]">Universal Digital Access</h2>
          <p className="text-xs text-[#434937] leading-relaxed mt-1">
            FitFlow is made for everyone. We design our app so people of all abilities can track fitness with ease.
          </p>
        </div>
      </motion.div>

      {/* 3. Standards & Features */}
      <div className="flex flex-col gap-3">
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#E4F7FE] flex items-center justify-center text-[#0284C7]">
              <Eye size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">1. Color Contrast &amp; Typography</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            All text content, badges, and interactive controls satisfy WCAG 2.2 Level AA contrast minimums (at least 4.5:1 for standard body copy and 3.0:1 for large display headlines). Micro-copy adheres to readable baseline sizes.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0DF] flex items-center justify-center text-[#C2410C]">
              <Setting2 size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">2. Keyboard Navigation &amp; Focus Indicators</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            You can move through all buttons and links using only your keyboard (Tab, Enter, Space). Clear focus lines show your place.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#E5FBC5] flex items-center justify-center text-[#15803D]">
              <ShieldTick size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">3. Screen Reader Semantics &amp; ARIA</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            Screen readers can read all buttons clearly. Progress rings and charts share live values as you reach your goals.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#F4F5F2] flex items-center justify-center text-[#111312]">
              <CheckCircle size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">4. Continuous Testing &amp; Feedback</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            We test our app often with accessibility tools and real keyboards. If you run into any issues, please tell us through our Help Center.
          </p>
        </motion.div>
      </div>

      {/* 4. Bottom CTA */}
      <motion.button
        variants={itemVariants}
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          setShowAccessibilityStatement(false);
          showToast('Accessibility statement closed');
        }}
        className="w-full h-12 rounded-2xl bg-[#111312] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-6 shadow-xs cursor-pointer hover:bg-black"
        type="button"
      >
        <span>Back to Settings</span>
      </motion.button>
    </motion.div>
  );
}
