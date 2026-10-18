'use client';

import React from 'react';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { useFitFlow } from '@/context/FitFlowContext';
import { ArrowLeft, ShieldTick, Activity, Flame, CheckCircle } from 'reicon-react';

export function DisclaimerView() {
  const { setShowDisclaimer, showToast } = useFitFlow();

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
            onClick={() => setShowDisclaimer(false)}
            aria-label="Back"
            className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#111312] hover:bg-[#F4F5F2] transition-colors cursor-pointer"
            type="button"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <div className="w-8 h-8 rounded-xl bg-[#FFF0DF] flex items-center justify-center text-[#C2410C]">
            <Activity size={18} />
          </div>
          <div>
            <h1 className="text-[18px] font-bold tracking-tight text-[#111312]">Medical Disclaimer</h1>
            <span className="text-xs text-[#525650]">Health &amp; Exercise Safety Policy</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Notice Callout Banner */}
      <motion.div variants={itemVariants} className="w-full bg-[#FFF0DF] rounded-2xl p-5 mb-4 flex items-start gap-3 border border-[#FF9D42]/30 shadow-xs">
        <div className="w-10 h-10 rounded-full bg-[#FF9D42] flex items-center justify-center text-white shrink-0 font-bold text-lg">
          !
        </div>
        <div className="flex flex-col">
          <h2 className="text-[15px] font-bold text-[#111312]">Not Medical or Clinical Advice</h2>
          <p className="text-xs text-[#525650] leading-relaxed mt-1">
            FitFlow is a wellness and workout tracker. It is not a medical tool and does not treat or cure any health condition.
          </p>
        </div>
      </motion.div>

      {/* 3. Detailed Sections */}
      <div className="flex flex-col gap-3">
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#E5FBC5] flex items-center justify-center text-[#15803D]">
              <ShieldTick size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">1. Physician Consultation</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            Talk to a doctor before starting any new workout plan or diet. This is especially important if you take medicine or have heart or joint issues.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#E4F7FE] flex items-center justify-center text-[#0284C7]">
              <Activity size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">2. Estimation &amp; Metric Accuracy</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            Calorie, step, and water counts are estimates to help you stay active. Do not use them for medical or clinic diet plans.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0DF] flex items-center justify-center text-[#C2410C]">
              <Flame size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">3. Stop Exercise if Experiencing Pain</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            Workouts can carry physical risks. If you feel dizzy, sick, or feel chest pain, stop right away and get medical help.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECEDE9]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#F4F5F2] flex items-center justify-center text-[#111312]">
              <CheckCircle size={16} />
            </div>
            <h3 className="text-sm font-bold text-[#111312]">4. User Responsibility &amp; Assumption of Risk</h3>
          </div>
          <p className="text-xs text-[#525650] leading-relaxed">
            You follow workout plans at your own risk. FitFlow and its makers are not liable for injuries from these activities.
          </p>
        </motion.div>
      </div>

      {/* 4. Bottom Acknowledgment CTA */}
      <motion.button
        variants={itemVariants}
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          setShowDisclaimer(false);
          showToast('Health & Safety disclaimer acknowledged');
        }}
        className="w-full h-12 rounded-2xl bg-[#111312] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-6 shadow-xs cursor-pointer hover:bg-black"
        type="button"
      >
        <span>I Understand &amp; Acknowledge</span>
      </motion.button>
    </motion.div>
  );
}
