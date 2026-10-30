'use client';

import React from 'react';
import { motion } from 'motion/react';

interface AboutViewProps {
  onNavigateHome: () => void;
  onNavigateServices: () => void;
}

export function AboutView({ onNavigateHome, onNavigateServices }: AboutViewProps) {
  return (
    <div className="w-full flex flex-col bg-white">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col gap-16 md:gap-24 relative overflow-hidden">
        {/* ============================================== */}
        {/* HERO SECTION                                   */}
        {/* ============================================== */}
        <section className="relative pt-4 pb-4">
          {/* Floating Stars */}
          <motion.div
            aria-hidden="true"
            animate={{
              y: [0, -10, 0, 10, 0],
              rotate: [0, 90, 180, 270, 360],
              opacity: [0.6, 1, 0.7, 1, 0.6],
            }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-3 right-8 sm:right-16 w-12 h-12 flex items-center justify-center pointer-events-none text-[#6a527c]"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
            </svg>
          </motion.div>

          <motion.div
            aria-hidden="true"
            animate={{
              y: [0, 8, 0, -8, 0],
              rotate: [0, -90, -180, -270, -360],
              opacity: [0.5, 0.85, 0.5, 0.85, 0.5],
            }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 -left-2 sm:left-4 w-10 h-10 flex items-center justify-center pointer-events-none text-[#BDA5D0]"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
            </svg>
          </motion.div>

          {/* Sub-badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2ecf3] text-[#6a527c] text-[13px] font-semibold mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#ffbd5a] animate-pulse" />
            <span>The Fitflow Story</span>
            <span className="text-[#827B86] text-[11px] font-semibold uppercase tracking-wider pl-1">
              Est. 2026
            </span>
          </motion.div>

          {/* Headline Statement with Pill & Swoosh */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative max-w-4xl"
          >
            <h1 className="font-['Manrope'] text-[36px] sm:text-[54px] lg:text-[68px] text-[#1c1b1f] tracking-tight leading-[1.08] font-bold">
              Thoughtful craft.{' '}
              <span className="inline-flex items-center align-middle mx-1.5 px-4 py-1 rounded-full bg-[#ffddb2] text-[#291800] text-[20px] sm:text-[28px] font-bold shadow-sm">
                Warm
              </span>{' '}
              community.{' '}
              <span className="relative inline-block text-[#6a527c] mt-2 sm:mt-0">
                Lifelong practice.
                <svg
                  className="absolute -bottom-3 left-0 w-full h-4 text-[#6a527c] pointer-events-none"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 320 20"
                >
                  <path d="M3 14C80 2 240 -2 317 14" stroke="currentColor" strokeLinecap="round" strokeWidth="3.5" />
                </svg>
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 text-[#57535A] text-[16px] sm:text-[18px] max-w-2xl leading-relaxed"
          >
            We cultivate an intimate, empowering environment for everyday athletes. Here, sports science is translated directly into refined, sustainable fitness routines through positive coaching and community consistency.
          </motion.p>
        </section>

        {/* ============================================== */}
        {/* TWO-COLUMN STORY SECTION                       */}
        {/* ============================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-[#6a527c] text-[12px] font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-[18px]">history_edu</span>
              <span>Origin & Intent</span>
            </div>

            <h2 className="font-['Manrope'] text-[28px] sm:text-[34px] text-[#1c1b1f] font-bold tracking-tight">
              Bridging the chasm between extreme fitness fads and sustainable health.
            </h2>

            <div className="space-y-4 text-[#57535A] text-[15px] leading-relaxed">
              <p>
                FitFlow was founded out of a quiet frustration with fast-food fitness apps: noisy notification loops, toxic gym bro-culture, and unrealistic 7-day shred routines that lead to burnout and injury.
              </p>
              <p>
                We envisioned a digital studio modeled on traditional coaching sanctuaries—a calm space free from algorithmic guilt where individuals learn how to build progressive momentum, respect their hydration, and track their strength with pride.
              </p>
              <p>
                Every feature in FitFlow is built to make healthy physical habits second nature. We don&apos;t just log workouts; we nurture the daily discipline that transforms your health for decades to come.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#f7f2f8] shadow-sm border border-[#E7E2E8]">
                <div className="font-['Manrope'] text-[26px] text-[#6a527c] font-bold">2.4k+</div>
                <div className="text-[12px] text-[#57535A] font-medium mt-1">Active Athletes</div>
              </div>
              <div className="p-4 rounded-xl bg-[#f7f2f8] shadow-sm border border-[#E7E2E8]">
                <div className="font-['Manrope'] text-[26px] text-[#815500] font-bold">98%</div>
                <div className="text-[12px] text-[#57535A] font-medium mt-1">Streak Retention</div>
              </div>
              <div className="p-4 rounded-xl bg-[#f7f2f8] shadow-sm border border-[#E7E2E8]">
                <div className="font-['Manrope'] text-[26px] text-[#6a527c] font-bold">1:12</div>
                <div className="text-[12px] text-[#57535A] font-medium mt-1">Coach Ratio</div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Visual */}
          <div className="lg:col-span-6 relative">
            <div className="w-full aspect-[4/3] rounded-[32px] bg-gradient-to-br from-[#f7f2f8] via-[#f2ecf3] to-[#ece6ed] p-5 shadow-md relative overflow-hidden flex flex-col justify-between border border-[#E7E2E8]">
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-white text-[#1c1b1f] text-[12px] font-semibold shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F078AD]" />
                  FitFlow Studio • Vol. 01
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#7DD9E7]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd5a]" />
                  <span className="w-3 h-3 rounded-full bg-[#BDA5D0]" />
                </div>
              </div>

              <div className="relative z-10 my-4 rounded-2xl overflow-hidden shadow-sm bg-white">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBReqs5V8FbNcyAM3MLIOyY02DmXo9X_xuORQT8bH_1TWz6cOFU7hBjhuJK7DPa8RDVX5e2FvuxBF66yQdNUNSCWVpu4PW-atePBynFkVGZE2G6EVri8WkWjAlzzYgRdoM2YjJ2ZyLimCay5RVFSd6b04JN02RcJxayW8MeFS3DYMZLDo1zQwyAb1jLBGBp6oOpQhu14Ax0qEecvGwBcn8pl5Zwp0KnqgX-R7FCahk0"
                  alt="FitFlow Athletic Workspace"
                  className="w-full h-56 sm:h-64 object-cover"
                />
              </div>

              <div className="relative z-10 flex items-center justify-between text-[#57535A] text-[12px] font-semibold">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#6a527c] text-[18px]">verified_user</span>
                  <span>Human-Centered Training</span>
                </div>
                <span className="text-[#827B86] text-[11px]">Global • Cross-Platform</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* CORE VALUES (01: CLARITY, 02: CRAFT, 03: COMMUNITY) */}
        {/* ============================================== */}
        <section className="space-y-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[#6a527c] text-[12px] font-bold uppercase tracking-widest mb-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Our Foundation</span>
              </div>
              <h2 className="font-['Manrope'] text-[28px] sm:text-[36px] text-[#1c1b1f] font-bold tracking-tight">
                Principles that guide every program.
              </h2>
            </div>
            <p className="text-[#57535A] text-[15px] max-w-md">
              We reject transient fads in favor of structural clarity, humane pacing, and reciprocal fitness respect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Clarity */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-[24px] bg-[#f7f2f8] shadow-sm flex flex-col justify-between border border-[#E7E2E8]"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#7DD9E7]/30 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[#6a527c] text-[28px]">lens_blur</span>
                </div>
                <span className="text-[11px] uppercase tracking-wider text-[#827B86] font-bold">
                  01 • Principle
                </span>
                <h3 className="font-['Manrope'] text-[22px] text-[#1c1b1f] font-bold mt-1 mb-3">
                  Clarity
                </h3>
                <p className="text-[14px] text-[#57535A] leading-relaxed">
                  Stripping away confusing fitness noise, pseudo-science supplements, and aggressive marketing that obscures genuine physical progress.
                </p>
              </div>
              <div className="mt-8 pt-4 flex items-center text-[#6a527c] font-semibold text-[13px] gap-1">
                <span>Essentialist Focus</span>
                <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </div>
            </motion.div>

            {/* Card 2: Craft */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-[24px] bg-[#6a527c] text-white shadow-md flex flex-col justify-between relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#ffbd5a] text-[#291800] flex items-center justify-center mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">fitness_center</span>
                </div>
                <span className="text-[11px] uppercase tracking-wider text-[#f2daff] font-bold">
                  02 • Principle
                </span>
                <h3 className="font-['Manrope'] text-[22px] text-white font-bold mt-1 mb-3">
                  Craft
                </h3>
                <p className="text-[14px] text-[#f2daff] leading-relaxed">
                  Relentless dedication to lifting form, progressive overload metrics, clean nutrition, and restorative recovery.
                </p>
              </div>
              <div className="relative z-10 mt-8 pt-4 flex items-center text-[#ffddb2] font-semibold text-[13px] gap-1">
                <span>Obsessive Refinement</span>
                <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </div>
            </motion.div>

            {/* Card 3: Community */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-[24px] bg-[#f7f2f8] shadow-sm flex flex-col justify-between border border-[#E7E2E8]"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F078AD]/30 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[#6a527c] text-[28px]">diversity_3</span>
                </div>
                <span className="text-[11px] uppercase tracking-wider text-[#827B86] font-bold">
                  03 • Principle
                </span>
                <h3 className="font-['Manrope'] text-[22px] text-[#1c1b1f] font-bold mt-1 mb-3">
                  Community
                </h3>
                <p className="text-[14px] text-[#57535A] leading-relaxed">
                  Working out alongside supportive, curious athletes who challenge each other with kindness and celebrate every individual breakthrough.
                </p>
              </div>
              <div className="mt-8 pt-4 flex items-center text-[#6a527c] font-semibold text-[13px] gap-1">
                <span>Collective Growth</span>
                <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================== */}
        {/* TIMELINE PROGRESSION                           */}
        {/* ============================================== */}
        <section className="p-8 sm:p-12 rounded-[28px] bg-[#FBFAFC] shadow-sm space-y-10 border border-[#E7E2E8]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[#6a527c] text-[12px] font-bold uppercase tracking-widest mb-2">
              <span className="material-symbols-outlined text-[18px]">school</span>
              <span>Progression</span>
            </div>
            <h2 className="font-['Manrope'] text-[28px] sm:text-[34px] text-[#1c1b1f] font-bold tracking-tight">
              How we guide your transformation.
            </h2>
            <p className="text-[#57535A] text-[15px] mt-2 leading-relaxed">
              A three-tiered progression designed to turn sporadic exercise into systematic, repeatable fitness mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col space-y-4">
              <span className="w-10 h-10 rounded-full bg-[#ffddb2] text-[#291800] flex items-center justify-center font-bold text-[14px] shadow-sm">
                01
              </span>
              <div>
                <h3 className="font-['Manrope'] text-[20px] text-[#1c1b1f] font-bold">
                  Foundations & Grammar
                </h3>
                <span className="text-[#827B86] text-[12px] block mt-0.5 mb-2 font-semibold">Weeks 1 – 3</span>
                <p className="text-[13px] text-[#57535A] leading-relaxed">
                  Master basic compound movement patterns, set baseline hydration goals, and calibrate daily calorie expenditures.
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <span className="w-10 h-10 rounded-full bg-[#BDA5D0] text-[#271138] flex items-center justify-center font-bold text-[14px] shadow-sm">
                02
              </span>
              <div>
                <h3 className="font-['Manrope'] text-[20px] text-[#1c1b1f] font-bold">
                  Progressive Overload
                </h3>
                <span className="text-[#827B86] text-[12px] block mt-0.5 mb-2 font-semibold">Weeks 4 – 8</span>
                <p className="text-[13px] text-[#57535A] leading-relaxed">
                  Systematically scale rep counts, weights, and aerobic stamina with real-time feedback loops and deload management.
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <span className="w-10 h-10 rounded-full bg-[#7DD9E7] text-[#1c1b1f] flex items-center justify-center font-bold text-[14px] shadow-sm">
                03
              </span>
              <div>
                <h3 className="font-['Manrope'] text-[20px] text-[#1c1b1f] font-bold">
                  Habit Lock-In & Peak
                </h3>
                <span className="text-[#827B86] text-[12px] block mt-0.5 mb-2 font-semibold">Weeks 9 – 12</span>
                <p className="text-[13px] text-[#57535A] leading-relaxed">
                  Lock in permanent daily rituals, earn milestone badges, and step into senior community accountability roles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Back and Navigation Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
          <button
            type="button"
            onClick={onNavigateHome}
            className="px-8 py-3 rounded-full bg-[#f2ecf3] hover:bg-[#ece6ed] text-[#1c1b1f] font-semibold text-[14px] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Home</span>
          </button>
          <button
            type="button"
            onClick={onNavigateServices}
            className="px-8 py-3 rounded-full bg-[#6a527c] hover:bg-[#5a426c] text-white font-semibold text-[14px] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <span>Explore Services</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

