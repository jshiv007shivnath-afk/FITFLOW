'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useFitFlow } from '@/context/FitFlowContext';
import { Flame, Drop, Activity, ArrowRight2, ShieldTick } from 'reicon-react';
import { BrandMark } from '@/components/ui/BrandMark';

export function WelcomeView() {
  const { user, goals, setShowWelcome, setActiveTab, showToast } = useFitFlow();

  const handleEnterDashboard = () => {
    setShowWelcome(false);
    setActiveTab('home');
    showToast(`Welcome, ${user.name}! Let's make every move count.`);
  };

  const displayName = user.name || 'Athlete';

  return (
    <div className="relative w-full min-h-full flex flex-col justify-between bg-[#F8F8F6] text-[#111312] p-5 pb-7 selection:bg-[#B8F45A] selection:text-[#111312] overflow-y-auto no-scrollbar font-sans">
      {/* 1. Header Bar: Brand on Left, Minimal Status on Right */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-between w-full pt-1 pb-3 border-b border-[#ECECE9]/80"
      >
        <div className="flex items-center gap-2">
          <BrandMark size="sm" showText={false} />
          <span className="text-sm font-extrabold tracking-tight text-[#111312]">FitFlow</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#ECECE9] shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
          <span className="text-xs font-semibold text-[#525650]">Ready to start</span>
        </div>
      </motion.div>

      {/* 2. Main Bento UI Grid */}
      <div className="w-full max-w-sm mx-auto my-auto flex flex-col gap-3 py-3">
        {/* Bento Hero Card: Clean, Human Greeting (Zero AI Slop) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full bg-white rounded-2xl p-5 border border-[#ECECE9] shadow-xs flex flex-col items-start text-left"
        >
          {/* Minimalist Vector Emblem (No glowing orbs or floating badges) */}
          <div className="w-11 h-11 rounded-xl bg-[#111312] text-[#B8F45A] flex items-center justify-center mb-3 shadow-2xs">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-[#B8F45A]"
              aria-hidden="true"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-[#15803D] mb-1">
            Personal Dashboard Ready
          </span>

          <h1 className="text-[24px] sm:text-[26px] font-black text-[#111312] tracking-tight leading-tight">
            Welcome to FitFlow,
            <br />
            <span>{displayName}</span>!
          </h1>

          <p className="text-xs text-[#525650] mt-2 leading-relaxed">
            Your tracking starts fresh from zero today. Every workout, sip of water, and step you take will build your weekly consistency.
          </p>
        </motion.div>

        {/* Bento Grid: 2-Column Modular Baseline Target Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.08 }}
          className="grid grid-cols-2 gap-2.5 w-full"
        >
          {/* Bento Tile 1: Active Calorie Goal */}
          <div className="bg-white rounded-2xl p-4 border border-[#ECECE9] shadow-xs flex flex-col justify-between text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#525650] uppercase tracking-wider">
                Burn Goal
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center shrink-0">
                <Flame size={15} />
              </div>
            </div>
            <div>
              <span className="text-lg font-extrabold text-[#111312] block leading-tight">
                {goals.calorieTarget || 650} kcal
              </span>
              <span className="text-xs font-semibold text-[#15803D] block mt-1">
                0 kcal today · Fresh
              </span>
            </div>
          </div>

          {/* Bento Tile 2: Daily Water Goal */}
          <div className="bg-white rounded-2xl p-4 border border-[#ECECE9] shadow-xs flex flex-col justify-between text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#525650] uppercase tracking-wider">
                Hydration
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#E4F7FE] text-[#0369A1] flex items-center justify-center shrink-0">
                <Drop size={15} />
              </div>
            </div>
            <div>
              <span className="text-lg font-extrabold text-[#111312] block leading-tight">
                {goals.waterTargetMl || 2500} ml
              </span>
              <span className="text-xs font-semibold text-[#0369A1] block mt-1">
                0 ml logged · Fresh
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bento Tile 3: Daily Steps (Wide Card) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.14 }}
          className="bg-white rounded-2xl p-4 border border-[#ECECE9] shadow-xs flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E5FBC5] text-[#15803D] flex items-center justify-center shrink-0">
              <Activity size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#111312] block">Daily Step Goal</span>
              <span className="text-xs text-[#525650] block">Target: 10,000 steps</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-[#111312] block">0 steps</span>
            <span className="text-xs font-bold text-[#15803D]">Day 1</span>
          </div>
        </motion.div>
      </div>

      {/* 3. Bottom Action CTA: Minimalist Bento Button */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full pt-2 pb-1"
      >
        <button
          type="button"
          onClick={handleEnterDashboard}
          className="w-full h-12 rounded-xl bg-[#111312] text-white font-bold text-xs uppercase tracking-wider hover:bg-black transition-all shadow-xs active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer select-none"
        >
          <span>Enter Dashboard</span>
          <ArrowRight2 size={16} />
        </button>

        <div className="flex items-center justify-center gap-1.5 mt-2.5 text-xs text-[#525650]">
          <ShieldTick size={14} className="text-[#15803D]" />
          <span>All daily metrics calibrated to zero. Ready to train.</span>
        </div>
      </motion.div>
    </div>
  );
}
