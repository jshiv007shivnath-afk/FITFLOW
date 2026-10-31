'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ScrollExpand from '@/components/reactbits/ScrollExpand';
import { ServicesView } from '@/components/landing/ServicesView';
import { AboutView } from '@/components/landing/AboutView';
import { AthleteConsoleSection } from '@/components/landing/AthleteConsoleSection';
import { WeeklyTimelineSection } from '@/components/landing/WeeklyTimelineSection';
import { HardwareSyncSection } from '@/components/landing/HardwareSyncSection';
import { SportsScienceMethodologySection } from '@/components/landing/SportsScienceMethodologySection';
import { RealAthleteLogsSection } from '@/components/landing/RealAthleteLogsSection';
import { ComparisonMatrixSection } from '@/components/landing/ComparisonMatrixSection';
import { AthleteFaqSection } from '@/components/landing/AthleteFaqSection';
import { AthleteCtaSection } from '@/components/landing/AthleteCtaSection';

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
        <header className="w-full h-[68px] sm:h-[80px] border-b border-[#E7E2E8] bg-white/95 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 lg:px-12">
          <div className="max-w-[1240px] mx-auto h-full flex items-center justify-between gap-4">
            {/* Left: Brand + Refined Pill Capsule */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <img
                  src="/icon.png"
                  alt="FitFlow Logo"
                  className="w-8 h-8 rounded-full object-contain shadow-xs group-hover:scale-105 transition-transform"
                />
                <span className="font-semibold text-neutral-900 text-[18px] tracking-tight">
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

            {/* Right Action CTAs */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (currentView !== 'home') navigateTo('home');
                  const el = document.getElementById('section-scroll-expand');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hidden sm:inline-flex items-center gap-2 h-[42px] px-5 rounded-full bg-[#FBFAFC] border border-[#E7E2E8] hover:border-[#B6A6BE] text-[#57535A] hover:text-[#1c1b1f] text-[13px] font-semibold transition-all group cursor-pointer shadow-sm"
              >
                <span>Download now</span>
                <span className="material-symbols-outlined text-[16px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  north_east
                </span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={onLaunchApp}
                title="Launch Fitflow App"
                className="w-10 h-10 rounded-full bg-[#6a527c] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-sm hover:bg-[#5a426c] transition-colors"
                aria-label="User Profile"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
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
              className="flex-1 w-full bg-white relative"
            >
              {/* Subtle High-Craft Ambient Lighting Vignette (Replaces mechanical AI grid per anti-slop R-07) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_50%_at_50%_18%,rgba(255,189,90,0.08),transparent_75%)] z-0"
              />

              <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10" id="home">
                {/* ============================================== */}
                {/* HERO SECTION (APPLE / LINEAR MINIMALIST UI)    */}
                {/* ============================================== */}
                <section className="w-full pt-8 sm:pt-14 md:pt-20 pb-10 sm:pb-16 md:pb-20 min-h-[auto] sm:min-h-[calc(80vh-80px)] flex flex-col items-center justify-center relative">
                  {/* Centered Editorial Display Headline with Floating Frosted-Glass Micro-Widgets */}
                  <div className="relative w-full max-w-5xl text-center select-none z-10">
                    {/* Left Floating Frosted-Glass Widget (Tilted -3deg, Snug & Balanced within Hero Container) */}
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
                      className="hidden lg:flex items-center gap-3 absolute top-1 xl:top-3 left-2 lg:left-6 xl:left-10 -rotate-3 z-20 backdrop-blur-md bg-white/90 border border-neutral-200/80 shadow-md hover:shadow-lg rounded-2xl p-3 w-52 select-none cursor-pointer transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-orange-600 shadow-xs">
                        <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
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

                    {/* Right Floating Frosted-Glass Widget: Habit Streaks (Tilted 3deg, Snug & Balanced within Hero Container) */}
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
                      className="hidden lg:flex items-center gap-3 absolute top-3 xl:top-5 right-2 lg:right-6 xl:right-10 rotate-3 z-20 backdrop-blur-md bg-white/90 border border-neutral-200/80 shadow-md hover:shadow-lg rounded-2xl p-3 w-56 select-none cursor-pointer transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-600 shadow-xs">
                        <motion.span
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          className="material-symbols-outlined text-[22px] text-amber-600"
                        >
                          local_fire_department
                        </motion.span>
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

                    <h1 className="font-['Manrope'] text-[28px] xs:text-[34px] sm:text-[48px] lg:text-[60px] xl:text-[68px] text-[#1c1b1f] tracking-tight font-bold leading-[1.12] sm:leading-[1.08] mb-3 flex flex-col items-center">
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
                        className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-1"
                      >
                        <span>Fitness</span>

                        {/* Interactive Orange Pill with Continuous ECG Waveform Pulse & Hover Tooltip */}
                        <div className="relative inline-flex items-center group">
                          {/* Hover Tooltip Badge */}
                          <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-top-10 transition-all duration-200 pointer-events-none z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900/95 text-white text-[11px] font-semibold whitespace-nowrap shadow-lg backdrop-blur-xs border border-white/10 select-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>142 BPM • Live Sync</span>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45" />
                          </div>

                          <motion.span
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ opacity: { duration: 0.7, delay: 0.28 }, scale: { duration: 0.3 } }}
                            className="relative inline-flex items-center justify-center w-16 xs:w-20 sm:w-26 md:w-32 h-8 sm:h-11 md:h-14 rounded-full bg-gradient-to-r from-[#ffbe5b] via-[#ffa726] to-[#ff9800] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.6),_0_8px_24px_rgba(255,167,38,0.32)] px-2 sm:px-3 overflow-hidden cursor-pointer shrink-0"
                          >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
                            <svg
                              className="w-10 sm:w-14 md:w-16 h-5 sm:h-7 text-white drop-shadow-sm overflow-visible"
                              viewBox="0 0 64 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.8"
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
                            <motion.span
                              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                              className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]"
                            />
                          </motion.span>
                        </div>

                        <span>with Our</span>
                      </motion.span>

                      <motion.span
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
                        className="relative inline-flex items-center justify-center mt-2 font-['Instrument_Serif',Georgia,serif] italic font-normal tracking-normal text-[#1c1b1f] text-[1.12em]"
                      >
                        FitFlow app
                      </motion.span>
                    </h1>

                    {/* Editorial Clean Sub-Headline */}
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
                      className="mt-5 max-w-lg mx-auto text-center text-neutral-500 text-base md:text-lg leading-relaxed font-normal"
                    >
                      Built for everyday athletes. Sync your reps, heart-rate zones, and daily recovery in one fluid workspace.
                    </motion.p>

                    {/* Mobile/Tablet Floating Interactive Cards Row (Visible on < lg screens) */}
                    <div className="flex lg:hidden items-center justify-center gap-3 mt-6 sm:mt-7 flex-wrap select-none px-2 z-20">
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
                        className="flex items-center gap-2.5 backdrop-blur-md bg-white/90 border border-neutral-200/80 shadow-md rounded-2xl p-2.5 sm:p-3 w-[168px] sm:w-56 cursor-pointer"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-orange-600 shadow-xs">
                          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">local_fire_department</span>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-neutral-800 mb-1">
                            <span className="truncate">Active Burn</span>
                            <span className="text-orange-700 font-mono font-bold">640 kcal</span>
                          </div>
                          <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
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
                        className="flex items-center gap-2.5 backdrop-blur-md bg-white/90 border border-neutral-200/80 shadow-md rounded-2xl p-2.5 sm:p-3 w-[184px] sm:w-60 cursor-pointer"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-600 shadow-xs">
                          <motion.span
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="material-symbols-outlined text-[18px] sm:text-[22px] text-amber-600"
                          >
                            local_fire_department
                          </motion.span>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-neutral-800 mb-1.5">
                            <span className="truncate">Habit Streak</span>
                            <span className="text-amber-700 font-mono font-bold">14 Days 🔥</span>
                          </div>
                          {/* 7 Orange Streak Activity Indicators */}
                          <div className="flex items-center gap-1">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                              <div
                                key={idx}
                                className="w-2.5 sm:w-3.5 h-1.5 sm:h-2 rounded-full bg-amber-500 shadow-xs"
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
                      <div className="flex items-center gap-1.5 mb-2 whitespace-nowrap">
                        <div className="flex text-amber-500 text-[13px] sm:text-[14px] tracking-tight">
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                        </div>
                        <span className="text-[12px] font-bold text-[#1c1b1f] ml-1">4.9</span>
                        <span className="text-[12px] text-[#57535A] font-medium ml-1">Rating (850+ reviews)</span>
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
                          <span className="text-[17px] sm:text-[22px] font-bold text-[#1c1b1f] tracking-tight leading-none">
                            2K+ MEMBERS
                          </span>
                          <span className="text-[11px] sm:text-[12px] font-semibold text-[#57535A] mt-1 whitespace-nowrap">
                            500+ Guided Fitness Tutorials
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom-Right CTA Actions Cluster */}
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
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
                            className="w-full h-full object-cover scale-150 opacity-80"
                          />
                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px] text-white material-symbols-fill">
                              play_arrow
                            </span>
                          </div>
                        </div>
                        <span className="text-[13px] text-neutral-800 font-semibold tracking-tight">
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
                        className="group inline-flex items-center gap-3 pl-6 pr-2 py-1.5 rounded-full bg-[#f7f2f8] hover:bg-[#f2ecf3] shadow-sm border border-[#E7E2E8] hover:border-[#B6A6BE] transition-all duration-300 cursor-pointer"
                      >
                        <span className="text-[13px] text-[#1c1b1f] font-semibold group-hover:text-[#6a527c] transition-colors tracking-wide">
                          Download
                        </span>
                        <div className="w-9 h-9 rounded-full bg-[#ffbd5a] text-[#744c00] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                          <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 font-bold">
                            north_east
                          </span>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                </section>
              </div>

              {/* ========================================================= */}
              {/* SCROLL-EXPAND VIDEO / MEDIA SECTION                       */}
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
                    <span className="px-3.5 py-1 rounded-full bg-[#ffbd5a] text-[#291800] text-[12px] font-bold uppercase tracking-wider mb-3 shadow-md">
                      Smart Fitness Engine
                    </span>
                    <h2 className="text-[28px] sm:text-[42px] font-bold text-white drop-shadow-md leading-tight mb-3 [text-wrap:balance]">
                      Every Rep, Every Milestone
                    </h2>
                    <p className="text-[14px] sm:text-[16px] text-white/90 leading-relaxed mb-6 max-w-md [text-wrap:pretty]">
                      FitFlow synchronizes your daily workout sets, water intake, calorie burns, and streak milestones into a fluid, visual experience.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigateTo('services')}
                      className="px-7 py-3 rounded-full bg-[#ffbd5a] text-[#291800] font-bold text-[14px] hover:scale-105 active:scale-95 transition-transform shadow-lg cursor-pointer"
                    >
                      Explore Services & Tracks ↗
                    </button>
                  </div>
                </ScrollExpand>
              </section>

              {/* ========================================================= */}
              {/* 1. ATHLETE CONSOLE (DAILY PERFORMANCE MATRIX)             */}
              {/* ========================================================= */}
              <AthleteConsoleSection />

              {/* ========================================================= */}
              {/* 2. THE WEEK IN MOTION (PERIODIZATION & TIMELINE)          */}
              {/* ========================================================= */}
              <WeeklyTimelineSection />

              {/* ========================================================= */}
              {/* 3. HARDWARE & SENSOR SYNC ECOSYSTEM                       */}
              {/* ========================================================= */}
              <HardwareSyncSection />

              {/* ========================================================= */}
              {/* 4. SPORTS SCIENCE METHODOLOGY & ALGORITHMS                */}
              {/* ========================================================= */}
              <SportsScienceMethodologySection />

              {/* ========================================================= */}
              {/* 5. VERIFIED REAL ATHLETE LOGS & TRAINING ARCHIVES         */}
              {/* ========================================================= */}
              <RealAthleteLogsSection />

              {/* ========================================================= */}
              {/* 6. SYSTEM COMPARISON MATRIX (FITFLOW VS GENERIC APPS)     */}
              {/* ========================================================= */}
              <ComparisonMatrixSection />

              {/* ========================================================= */}
              {/* 7. ATHLETE FAQ (SPORTS SCIENCE & GYM FLOOR MECHANICS)     */}
              {/* ========================================================= */}
              <AthleteFaqSection />

              {/* ========================================================= */}
              {/* 8. ATHLETIC COMMUNITY SECTION                             */}
              {/* ========================================================= */}
              <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative">
                <section className="w-full my-12" id="section-community">
                  <div className="w-full bg-white rounded-[32px] px-6 py-12 sm:px-12 sm:py-16 border border-[#E7E2E8] shadow-[0_8px_24px_rgba(49,37,55,0.05)] text-center relative overflow-hidden flex flex-col items-center">
                    <span className="text-[12px] font-bold text-[#6a527c] tracking-wider uppercase mb-3 px-3.5 py-1 rounded-full bg-[#f2ecf3]">
                      Athletic Community
                    </span>

                    <h2 className="max-w-2xl font-['Manrope'] text-[28px] sm:text-[34px] font-bold text-[#1c1b1f] tracking-tight leading-snug mb-4 [text-wrap:balance]">
                      Built for athletes committed to{' '}
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ffddb2] text-[#291800]">
                        progressive
                      </span>{' '}
                      discipline
                    </h2>

                    <p className="max-w-md text-[15px] text-[#57535A] leading-relaxed mb-8 [text-wrap:pretty]">
                      Join 2,000+ members logging workouts, sharing recovery milestones, and staying accountable every day in a supportive team environment.
                    </p>

                    <div className="w-full pt-8 border-t border-[#E7E2E8] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#57535A]">
                      <span className="text-[14px] font-medium text-[#57535A]">FitFlow Athlete Network</span>

                      <div className="flex items-center gap-4 text-[#57535A]">
                        <motion.a
                          whileHover={{ scale: 1.15 }}
                          href="mailto:contact@fitflow.app"
                          className="hover:text-[#6a527c] transition-colors"
                          aria-label="Email Contact"
                        >
                          <span className="material-symbols-outlined text-[20px]">mail</span>
                        </motion.a>
                        <motion.a
                          whileHover={{ scale: 1.15 }}
                          href="#home"
                          className="hover:text-[#6a527c] transition-colors"
                          aria-label="Phone Contact"
                        >
                          <span className="material-symbols-outlined text-[20px]">call</span>
                        </motion.a>
                        <motion.a
                          whileHover={{ scale: 1.15 }}
                          href="#home"
                          className="hover:text-[#6a527c] transition-colors"
                          aria-label="Instagram Channel"
                        >
                          <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                        </motion.a>
                      </div>

                      <span className="text-[13px] text-[#57535A] font-medium">
                        FitFlow Collective • 2026
                      </span>
                    </div>
                  </div>
                </section>
              </div>

              {/* ========================================================= */}
              {/* 9. ATHLETE CTA & PLATFORM HUB                             */}
              {/* ========================================================= */}
              <AthleteCtaSection onLaunchApp={onLaunchApp} />
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
