'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ServicesViewProps {
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
}

export function ServicesView({ onNavigateHome, onNavigateAbout }: ServicesViewProps) {
  const [activeTab, setActiveTab] = useState<'strength' | 'hiit' | 'habits'>('strength');

  const tabContent = {
    strength: {
      heading: 'Strength & Hypertrophy Track',
      sub: 'Master progressive overload, optimal lifting volume, and balanced push/pull/legs periodization.',
      seats: '20 / 24 Athletes',
      percent: '83%',
      next: 'Next Cycle: Monday',
      modules: [
        {
          id: 'M1',
          title: 'Compound Movement Biomechanics & RPE',
          desc: 'Dial in your squat, bench, and deadlift form using video angle benchmarks and real-time fatigue regulation.',
        },
        {
          id: 'M2',
          title: 'Progressive Overload & Deload Cycles',
          desc: 'Structure micro-cycles with automated weight increment calculations and scheduled deload recovery weeks.',
        },
        {
          id: 'M3',
          title: 'Targeted Muscle Isolation & Hypertrophy Sets',
          desc: 'Optimize time-under-tension and metabolic fatigue with targeted drop sets, rest-pause reps, and supersets.',
        },
      ],
    },
    hiit: {
      heading: 'Metabolic Conditioning & Agility',
      sub: 'High-intensity interval training designed for cardiovascular endurance, rapid calorie burn, and athletic explosiveness.',
      seats: '16 / 20 Athletes',
      percent: '75%',
      next: 'Next Cycle: Wednesday',
      modules: [
        {
          id: 'M1',
          title: 'Heart Rate Zone Optimization (Zone 2 to 5)',
          desc: 'Synchronize your wearable sensors to balance fat oxidation intervals with VO2 max threshold training.',
        },
        {
          id: 'M2',
          title: 'Plyometrics, Sprint Mechanics & Core Agility',
          desc: 'Develop elastic power and explosive deceleration mechanics to prevent athletic injuries.',
        },
        {
          id: 'M3',
          title: 'Active Recovery & Post-Workout Autonomic Reset',
          desc: 'Breathwork protocols and cold-down mobility routines that bring your sympathetic nervous system back to baseline.',
        },
      ],
    },
    habits: {
      heading: 'Habit Architecture & Nutrition Sync',
      sub: 'Build unwavering 21-day streaks, hydration benchmarks, and intuitive macro-nutrient tracking habits.',
      seats: '24 / 24 Full (Waitlist Open)',
      percent: '100%',
      next: 'Next Cycle: Nov 1',
      modules: [
        {
          id: 'M1',
          title: 'Hydration Pacing & Water Intake Milestones',
          desc: 'Intelligent notification algorithms timed around your workout windows and circadian energy dips.',
        },
        {
          id: 'M2',
          title: 'Macro Calorie Targets & Whole-Food Fueling',
          desc: 'Calculate exact protein, complex carbohydrate, and healthy fat splits tailored to your specific body composition.',
        },
        {
          id: 'M3',
          title: '21-Day Habit Streak Psychology & Gamified XP',
          desc: 'Harness positive dopamine reinforcement loops, badge unlocks, and community accountability to make fitness a reflex.',
        },
      ],
    },
  };

  const current = tabContent[activeTab];

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Services Content Wrapper */}
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col gap-16 md:gap-24 relative overflow-hidden">
        {/* ============================================== */}
        {/* HERO SECTION                                   */}
        {/* ============================================== */}
        <section className="flex flex-col items-center text-center relative pt-4 pb-6 md:pb-10">
          {/* Decorative Floating Stars */}
          <motion.div
            aria-hidden="true"
            animate={{
              y: [0, -8, 0, 8, 0],
              rotate: [0, 90, 180, 270, 360],
              opacity: [0.5, 0.9, 0.6, 0.9, 0.5],
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-2 left-4 sm:left-12 pointer-events-none select-none text-[#846a96]/50"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z" />
            </svg>
          </motion.div>

          <motion.div
            aria-hidden="true"
            animate={{
              y: [0, 10, 0, -10, 0],
              rotate: [0, -90, -180, -270, -360],
              opacity: [0.6, 1, 0.7, 1, 0.6],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-6 right-6 sm:right-20 pointer-events-none select-none text-[#846a96]"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
            </svg>
          </motion.div>

          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="px-4 py-1.5 rounded-full bg-[#f2ecf3] text-[#6a527c] text-[13px] font-semibold flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#6a527c] animate-pulse" />
              <span>What We Do • Fitflow Services</span>
            </div>
            <div className="hidden sm:inline-flex px-3 py-1 rounded-full bg-[#ece6ed] text-[#827B86] text-[11px] font-semibold uppercase tracking-wider">
              Athlete Edition • 2026.04
            </div>
          </motion.div>

          {/* Display Heading with Signature Inline Pill */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-['Manrope'] text-[36px] sm:text-[52px] lg:text-[68px] text-[#1c1b1f] max-w-4xl tracking-tight leading-tight font-bold"
          >
            Fitness tools for{' '}
            <span className="inline-flex items-center align-middle mx-1 md:mx-2 px-4 py-1 rounded-full bg-[#ffbd5a] text-[#291800] shadow-sm transform -translate-y-1">
              <svg className="w-5 h-5 mr-1.5 text-[#291800]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
              </svg>
              <span className="text-[18px] sm:text-[24px] font-bold">goals</span>
            </span>{' '}
            worth reaching{' '}
            <span className="relative inline-block ml-1">
              <span>effortlessly</span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-[#846a96]/40 pointer-events-none"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 120 12"
              >
                <path d="M2 9C35 2 85 2 118 7" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
              </svg>
            </span>
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 md:mt-8 max-w-2xl text-[16px] sm:text-[18px] text-[#57535A] leading-relaxed"
          >
            High-standard workout splits, biometric synchronization, and 21-day habit architecture designed for individuals who want tangible, visible physical results without burnout.
          </motion.p>

          {/* Quick Metrics Ribbon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12 w-full max-w-3xl flex flex-wrap items-center justify-around gap-6 text-left bg-[#f7f2f8] rounded-3xl p-6 shadow-sm border border-[#E7E2E8]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffddb2] flex items-center justify-center text-[#291800] shadow-sm">
                <span className="material-symbols-outlined text-[20px]">fitness_center</span>
              </div>
              <div>
                <div className="font-['Manrope'] text-[24px] text-[#1c1b1f] font-bold">12+</div>
                <div className="text-[11px] text-[#827B86] uppercase tracking-wider font-semibold">Modular Tracks</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f2daff] flex items-center justify-center text-[#261335] shadow-sm">
                <span className="material-symbols-outlined text-[20px]">group</span>
              </div>
              <div>
                <div className="font-['Manrope'] text-[24px] text-[#1c1b1f] font-bold">2.4k+</div>
                <div className="text-[11px] text-[#827B86] uppercase tracking-wider font-semibold">Active Athletes</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#BDA5D0]/30 flex items-center justify-center text-[#6a527c] shadow-sm">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
              <div>
                <div className="font-['Manrope'] text-[24px] text-[#1c1b1f] font-bold">98%</div>
                <div className="text-[11px] text-[#827B86] uppercase tracking-wider font-semibold">Streak Completion</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ============================================== */}
        {/* DISCIPLINES WE MASTER (3-COLUMN CARDS)         */}
        {/* ============================================== */}
        <section className="flex flex-col gap-8 scroll-mt-24" id="services-grid">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-[11px] text-[#6a527c] font-bold uppercase tracking-wider mb-2">
                Practice & Methodology
              </div>
              <h2 className="font-['Manrope'] text-[32px] sm:text-[38px] font-bold text-[#1c1b1f]">
                Disciplines we master
              </h2>
            </div>
            <p className="text-[15px] text-[#57535A] max-w-md leading-relaxed">
              Structured progressive splits, live sensor feedback, and biometric tracking designed to bridge theory and physical performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <motion.article
              whileHover={{ y: -6 }}
              className="rounded-[24px] bg-[#FBFAFC] p-6 lg:p-7 flex flex-col justify-between shadow-[0_4px_16px_rgba(49,37,55,0.04)] border border-[#E7E2E8] hover:shadow-[0_18px_36px_rgba(49,37,55,0.1)] transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 rounded-full bg-[#f2ecf3] text-[#57535A] text-[12px] font-semibold">
                    Track 01
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#ece6ed] flex items-center justify-center text-[#1c1b1f]">
                    <span className="material-symbols-outlined text-[18px]">north_east</span>
                  </div>
                </div>
                <h3 className="font-['Manrope'] text-[22px] font-bold text-[#1c1b1f] mb-2.5">
                  Hypertrophy & Strength Splits
                </h3>
                <p className="text-[#57535A] text-[14px] leading-relaxed mb-6">
                  Build functional muscle mass with scientifically structured push/pull/legs routines and progressive overload tracking.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-1 rounded-lg bg-[#f2ecf3] text-[#827B86] text-[11px] font-medium">
                    Progressive Overload
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#f2ecf3] text-[#827B86] text-[11px] font-medium">
                    RPE Sets
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#f2ecf3] text-[#827B86] text-[11px] font-medium">
                    Deload Cycles
                  </span>
                </div>
              </div>
              <div className="w-full h-44 rounded-[18px] bg-[#7DD9E7]/20 overflow-hidden flex items-center justify-center p-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpXkauqOnkce4ydkMgJ4rS3FJcIM3feFvXy2X4zDfvhcVZQEjoUcn0tHU9ESNaJTieQVkO7rBRsfHGFtTkS6-81hRSkQc_j_7wd3B6tDSClDb0ebifx1fmuuL-DnSqh_M8Qu504Hu3t0kLlQ_1EiZidQWeCWvI5ff6cORBkcxITexor2hni23eU0rBn6PZkBH7nfSI0XcH9DOD-HtTkFQYVJXcaO3YISYP851ULD3R"
                  alt="Strength Split Diagram"
                  className="w-full h-full object-cover rounded-[14px] shadow-sm"
                />
              </div>
            </motion.article>

            {/* Card 2: Featured Active Card */}
            <motion.article
              whileHover={{ y: -6 }}
              className="rounded-[24px] bg-[#6a527c] text-white p-6 lg:p-7 flex flex-col justify-between shadow-[0_6px_20px_rgba(106,82,124,0.18)] hover:shadow-[0_20px_40px_rgba(106,82,124,0.3)] transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 rounded-full bg-[#836b93] text-white text-[12px] font-semibold">
                    Track 02 • Featured
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#ffbd5a] text-[#291800] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[18px]">north_east</span>
                  </div>
                </div>
                <h3 className="font-['Manrope'] text-[22px] font-bold text-white mb-2.5">
                  Kinetic Motion & Form Tracking
                </h3>
                <p className="text-[#f2daff] text-[14px] leading-relaxed mb-6">
                  Master dynamic body mechanics, rep cadence, and live sensor feedback that protects your joints and maximizes efficiency.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-1 rounded-lg bg-[#846a96] text-white text-[11px] font-medium">
                    Rep Cadence
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#846a96] text-white text-[11px] font-medium">
                    Mobility
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#846a96] text-white text-[11px] font-medium">
                    Joint Health
                  </span>
                </div>
              </div>
              <div className="w-full h-44 rounded-[18px] bg-[#ffddb2]/20 overflow-hidden flex items-center justify-center p-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0jTd-hSlDD4SnXOkhA1efXEfSAWGxkHhdpNm-y0uEhguc1iQBWYXg_z7OfYNkkEOaGL6N8YnmE_uh2Gc3qrzuoBH3XQHoRLSLrV7AWO7S4ZS7qye8Gghzx-zrcrOobUsGI3VUyLAq-tBm7wXfPH0twuxKkVzvUeBE8Wn_QyecLorQZhEcB5T2m1onNii01IoLo3RO9Ous9pnXRT8-ev5-o8Q8avHNg4_vOUOr8W_B"
                  alt="Kinetic Tracking Motion"
                  className="w-full h-full object-cover rounded-[14px] shadow-sm"
                />
              </div>
            </motion.article>

            {/* Card 3 */}
            <motion.article
              whileHover={{ y: -6 }}
              className="rounded-[24px] bg-[#FBFAFC] p-6 lg:p-7 flex flex-col justify-between shadow-[0_4px_16px_rgba(49,37,55,0.04)] border border-[#E7E2E8] hover:shadow-[0_18px_36px_rgba(49,37,55,0.1)] transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 rounded-full bg-[#f2ecf3] text-[#57535A] text-[12px] font-semibold">
                    Track 03
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#ece6ed] flex items-center justify-center text-[#1c1b1f]">
                    <span className="material-symbols-outlined text-[18px]">north_east</span>
                  </div>
                </div>
                <h3 className="font-['Manrope'] text-[22px] font-bold text-[#1c1b1f] mb-2.5">
                  Biometrics & Hydration Sync
                </h3>
                <p className="text-[#57535A] text-[14px] leading-relaxed mb-6">
                  Intelligent water intake pacing, calorie balance, and recovery score monitoring tuned to your specific metabolism.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-1 rounded-lg bg-[#f2ecf3] text-[#827B86] text-[11px] font-medium">
                    Hydration Log
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#f2ecf3] text-[#827B86] text-[11px] font-medium">
                    Calorie Math
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#f2ecf3] text-[#827B86] text-[11px] font-medium">
                    Sleep Score
                  </span>
                </div>
              </div>
              <div className="w-full h-44 rounded-[18px] bg-[#F078AD]/20 overflow-hidden flex items-center justify-center p-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAestJaDo2hR_ZmZWnEkGvSTm2dORgcb9bSRitjwE0hoXczGRBSXGvv13mxFxt7402Z4sYIHEHO3IhqUDy663zEcQmMIXxBXdo5UOSPlcWcXZCF1HVlD9p2_ewc8Hjpwy7M4SKSqyQ4YntAKscMhuK4gIZ5QIbXOOe6El9drDDwVPUqBDwz8pv6HKBJr96OhOVcML0cFsnWIemMpOZwq8aNI8tGQ_zxtT9Gh_lu4n0E"
                  alt="Biometrics and Nutrition"
                  className="w-full h-full object-cover rounded-[14px] shadow-sm"
                />
              </div>
            </motion.article>
          </div>
        </section>

        {/* ============================================== */}
        {/* METHODOLOGY STEPS (01 - 04)                    */}
        {/* ============================================== */}
        <section className="flex flex-col gap-8 bg-[#f7f2f8] rounded-[28px] p-6 sm:p-10 md:p-12 shadow-sm border border-[#E7E2E8]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-[#6a527c] font-bold uppercase tracking-wider">
                Methodology
              </span>
              <h2 className="font-['Manrope'] text-[28px] sm:text-[34px] font-bold text-[#1c1b1f] mt-1">
                How we guide athletes
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[#57535A] text-[14px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd5a]" />
              <span>Adaptive 4-phase transformation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white shadow-sm border border-[#E7E2E8]">
              <div className="flex items-center justify-between">
                <span className="font-['Manrope'] text-[24px] font-bold text-[#6a527c]">01</span>
                <span className="w-3 h-3 rounded-full bg-[#7DD9E7]" />
              </div>
              <h4 className="font-['Manrope'] text-[18px] text-[#1c1b1f] font-bold">Discover</h4>
              <p className="text-[13px] text-[#57535A] leading-relaxed">
                Assess current strength baseline, mobility limitations, and daily nutrition patterns.
              </p>
            </div>

            <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white shadow-sm border border-[#E7E2E8]">
              <div className="flex items-center justify-between">
                <span className="font-['Manrope'] text-[24px] font-bold text-[#6a527c]">02</span>
                <span className="w-3 h-3 rounded-full bg-[#F078AD]" />
              </div>
              <h4 className="font-['Manrope'] text-[18px] text-[#1c1b1f] font-bold">Design</h4>
              <p className="text-[13px] text-[#57535A] leading-relaxed">
                Build personalized workout splits and water goals calibrated to your schedule.
              </p>
            </div>

            <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white shadow-sm border border-[#E7E2E8]">
              <div className="flex items-center justify-between">
                <span className="font-['Manrope'] text-[24px] font-bold text-[#6a527c]">03</span>
                <span className="w-3 h-3 rounded-full bg-[#ffbd5a]" />
              </div>
              <h4 className="font-['Manrope'] text-[18px] text-[#1c1b1f] font-bold">Refine</h4>
              <p className="text-[13px] text-[#57535A] leading-relaxed">
                Review weekly lifting metrics, hydration consistency, and micro-progression weights.
              </p>
            </div>

            <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white shadow-sm border border-[#E7E2E8]">
              <div className="flex items-center justify-between">
                <span className="font-['Manrope'] text-[24px] font-bold text-[#6a527c]">04</span>
                <span className="w-3 h-3 rounded-full bg-[#BDA5D0]" />
              </div>
              <h4 className="font-['Manrope'] text-[18px] text-[#1c1b1f] font-bold">Lock-In</h4>
              <p className="text-[13px] text-[#57535A] leading-relaxed">
                Solidify 21-day streaks, level progression, and lifelong healthy physical fitness reflexes.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* INTERACTIVE TRACK PREVIEW DRAWER               */}
        {/* ============================================== */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] text-[#6a527c] font-bold uppercase tracking-wider">
                Curriculum Preview
              </span>
              <h2 className="font-['Manrope'] text-[28px] sm:text-[34px] font-bold text-[#1c1b1f] mt-1">
                Sneak peek into our coaching programs
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('strength')}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  activeTab === 'strength'
                    ? 'bg-[#6a527c] text-white shadow-sm'
                    : 'bg-[#f2ecf3] text-[#57535A] hover:bg-[#ece6ed]'
                }`}
              >
                Strength Mastery
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hiit')}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  activeTab === 'hiit'
                    ? 'bg-[#6a527c] text-white shadow-sm'
                    : 'bg-[#f2ecf3] text-[#57535A] hover:bg-[#ece6ed]'
                }`}
              >
                Metabolic HIIT
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('habits')}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  activeTab === 'habits'
                    ? 'bg-[#6a527c] text-white shadow-sm'
                    : 'bg-[#f2ecf3] text-[#57535A] hover:bg-[#ece6ed]'
                }`}
              >
                Habit Architecture
              </button>
            </div>
          </div>

          <div className="rounded-[28px] bg-[#FBFAFC] p-6 md:p-10 shadow-sm border border-[#E7E2E8] flex flex-col lg:flex-row gap-8 items-start">
            {/* Accordion List */}
            <div className="w-full lg:w-3/5 flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                {current.modules.map((mod, idx) => (
                  <details
                    key={mod.id}
                    open={idx === 0}
                    className="group rounded-2xl bg-[#f7f2f8] p-4 sm:p-5 cursor-pointer transition-all hover:bg-[#f2ecf3]"
                  >
                    <summary className="flex items-center justify-between text-[#1c1b1f] font-semibold text-[16px] sm:text-[17px] list-none">
                      <span className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#6a527c]/15 text-[#6a527c] text-[11px] flex items-center justify-center font-bold">
                          {mod.id}
                        </span>
                        <span>{mod.title}</span>
                      </span>
                      <span className="material-symbols-outlined text-[#827B86] group-open:rotate-180 transition-transform duration-200">
                        expand_more
                      </span>
                    </summary>
                    <div className="mt-3.5 pl-10 text-[#57535A] text-[14px] leading-relaxed">
                      {mod.desc}
                    </div>
                  </details>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-[#827B86] text-[13px] pl-2">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#6a527c]">schedule</span>
                  6-week program duration
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#6a527c]">videocam</span>
                  Weekly form breakdown
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#6a527c]">assignment_turned_in</span>
                  Milestone certification
                </span>
              </div>
            </div>

            {/* Dynamic Preview Side-Card */}
            <div className="w-full lg:w-2/5 rounded-2xl bg-[#f2ecf3] p-6 flex flex-col justify-between self-stretch shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] uppercase tracking-wider text-[#827B86] font-bold">
                    Cohort Snapshot
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ffddb2] text-[#291800] text-[11px] font-bold">
                    Enrollment Open
                  </span>
                </div>
                <h4 className="font-['Manrope'] text-[22px] font-bold text-[#1c1b1f] mb-2">
                  {current.heading}
                </h4>
                <p className="text-[#57535A] text-[14px] mb-6 leading-relaxed">
                  {current.sub}
                </p>

                <div className="p-4 rounded-xl bg-white mb-6 flex flex-col gap-3 shadow-xs border border-[#E7E2E8]">
                  <div className="flex items-center justify-between text-[13px] font-semibold text-[#1c1b1f]">
                    <span>Class Capacity</span>
                    <span className="text-[#6a527c]">{current.seats}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#ece6ed] overflow-hidden">
                    <div
                      className="h-full bg-[#6a527c] rounded-full transition-all duration-500"
                      style={{ width: current.percent }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#827B86]">
                    <span>{current.next}</span>
                    <span>Small athlete cohort</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onNavigateAbout}
                className="w-full h-12 rounded-full bg-[#6a527c] hover:bg-[#5a426c] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <span>Read About Our Philosophy</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Back to Home CTA */}
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={onNavigateHome}
            className="px-8 py-3 rounded-full bg-[#f2ecf3] hover:bg-[#ece6ed] text-[#1c1b1f] font-semibold text-[14px] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Main Page</span>
          </button>
        </div>
      </div>
    </div>
  );
}
