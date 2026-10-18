'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFitFlow } from '@/context/FitFlowContext';
import { Flame, Drop, Activity, ArrowRight2, Calendar, ShieldTick } from 'reicon-react';
import { BrandMark } from '@/components/ui/BrandMark';

export function OnboardingView() {
  const { setShowOnboarding, setShowWelcome } = useFitFlow();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < 2) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      setShowOnboarding(false);
      setShowWelcome(true);
    }
  };

  const handleSkip = () => {
    setShowOnboarding(false);
    setShowWelcome(true);
  };

  return (
    <div className="relative w-full min-h-full flex flex-col justify-between bg-[#F8F8F6] text-[#111312] p-5 pb-7 selection:bg-[#B8F45A] selection:text-[#111312] overflow-y-auto no-scrollbar font-sans">
      {/* 1. Header Bar */}
      <div className="w-full flex items-center justify-between pb-3 pt-1 border-b border-[#ECECE9]/80">
        <div className="flex items-center gap-2">
          <BrandMark size="sm" showText={false} />
          <span className="text-sm font-extrabold tracking-tight text-[#111312]">FitFlow</span>
        </div>
        <button
          type="button"
          onClick={handleSkip}
          className="text-xs font-bold text-[#525650] hover:text-[#111312] transition-colors uppercase tracking-wider px-2 cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* 2. Slide Bento Cards */}
      <div className="w-full max-w-sm mx-auto my-auto flex flex-col items-center py-2">
        <AnimatePresence mode="wait">
          {currentSlide === 0 && (
            <motion.div
              key="slide-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex flex-col items-center"
            >
              {/* Bento Visual Card */}
              <div className="w-full bg-white rounded-2xl p-6 border border-[#ECECE9] shadow-xs flex flex-col gap-3.5 mb-6">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#E5FBC5] text-[#15803D] flex items-center justify-center">
                    <Calendar size={20} />
                  </div>
                  <span className="text-xs font-bold text-[#15803D] bg-[#E5FBC5]/50 px-2.5 py-0.5 rounded-full">
                    Step 1 of 3
                  </span>
                </div>

                <div className="space-y-2 mt-1">
                  <div className="bg-[#F8F8F6] rounded-xl p-3 border border-[#ECECE9] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111312]">Monday Split</span>
                    <span className="text-xs font-semibold text-[#525650]">Chest &amp; Core · 30m</span>
                  </div>
                  <div className="bg-[#F8F8F6] rounded-xl p-3 border border-[#ECECE9] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111312]">Wednesday Split</span>
                    <span className="text-xs font-semibold text-[#525650]">Legs &amp; Cardio · 35m</span>
                  </div>
                  <div className="bg-[#F8F8F6] rounded-xl p-3 border border-[#ECECE9] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111312]">Friday Split</span>
                    <span className="text-xs font-semibold text-[#525650]">Full Body Strength · 40m</span>
                  </div>
                </div>
              </div>

              {/* Text Headline & Subtitle */}
              <div className="text-center px-2">
                <h1 className="text-[23px] sm:text-[25px] font-black text-[#111312] tracking-tight leading-snug">
                  Plan your weekly training
                </h1>
                <p className="text-xs text-[#525650] max-w-xs mt-2 leading-relaxed">
                  Set your exercises, reps, and workout time to fit your schedule without any guesswork.
                </p>
              </div>
            </motion.div>
          )}

          {currentSlide === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex flex-col items-center"
            >
              {/* Bento Visual Card */}
              <div className="w-full bg-white rounded-2xl p-6 border border-[#ECECE9] shadow-xs flex flex-col gap-3.5 mb-6">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#E4F7FE] text-[#0369A1] flex items-center justify-center">
                    <Drop size={20} />
                  </div>
                  <span className="text-xs font-bold text-[#0369A1] bg-[#E4F7FE]/60 px-2.5 py-0.5 rounded-full">
                    Step 2 of 3
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-[#F8F8F6] rounded-xl p-3.5 border border-[#ECECE9] text-left">
                    <div className="flex items-center gap-1.5 text-[#0369A1] mb-1">
                      <Drop size={14} />
                      <span className="text-xs font-bold">Hydration</span>
                    </div>
                    <span className="text-base font-extrabold text-[#111312] block">2,500 ml</span>
                    <span className="text-xs text-[#525650] block mt-0.5">+250ml quick-tap</span>
                  </div>

                  <div className="bg-[#F8F8F6] rounded-xl p-3.5 border border-[#ECECE9] text-left">
                    <div className="flex items-center gap-1.5 text-[#C2410C] mb-1">
                      <Flame size={14} />
                      <span className="text-xs font-bold">Burn</span>
                    </div>
                    <span className="text-base font-extrabold text-[#111312] block">650 kcal</span>
                    <span className="text-xs text-[#525650] block mt-0.5">Active daily target</span>
                  </div>
                </div>
              </div>

              {/* Text Headline & Subtitle */}
              <div className="text-center px-2">
                <h1 className="text-[23px] sm:text-[25px] font-black text-[#111312] tracking-tight leading-snug">
                  Fuel your recovery &amp; energy
                </h1>
                <p className="text-xs text-[#525650] max-w-xs mt-2 leading-relaxed">
                  Quick-log water intake with a single tap and monitor your active burn in real time.
                </p>
              </div>
            </motion.div>
          )}

          {currentSlide === 2 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex flex-col items-center"
            >
              {/* Bento Visual Card */}
              <div className="w-full bg-white rounded-2xl p-6 border border-[#ECECE9] shadow-xs flex flex-col gap-3.5 mb-6">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] text-[#C2410C] flex items-center justify-center">
                    <Activity size={20} />
                  </div>
                  <span className="text-xs font-bold text-[#9A3412] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                    Step 3 of 3
                  </span>
                </div>

                <div className="bg-[#B8F45A] rounded-2xl p-4 border border-[#A5EE3A]/60 flex items-center justify-between text-[#111312]">
                  <div>
                    <span className="text-xs font-bold text-[#375F0A] uppercase tracking-wider block">
                      Consistency
                    </span>
                    <span className="text-xl font-extrabold text-[#111312] block">
                      Daily Streak
                    </span>
                    <span className="text-xs text-[#375F0A] font-medium block mt-0.5">
                      Starts fresh from Day 1
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/70 border border-[#375F0A]/20 flex items-center justify-center font-extrabold text-base">
                    0d
                  </div>
                </div>
              </div>

              {/* Text Headline & Subtitle */}
              <div className="text-center px-2">
                <h1 className="text-[23px] sm:text-[25px] font-black text-[#111312] tracking-tight leading-snug">
                  Build unbreakable habits
                </h1>
                <p className="text-xs text-[#525650] max-w-xs mt-2 leading-relaxed">
                  Start fresh with clean baselines and watch your consistency grow as you hit your daily goals.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination Dots with Accessible 28px Touch Target (WCAG 2.5.8 compliant) */}
        <div className="flex items-center justify-center gap-1 mt-5" role="tablist" aria-label="Onboarding slides">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={currentSlide === idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="w-7 h-7 flex items-center justify-center cursor-pointer rounded-full focus:outline-none"
            >
              <span
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-[#111312]' : 'w-2 bg-[#D4D4D8] hover:bg-[#A1A1AA]'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* 3. Bottom Controls */}
      <div className="w-full pt-2">
        <button
          type="button"
          onClick={handleNext}
          className="w-full h-12 rounded-xl bg-[#111312] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-all active:scale-[0.98] shadow-xs flex items-center justify-center gap-2 cursor-pointer select-none"
        >
          <span>{currentSlide === 2 ? 'Get Started' : 'Next'}</span>
          <ArrowRight2 size={16} />
        </button>

        <div className="flex items-center justify-center gap-1.5 mt-2.5 text-xs text-[#525650]">
          <ShieldTick size={14} className="text-[#15803D]" />
          <span>No spam, no fluff. Just your workouts and stats.</span>
        </div>
      </div>
    </div>
  );
}
