'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ScrollExpand from '@/components/reactbits/ScrollExpand';
import { ServicesView } from '@/components/landing/ServicesView';
import { AboutView } from '@/components/landing/AboutView';

interface RuangEditLandingPageProps {
  onLaunchApp?: () => void;
}

export function RuangEditLandingPage({ onLaunchApp }: RuangEditLandingPageProps) {
  const [currentView, setCurrentView] = useState<'home' | 'services' | 'about'>('home');

  const navigateTo = (view: 'home' | 'services' | 'about') => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#1c1b1f] antialiased font-['Manrope',sans-serif] selection:bg-[#ffbd5a] selection:text-[#291800] overflow-x-clip">
      <div className="w-full bg-white flex flex-col">
        {/* ============================================== */}
        {/* HEADER WITH REFINED CAPSULE NAVBAR             */}
        {/* ============================================== */}
        <header className="w-full h-[64px] sm:h-[80px] border-b border-[#E7E2E8] bg-white/95 backdrop-blur-md sticky top-0 z-50 px-3 sm:px-8 lg:px-12">
          <div className="max-w-[1240px] mx-auto h-full flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Brand + Refined Pill Capsule */}
            <div className="flex items-center gap-3 sm:gap-6">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer"
              >
                <img
                  src="/icon.png"
                  alt="FitFlow Logo"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-contain shadow-xs group-hover:scale-105 transition-transform"
                />
                <span className="font-semibold text-neutral-900 text-[16px] sm:text-[18px] tracking-tight">
                  Fitflow app
                </span>
              </button>

              {/* Single Outer Capsule for Nav */}
              <nav className="hidden sm:inline-flex items-center bg-neutral-100/90 border border-neutral-200/60 p-1.5 rounded-full backdrop-blur-sm gap-1">
                {(['home', 'services', 'about'] as const).map((view) => {
                  const label = view.charAt(0).toUpperCase() + view.slice(1);
                  const isActive = currentView === view;
                  return (
                    <button
                      key={view}
                      type="button"
                      onClick={() => navigateTo(view)}
                      className={`relative px-4 py-1.5 text-[13px] font-semibold transition-all duration-200 rounded-full cursor-pointer ${
                        isActive
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right Action CTA: Clean Download Button (No direct browser launch) */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (currentView !== 'home') navigateTo('home');
                  const el = document.getElementById('section-scroll-expand');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 sm:gap-2 h-[34px] sm:h-[42px] px-3 sm:px-5 rounded-full bg-[#FBFAFC] border border-[#E7E2E8] hover:border-[#B6A6BE] text-[#57535A] hover:text-[#1c1b1f] text-[11px] sm:text-[13px] font-semibold transition-all group cursor-pointer shadow-sm"
              >
                <span>Download<span className="hidden sm:inline"> now</span></span>
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </motion.button>
            </div>
          </div>
        </header>

        {/* ============================================== */}
        {/* CONDITIONAL PAGE VIEWS (Home, Services, About) */}
        {/* ============================================== */}
        <AnimatePresence mode="wait">
          {currentView === 'services' && (
            <motion.div
              key="services-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <ServicesView
                onNavigateHome={() => navigateTo('home')}
                onNavigateAbout={() => navigateTo('about')}
              />
            </motion.div>
          )}

          {currentView === 'about' && (
            <motion.div
              key="about-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <AboutView
                onNavigateHome={() => navigateTo('home')}
                onNavigateServices={() => navigateTo('services')}
              />
            </motion.div>
          )}

          {currentView === 'home' && (
            <motion.main
              key="home-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex-1 w-full bg-white relative overflow-hidden"
            >
              {/* ============================================== */}
              {/* 1. BACKGROUND ARCHITECTURAL GRID & AURA        */}
              {/* ============================================== */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#FAF9F6]"
              >
                <div
                  className="absolute inset-0 bg-[linear-gradient(to_right,rgba(23,23,23,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,23,23,0.045)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_45%,#000_60%,transparent_100%)]"
                />
              </div>

              {/* Center Warm Radial Aura behind H1 (Responsive scaling) */}
              <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[650px] h-[300px] sm:h-[420px] rounded-full blur-[90px] sm:blur-[110px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(251,146,60,0.16)_0%,rgba(253,186,116,0.08)_45%,transparent_75%)]"
              />

              {/* Biometric Telemetry SVG Wave Lines Container */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-[42%] -translate-y-1/2 w-full h-[260px] pointer-events-none z-0 overflow-hidden"
              >
                <svg
                  className="w-full h-full sm:min-w-[1200px] absolute inset-0 sm:left-1/2 sm:-translate-x-1/2"
                  viewBox="0 0 1440 260"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  {/* Wave 1: Primary Smooth Amber Sine Wave with Horizontal Pulse */}
                  <motion.path
                    d="M0,130 C240,40 480,220 720,130 C960,40 1200,220 1440,130"
                    stroke="#F59E0B"
                    strokeWidth="1.75"
                    strokeOpacity="0.35"
                    fill="none"
                    strokeDasharray="1440"
                    animate={{
                      strokeDashoffset: [1440, 0],
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  {/* Wave 2: Secondary Dashed Slate Inverse Curve */}
                  <path
                    d="M0,130 C240,220 480,40 720,130 C960,220 1200,40 1440,130"
                    stroke="#737373"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    strokeOpacity="0.28"
                    fill="none"
                  />
                </svg>
                {/* Ambient Micro-dots */}
                <div className="absolute top-[35%] left-[22%] w-2 h-2 rounded-full bg-orange-400/50 blur-[1px]" />
                <div className="absolute top-[65%] left-[52%] w-2 h-2 rounded-full bg-amber-400/40 blur-[1px]" />
                <div className="absolute top-[38%] right-[24%] w-2 h-2 rounded-full bg-orange-400/50 blur-[1px]" />
              </div>

              <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10" id="home">
                {/* ============================================== */}
                {/* HERO SECTION (EDITORIAL APPLE/LINEAR MINIMAL) */}
                {/* ============================================== */}
                <section className="w-full pt-8 sm:pt-14 md:pt-20 pb-10 sm:pb-16 md:pb-20 min-h-[auto] sm:min-h-[calc(80vh-80px)] flex flex-col items-center justify-center relative">
                  {/* Centered Editorial Display Headline with Floating Frosted-Glass Micro-Widgets */}
                  <div className="relative w-full max-w-5xl text-center select-none z-10">
                    {/* Left Floating Frosted-Glass Widget (Tilted -3deg, Generously Spaced from Headline) */}
                    <motion.div
                      initial={{ opacity: 0, x: -16, rotate: -3 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        y: [0, -6, 0],
                        rotate: -3,
                      }}
                      whileHover={{ scale: 1.04, rotate: 0 }}
                      transition={{
                        opacity: { duration: 0.8, delay: 0.35 },
                        x: { duration: 0.8, delay: 0.35 },
                        y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                        scale: { duration: 0.2 },
                        rotate: { duration: 0.2 },
                      }}
                      className="hidden lg:flex items-center gap-3 absolute top-3 xl:top-5 left-0 lg:-left-3 xl:left-0 -rotate-3 z-20 backdrop-blur-md bg-white/90 border border-neutral-200/80 shadow-md hover:shadow-lg rounded-2xl p-3 w-52 select-none cursor-pointer transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-orange-600 shadow-xs">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 23c-4.97 0-9-4.03-9-9 0-4.08 3.05-7.44 7-8.77V7c0 1.66 1.34 3 3 3 2.76 0 5-2.24 5-5 0-.71-.15-1.39-.42-2 3.66 1.83 6.42 5.58 6.42 10 0 5.52-4.48 10-10 10z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between text-[11px] font-bold text-neutral-800 mb-1">
                          <span className="truncate">Active Burn</span>
                          <span className="text-orange-700 font-mono font-bold">640 kcal</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full w-[78%]" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Right Floating Frosted-Glass Widget: Habit Streak (Shifted Down Under "with Our") */}
                    <motion.div
                      initial={{ opacity: 0, x: 16, rotate: 3 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        y: [0, -7, 0],
                        rotate: 3,
                      }}
                      whileHover={{ scale: 1.04, rotate: 0 }}
                      transition={{
                        opacity: { duration: 0.8, delay: 0.45 },
                        x: { duration: 0.8, delay: 0.45 },
                        y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                        scale: { duration: 0.2 },
                        rotate: { duration: 0.2 },
                      }}
                      className="hidden lg:flex items-center gap-3 absolute top-[44%] xl:top-[46%] right-0 lg:-right-3 xl:right-0 rotate-3 z-20 backdrop-blur-md bg-white/90 border border-neutral-200/80 shadow-md hover:shadow-lg rounded-2xl p-3 w-56 select-none cursor-pointer transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-600 shadow-xs">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 23c-4.97 0-9-4.03-9-9 0-4.08 3.05-7.44 7-8.77V7c0 1.66 1.34 3 3 3 2.76 0 5-2.24 5-5 0-.71-.15-1.39-.42-2 3.66 1.83 6.42 5.58 6.42 10 0 5.52-4.48 10-10 10z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between text-[11px] font-bold text-neutral-800 mb-1.5">
                          <span className="truncate">Habit Streak</span>
                          <span className="text-amber-700 font-mono font-bold">14 Days 🔥</span>
                        </div>
                        {/* 7 Orange Streak Activity Indicators */}
                        <div className="flex items-center gap-1.5">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                            <div
                              key={idx}
                              className="w-3.5 h-2 rounded-full bg-amber-500 shadow-xs"
                              title={`${day}: Active`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    <h1 className="font-['Manrope'] text-[26px] xs:text-[32px] sm:text-[46px] lg:text-[58px] xl:text-[66px] text-[#1c1b1f] tracking-tight font-bold leading-[1.18] sm:leading-[1.08] mb-3 flex flex-col items-center">
                      <motion.span
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                        className="block"
                      >
                        Level Up Your
                      </motion.span>

                      <motion.span
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-1"
                      >
                        <span>Fitness</span>

                        {/* Interactive Orange Capsule Pill with Continuous ECG Waveform & "Active Sync" Badge */}
                        <div className="relative inline-flex items-center group mx-1 sm:mx-2 md:mx-3 align-middle">
                          {/* "Active Sync" Floating Micro-Badge */}
                          <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute scale-90 sm:scale-100 -top-3 sm:-top-3.5 right-0 sm:right-1 z-30 px-2 sm:px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm border border-orange-200/80 shadow-[0_4px_10px_rgba(0,0,0,0.06)] flex items-center gap-1.5 select-none pointer-events-none"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight text-neutral-800 whitespace-nowrap">
                              Active Sync
                            </span>
                          </motion.div>

                          {/* Hover Tooltip Badge */}
                          <div className="absolute -top-11 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-top-12 transition-all duration-200 pointer-events-none z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900/95 text-white text-[11px] font-semibold whitespace-nowrap shadow-lg backdrop-blur-xs border border-white/10 select-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>142 BPM • Live Sync</span>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45" />
                          </div>

                          {/* Orange Capsule Base */}
                          <motion.span
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ opacity: { duration: 0.7, delay: 0.28 }, scale: { duration: 0.3 } }}
                            className="relative inline-flex items-center justify-center w-16 xs:w-20 sm:w-26 md:w-[108px] h-8 sm:h-11 md:h-[54px] rounded-full bg-gradient-to-b from-[#FFB340] to-[#F97316] shadow-[0_12px_28px_-6px_rgba(249,115,22,0.55),inset_0_2px_4px_rgba(255,255,255,0.45)] px-2 sm:px-3 overflow-hidden cursor-pointer shrink-0"
                          >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
                            <svg
                              className="w-10 sm:w-14 md:w-16 h-5 sm:h-7 text-white drop-shadow-sm overflow-visible"
                              viewBox="0 0 64 24"
                              fill="none"
                              stroke="#FFFFFF"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <motion.path
                                d="M2 12h12l3-7 5 14 5-11 4 7 3-3h18"
                                strokeDasharray="64"
                                animate={{ strokeDashoffset: [64, 0, -64] }}
                                transition={{
                                  duration: 2.2,
                                  repeat: Infinity,
                                  ease: 'linear',
                                }}
                              />
                            </svg>
                            <span className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                          </motion.span>
                        </div>

                        <span>with Our</span>
                      </motion.span>

                      {/* Editorial FitFlow app with Hand-Crafted Double-Stroke Underline */}
                      <motion.span
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
                        className="relative inline-block mt-2 font-['Instrument_Serif',Georgia,serif] italic font-normal tracking-normal text-[#1c1b1f] text-[1.12em]"
                      >
                        <span>FitFlow app</span>
                        {/* Double-Stroke Hand-Crafted SVG Underline */}
                        <svg
                          className="absolute -bottom-3 left-0 w-full h-[14px] pointer-events-none overflow-visible"
                          viewBox="0 0 320 16"
                          fill="none"
                        >
                          <motion.path
                            d="M 4 9 Q 160 3 316 8"
                            stroke="#171717"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                          />
                          <motion.path
                            d="M 28 13 Q 165 9 292 12"
                            stroke="#171717"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeOpacity="0.75"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
                          />
                        </svg>
                      </motion.span>
                    </h1>

                    {/* Editorial Clean Sub-Headline */}
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
                      className="mt-5 max-w-lg mx-auto text-center text-neutral-500 text-base md:text-lg leading-relaxed font-normal px-2"
                    >
                      Built for everyday athletes. Sync your reps, heart-rate zones, and daily recovery in one fluid workspace.
                    </motion.p>

                    {/* Mobile/Tablet Floating Interactive Cards Row (Visible on < lg screens, fully responsive) */}
                    <div className="grid grid-cols-2 lg:hidden gap-2 sm:gap-3 mt-6 sm:mt-7 select-none px-2 z-20 w-full max-w-[340px] xs:max-w-[360px] mx-auto">
                      {/* Left Floating Card: Active Burn */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{
                          opacity: 1,
                          y: [0, -5, 0],
                        }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{
                          opacity: { duration: 0.6, delay: 0.4 },
                          y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                          scale: { duration: 0.2 },
                        }}
                        className="flex items-center gap-2 backdrop-blur-md bg-white/90 border border-neutral-200/80 shadow-md rounded-2xl p-2.5 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-orange-600 shadow-xs">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 23c-4.97 0-9-4.03-9-9 0-4.08 3.05-7.44 7-8.77V7c0 1.66 1.34 3 3 3 2.76 0 5-2.24 5-5 0-.71-.15-1.39-.42-2 3.66 1.83 6.42 5.58 6.42 10 0 5.52-4.48 10-10 10z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-[10px] font-bold text-neutral-800 leading-tight">
                            Active Burn
                          </div>
                          <div className="text-orange-700 font-mono font-bold text-[10px] mb-1">
                            640 kcal
                          </div>
                          <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full w-[78%]" />
                          </div>
                        </div>
                      </motion.div>

                      {/* Right Floating Card: Habit Streak */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{
                          opacity: 1,
                          y: [0, -6, 0],
                        }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{
                          opacity: { duration: 0.6, delay: 0.5 },
                          y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
                          scale: { duration: 0.2 },
                        }}
                        className="flex items-center gap-2 backdrop-blur-md bg-white/90 border border-neutral-200/80 shadow-md rounded-2xl p-2.5 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-600 shadow-xs">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 23c-4.97 0-9-4.03-9-9 0-4.08 3.05-7.44 7-8.77V7c0 1.66 1.34 3 3 3 2.76 0 5-2.24 5-5 0-.71-.15-1.39-.42-2 3.66 1.83 6.42 5.58 6.42 10 0 5.52-4.48 10-10 10z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-[10px] font-bold text-neutral-800 leading-tight">
                            Habit Streak
                          </div>
                          <div className="text-amber-700 font-mono font-bold text-[10px] mb-1">
                            14 Days 🔥
                          </div>
                          {/* 7 Orange Streak Activity Indicators */}
                          <div className="flex items-center gap-0.5">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                              <div
                                key={idx}
                                className="w-2.5 h-1 rounded-full bg-amber-500 shadow-xs"
                                title={`${day}: Active`}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Hero Social Proof Split Row: Stacked Avatars + Rating (Left) & Download CTA (Right) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.44 }}
                    className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center sm:items-end justify-between mt-8 sm:mt-14 md:mt-20 px-4 sm:px-6 gap-6 sm:gap-0"
                  >
                    {/* Human Social Proof Block */}
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                      <div
                        className="flex items-center gap-1.5 mb-2 whitespace-nowrap"
                        role="img"
                        aria-label="Rated 4.9 out of 5 stars based on 850+ reviews"
                      >
                        <div className="flex text-amber-500 text-xs sm:text-sm tracking-tight" aria-hidden="true">
                          <span aria-hidden="true">★</span>
                          <span aria-hidden="true">★</span>
                          <span aria-hidden="true">★</span>
                          <span aria-hidden="true">★</span>
                          <span aria-hidden="true">★</span>
                        </div>
                        <span className="text-xs font-bold text-[#1c1b1f] ml-1">4.9</span>
                        <span className="text-xs text-[#423E45] font-medium ml-1">Rating (850+ reviews)</span>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-3.5">
                        <div className="flex -space-x-2 sm:-space-x-2.5 overflow-hidden py-0.5 shrink-0">
                          {[
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces',
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces',
                            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces',
                            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces',
                          ].map((avatarUrl, i) => (
                            <img
                              key={i}
                              src={avatarUrl}
                              alt="Active Athlete Member"
                              className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-white object-cover shadow-xs"
                            />
                          ))}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-lg sm:text-2xl font-bold text-[#1c1b1f] tracking-tight leading-none">
                            2K+ MEMBERS
                          </span>
                          <span className="text-xs font-semibold text-[#423E45] mt-1 whitespace-nowrap">
                            500+ Guided Fitness Tutorials
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom-Right CTA Actions Cluster */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 shrink-0">
                      {/* Secondary Interactive Pill Button: Watch 45s Demo */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const el = document.getElementById('section-scroll-expand');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group inline-flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full bg-white hover:bg-neutral-50 shadow-sm border border-neutral-200/80 hover:border-neutral-300 transition-all duration-200 cursor-pointer"
                      >
                        {/* w-7 h-7 rounded-full video preview with play icon overlay */}
                        <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 shadow-xs ring-1 ring-black/5 bg-neutral-900 flex items-center justify-center">
                          <video
                            src="/flow_video.mp4"
                            muted
                            loop
                            autoPlay
                            playsInline
                            aria-label="FitFlow 45-second preview demo video"
                            className="w-full h-full object-cover scale-150 opacity-80"
                          >
                            <track kind="captions" src="data:text/vtt,WEBVTT" label="No speech" default />
                          </video>
                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                            <svg aria-hidden="true" className="w-3.5 h-3.5 text-white fill-current translate-x-0.5" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm text-neutral-800 font-semibold tracking-tight">
                          Watch 45s Demo
                        </span>
                      </motion.button>

                      {/* Download Button */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const el = document.getElementById('section-scroll-expand');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group inline-flex items-center gap-3 pl-5 pr-2 py-1.5 rounded-full bg-[#f7f2f8] hover:bg-[#f2ecf3] shadow-sm border border-[#E7E2E8] hover:border-[#B6A6BE] transition-all duration-300 cursor-pointer"
                      >
                        <span className="text-xs sm:text-sm text-[#1c1b1f] font-semibold group-hover:text-[#6a527c] transition-colors tracking-wide">
                          Download
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#ffbd5a] text-[#744c00] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                          <svg
                            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                          </svg>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                </section>
              </div>

              {/* ========================================================= */}
              {/* 2. SCROLL-EXPAND VIDEO / MEDIA SECTION                    */}
              {/* ========================================================= */}
              <section className="w-full relative mt-12 sm:mt-16 md:mt-20" id="section-scroll-expand">
                <ScrollExpand
                  src="/flow_video.mp4"
                  mediaType="video"
                  poster="/runner_hero.jpg"
                  alt="FitFlow Athletic Runner Video"
                  title="Track Every Motion"
                  scrollHint="SCROLL"
                  startWidth={42}
                  startHeight={56}
                  startRadius={28}
                  endRadius={0}
                  mediaZoom={1.2}
                  overlayScrim={0.4}
                >
                  <div className="max-w-xl text-white px-4 flex flex-col items-center">
                    <span className="px-3.5 py-1 rounded-full bg-[#ffbd5a] text-[#291800] text-xs font-bold tracking-normal mb-3 shadow-md">
                      Smart Fitness Engine
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-bold text-white drop-shadow-md leading-tight mb-3 [text-wrap:balance]">
                      Every Rep, Every Milestone
                    </h2>
                    <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-6 max-w-md [text-wrap:pretty]">
                      FitFlow tracks your workouts, water, calories, and daily streaks in one simple place.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigateTo('services')}
                      className="px-6 py-2.5 rounded-full bg-[#ffbd5a] text-[#291800] font-bold text-sm hover:brightness-105 active:scale-95 transition-all shadow-md cursor-pointer"
                    >
                      Explore Services & Tracks ↗
                    </button>
                  </div>
                </ScrollExpand>
              </section>

              {/* ========================================================= */}
              {/* 3. ATHLETIC COMMUNITY SECTION                             */}
              {/* ========================================================= */}
              <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative">
                <section className="w-full my-10 sm:my-16" id="section-community">
                  <div className="w-full bg-white rounded-[32px] px-6 py-12 sm:px-12 sm:py-16 border border-[#E7E2E8] shadow-[0_8px_24px_rgba(49,37,55,0.05)] text-center relative overflow-hidden flex flex-col items-center">
                    <span className="text-xs font-bold text-[#4c355d] tracking-wider uppercase mb-3 px-3.5 py-1 rounded-full bg-[#f2ecf3]">
                      Athletic Community
                    </span>

                    <h2 className="max-w-2xl font-['Manrope'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1c1b1f] tracking-tight leading-snug mb-4 [text-wrap:balance]">
                      Built for athletes committed to{' '}
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ffddb2] text-[#291800]">
                        progressive
                      </span>{' '}
                      discipline
                    </h2>

                    <p className="max-w-md text-sm sm:text-base text-[#423E45] leading-relaxed mb-8 [text-wrap:pretty]">
                      Join 2,000+ athletes who track workouts, share progress, and stay motivated together every day.
                    </p>

                    <div className="w-full pt-8 border-t border-[#E7E2E8] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#423E45]">
                      <span className="text-sm font-medium text-[#423E45]">FitFlow Athlete Network</span>

                      <div className="flex items-center gap-4 text-[#423E45]">
                        <motion.a
                          whileHover={{ scale: 1.15 }}
                          href="mailto:contact@fitflow.app"
                          className="hover:text-[#6a527c] transition-colors p-1"
                          aria-label="Email Contact"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                        </motion.a>
                        <motion.a
                          whileHover={{ scale: 1.15 }}
                          href="#home"
                          className="hover:text-[#6a527c] transition-colors p-1"
                          aria-label="Phone Contact"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </motion.a>
                        <motion.a
                          whileHover={{ scale: 1.15 }}
                          href="#home"
                          className="hover:text-[#6a527c] transition-colors p-1"
                          aria-label="Instagram Channel"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                          </svg>
                        </motion.a>
                      </div>

                      <span className="text-xs text-[#423E45] font-medium">
                        FitFlow Collective • 2026
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            </motion.main>
          )}
        </AnimatePresence>

        {/* ============================================== */}
        {/* FOOTER                                         */}
        {/* ============================================== */}
        <footer className="w-full border-t border-[#E7E2E8] bg-white py-10 px-6 lg:px-12 mt-12">
          <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/icon.png"
                alt="FitFlow Logo"
                className="w-7 h-7 rounded-lg object-contain shadow-sm"
              />
              <span className="font-['Manrope'] text-[17px] text-[#1c1b1f] font-bold">
                Fitflow app
              </span>
              <span className="text-[#57535A] text-[13px] ml-2 font-medium">
                © 2026 Fitflow. All rights reserved.
              </span>
            </div>

            <div className="flex items-center gap-6 text-[13px] font-semibold text-[#57535A]">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="hover:text-[#1c1b1f] transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => navigateTo('services')}
                className="hover:text-[#1c1b1f] transition-colors cursor-pointer"
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => navigateTo('about')}
                className="hover:text-[#1c1b1f] transition-colors cursor-pointer"
              >
                About
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
