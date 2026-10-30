'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ScrollExpand from '@/components/reactbits/ScrollExpand';
import { ServicesView } from '@/components/landing/ServicesView';
import { AboutView } from '@/components/landing/AboutView';

interface RuangEditLandingPageProps {
  onLaunchApp?: () => void;
}

export function RuangEditLandingPage({ onLaunchApp }: RuangEditLandingPageProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<'home' | 'services' | 'about'>('home');

  const scrollCarousel = (offset: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

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
        <header className="w-full h-[80px] border-b border-[#E7E2E8] bg-white/95 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 lg:px-12">
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
                  className="w-8 h-8 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
                />
                <span className="font-['Manrope'] text-[18px] font-bold text-[#1c1b1f] tracking-tight">
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
              {/* Subtle High-Craft Architectural Grid with Radial Mask */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] z-0"
              />

              <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10" id="home">
                {/* ============================================== */}
                {/* HERO SECTION (APPLE / LINEAR MINIMALIST UI)    */}
                {/* ============================================== */}
                <section className="w-full pt-12 pb-12 flex flex-col items-center relative">
                  {/* Centered Version Pill Badge with Pulsing Emerald Status Dot */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-center mb-6"
                  >
                    <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-neutral-100/90 hover:bg-neutral-100 border border-neutral-200/70 rounded-full shadow-xs transition-colors backdrop-blur-xs select-none">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="text-[12px] font-semibold text-neutral-800 tracking-tight">
                        FitFlow 1.0.0
                      </span>
                      <span className="text-neutral-300 text-[11px]">|</span>
                      <span className="text-[12px] font-medium text-neutral-500 font-mono">
                        2026.04
                      </span>
                    </div>
                  </motion.div>

                  {/* Centered Editorial Display Headline with Floating Frosted-Glass Micro-Widgets */}
                  <div className="relative w-full max-w-4xl text-center select-none z-10">
                    {/* Left Floating Frosted-Glass Widget (Tilted -3deg) */}
                    <motion.div
                      initial={{ opacity: 0, x: -20, rotate: -3 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        y: [0, -6, 0],
                        rotate: -3,
                      }}
                      transition={{
                        opacity: { duration: 0.8, delay: 0.4 },
                        x: { duration: 0.8, delay: 0.4 },
                        y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                      }}
                      className="hidden lg:flex items-center gap-3 absolute -left-12 xl:-left-24 top-6 z-20 backdrop-blur-md bg-white/80 border border-neutral-200/60 shadow-lg rounded-2xl p-3 w-56 select-none pointer-events-none"
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-orange-500 shadow-xs">
                        <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between text-[11px] font-bold text-neutral-800 mb-1">
                          <span className="truncate">Active Burn</span>
                          <span className="text-orange-600 font-mono font-bold">640 kcal</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full w-[78%]" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Right Floating Frosted-Glass Widget (Tilted 3deg) */}
                    <motion.div
                      initial={{ opacity: 0, x: 20, rotate: 3 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        y: [0, -7, 0],
                        rotate: 3,
                      }}
                      transition={{
                        opacity: { duration: 0.8, delay: 0.5 },
                        x: { duration: 0.8, delay: 0.5 },
                        y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
                      }}
                      className="hidden lg:flex items-center gap-3 absolute -right-12 xl:-right-24 top-16 z-20 backdrop-blur-md bg-white/80 border border-neutral-200/60 shadow-lg rounded-2xl p-3 w-60 select-none pointer-events-none"
                    >
                      <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-500 shadow-xs">
                        <motion.span
                          animate={{ scale: [1, 1.18, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                          className="material-symbols-outlined text-[20px]"
                        >
                          favorite
                        </motion.span>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-[11px] font-bold text-neutral-800 truncate mb-1">
                          Zone 4 Cardio • <span className="text-rose-600 font-mono font-bold">142 BPM</span>
                        </div>
                        <div className="flex items-end gap-1 h-3">
                          {[40, 75, 100, 60, 90, 45, 80].map((h, i) => (
                            <motion.span
                              key={i}
                              animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.4}%`] }}
                              transition={{ duration: 1.2 + (i % 3) * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                              className="w-1 rounded-full bg-rose-400"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    <h1 className="font-['Manrope'] text-[38px] sm:text-[54px] lg:text-[72px] text-[#1c1b1f] tracking-tight font-bold leading-[1.08] mb-3 flex flex-col items-center">
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
                        className="inline-flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-1"
                      >
                        <span>Fitness</span>

                        {/* Interactive Orange Pill with Animated SVG ECG Heart-Rate Waveform & Inner Glow */}
                        <motion.span
                          initial={{ opacity: 0, scale: 0.88 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ opacity: { duration: 0.7, delay: 0.28 }, scale: { duration: 0.3 } }}
                          className="relative inline-flex items-center justify-center w-24 sm:w-28 md:w-32 h-10 sm:h-12 md:h-14 rounded-full bg-gradient-to-r from-[#ffbe5b] via-[#ffa726] to-[#ff9800] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.6),_0_8px_24px_rgba(255,167,38,0.32)] px-3 overflow-hidden cursor-pointer group"
                        >
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
                          <svg
                            className="w-14 sm:w-16 h-7 text-white drop-shadow-sm"
                            viewBox="0 0 64 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <motion.path
                              d="M2 12h12l3-7 5 14 5-11 4 7 3-3h18"
                              initial={{ pathLength: 0.8, opacity: 0.9 }}
                              animate={{
                                pathLength: [0.6, 1, 0.6],
                                opacity: [0.8, 1, 0.8],
                              }}
                              transition={{
                                duration: 2.2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            />
                          </svg>
                          <motion.span
                            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute right-2.5 top-2.5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]"
                          />
                        </motion.span>

                        <span>with Our</span>
                      </motion.span>

                      <motion.span
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
                        className="relative inline-flex flex-col items-center justify-center mt-2"
                      >
                        <span className="relative z-10">FitFlow app</span>
                        {/* Clean Animated SVG Underline beneath "FitFlow" */}
                        <svg
                          className="w-[115%] h-3 sm:h-4 text-[#846a96] -mt-1 sm:-mt-1.5 pointer-events-none overflow-visible"
                          viewBox="0 0 240 16"
                          fill="none"
                        >
                          <motion.path
                            d="M4 11C54 4 154 3 236 10"
                            stroke="#846a96"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </svg>
                      </motion.span>
                    </h1>
                  </div>

                  {/* Hero Social Proof Split Row: Stacked Avatars + Rating (Left) & Download CTA (Right) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.44 }}
                    className="w-full max-w-[1080px] mt-10 md:mt-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2 sm:px-4"
                  >
                    {/* Human Social Proof Block */}
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="flex text-amber-500 text-[14px] tracking-tight">
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                        </div>
                        <span className="text-[12px] font-bold text-[#1c1b1f] ml-1">4.9</span>
                        <span className="text-[12px] text-[#57535A] font-medium">★ Rating (850+ reviews)</span>
                      </div>

                      <div className="flex items-center gap-3.5">
                        <div className="flex -space-x-2.5 overflow-hidden py-0.5">
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
                              className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-xs"
                            />
                          ))}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[18px] sm:text-[22px] font-bold text-[#1c1b1f] tracking-tight leading-none">
                            2K+ MEMBERS
                          </span>
                          <span className="text-[12px] font-semibold text-[#57535A] mt-1">
                            500+ Guided Fitness Tutorials
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Download Button */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const el = document.getElementById('section-scroll-expand');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="group inline-flex items-center gap-3 pl-6 pr-2 py-1.5 rounded-full bg-[#f7f2f8] hover:bg-[#f2ecf3] shadow-sm border border-[#E7E2E8] hover:border-[#B6A6BE] transition-all duration-300 cursor-pointer self-start sm:self-auto"
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
                    <h2 className="text-[28px] sm:text-[42px] font-bold text-white drop-shadow-md leading-tight mb-3">
                      Every Rep, Every Milestone
                    </h2>
                    <p className="text-[14px] sm:text-[16px] text-white/90 leading-relaxed mb-6 max-w-lg">
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

              {/* BOTTOM CONTAINER: CAROUSEL, FEATURES, COMMUNITY */}
              <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* ============================================== */}
                {/* FEATURED ILLUSTRATION CAROUSEL                 */}
                {/* ============================================== */}
                <div className="w-full max-w-[1140px] mx-auto mt-6 mb-16 flex items-center justify-center gap-3 sm:gap-5 md:gap-7 relative px-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => scrollCarousel(-240)}
                    aria-label="Previous illustrations"
                    className="w-12 h-12 rounded-full bg-[#BDA5D0]/50 hover:bg-[#BDA5D0] active:bg-[#BDA5D0]/90 text-white flex items-center justify-center shadow-sm shrink-0 transition-colors cursor-pointer z-20"
                  >
                    <span className="material-symbols-outlined text-[22px]">arrow_back</span>
                  </motion.button>

                  <div
                    ref={carouselRef}
                    className="flex items-center gap-4 sm:gap-6 md:gap-7 overflow-x-auto scroll-smooth py-5 px-3 no-scrollbar"
                  >
                    {/* Tile 1 */}
                    <motion.div
                      whileHover={{ y: -6, scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="w-[160px] sm:w-[190px] md:w-[210px] h-[160px] sm:h-[190px] md:h-[210px] rounded-[36px] bg-[#F078AD] p-3.5 sm:p-4 shrink-0 flex items-center justify-center shadow-[0_10px_28px_rgba(240,120,173,0.22)]"
                    >
                      <div className="w-full h-full rounded-[26px] overflow-hidden flex items-center justify-center bg-white/25">
                        <img
                          alt="Daily Habit & Goal Tracking"
                          className="w-full h-full object-cover rounded-[22px] transition-transform duration-300 hover:scale-105"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgjg8LI1bmMZDHiQYFD97qH4RbxRF07S3y1hEX2Vs4NwkYipvIKSXHN6p7uVE9qUK6vJu_psLkFlzu0IPiU6V56sTqpnjRkt7KDOCev4A9HLBRoXKs_WV5YFOnTFl_8ZV6j-PlHzbFtOSAScE2wpQ02dSYtXQs4O4S8-4GRCX4AggbMm6qcDLREhyuaFCiVL53hP0EXBCJvHbFsS9zNK2e24mxhClIzxRjYkrG4t6i"
                        />
                      </div>
                    </motion.div>

                    {/* Tile 2 */}
                    <motion.div
                      whileHover={{ y: -6, scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="w-[160px] sm:w-[190px] md:w-[210px] h-[160px] sm:h-[190px] md:h-[210px] rounded-[36px] bg-[#BDA5D0] p-3.5 sm:p-4 shrink-0 flex items-center justify-center shadow-[0_10px_28px_rgba(189,165,208,0.25)]"
                    >
                      <div className="w-full h-full rounded-[26px] overflow-hidden flex items-center justify-center bg-white/25">
                        <img
                          alt="Weekly Workout Planner"
                          className="w-full h-full object-cover rounded-[22px] transition-transform duration-300 hover:scale-105"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiQH2kdhl9qctfUjdWYG_KPyNg80SkF4nawnR6N_TCcxiPcwtXdZZX7HjQSaksOdVVZ7NW1dpX2jinAzNt1TB9JDDVl8zTRKKv8GEtG98CJnPxWwgEsMK0Wl9AnYEdc2-O6K7w8wTLUqGSZwLZ-yaGcMnzG9miEM5FouFJCg6QpOe3uMhDAh8Sc73guTphPfNSzR5TcQgL7USGCXvnWPNwmT83d1tqPdpFuC7vBtNC"
                        />
                      </div>
                    </motion.div>

                    {/* Tile 3 */}
                    <motion.div
                      whileHover={{ y: -6, scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="w-[160px] sm:w-[190px] md:w-[210px] h-[160px] sm:h-[190px] md:h-[210px] rounded-[36px] bg-[#7DD9E7] p-3.5 sm:p-4 shrink-0 flex items-center justify-center shadow-[0_10px_28px_rgba(125,217,231,0.25)]"
                    >
                      <div className="w-full h-full rounded-[26px] overflow-hidden flex items-center justify-center bg-white/25">
                        <img
                          alt="Biometric Vitals & Hydration"
                          className="w-full h-full object-cover rounded-[22px] transition-transform duration-300 hover:scale-105"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-b-73omA53MczqBA_-xr71eVKiybUY3B5FXaqtnrK9i8K9AUBZYEy8EgQgCpcIhchn5cg4SxR0coIslbKx32kVY-HL3jD4rwrzax-eviJB75bSScCW9lbVy5WoQzJhweGax6NOGPAanyEIdt3SWFFRIrDHLayXMXUmpQ3kId3-GjnytnoaRRZueTaPEAtJDylwdUUFESDyqDimoFcJji0KP6X7PFXpqbZp-iATmt3"
                        />
                      </div>
                    </motion.div>

                    {/* Tile 4 */}
                    <motion.div
                      whileHover={{ y: -6, scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="w-[160px] sm:w-[190px] md:w-[210px] h-[160px] sm:h-[190px] md:h-[210px] rounded-[36px] bg-[#F7B653] p-3.5 sm:p-4 shrink-0 flex items-center justify-center shadow-[0_10px_28px_rgba(247,182,83,0.25)]"
                    >
                      <div className="w-full h-full rounded-[26px] overflow-hidden flex items-center justify-center bg-white/25">
                        <img
                          alt="Step Streaks & Activity Rings"
                          className="w-full h-full object-cover rounded-[22px] transition-transform duration-300 hover:scale-105"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoZScG9lAHG5P-vIrWJQLX8yqikSYLpJ5IXqS3pepz2TMDziYFkSLEFFkOnG754ADcZxm_8S-WuCOJSUuMlHD4M54nCwAAWbr9gitue5allATg--UcDZ-hfFkPQ8VBu3MhJ0uS2fmd59ET10hlU3LUqxoV2Cwext6G1jxIJajY0R5wnROmaa3qHJQ-1ES_hmh8OKJbTYwaHUGZ58KCPs8uABFik_0HA_GqCQCE0XeO"
                        />
                      </div>
                    </motion.div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => scrollCarousel(240)}
                    aria-label="Next illustrations"
                    className="w-12 h-12 rounded-full bg-[#BDA5D0]/50 hover:bg-[#BDA5D0] active:bg-[#BDA5D0]/90 text-white flex items-center justify-center shadow-sm shrink-0 transition-colors cursor-pointer z-20"
                  >
                    <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
                  </motion.button>
                </div>

                {/* ============================================== */}
                {/* OUR FEATURE (CLASS) SECTION                     */}
                {/* ============================================== */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6 }}
                  className="w-full bg-white rounded-[32px] p-6 sm:p-10 md:p-12 border border-[#E7E2E8] shadow-[0_8px_24px_rgba(49,37,55,0.05)] relative my-12"
                  id="section-our-feature"
                >
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                      <h2 className="font-['Manrope'] text-[28px] sm:text-[34px] font-bold text-[#1c1b1f] tracking-tight">
                        Our Features
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-[#57535A] text-[13px] sm:text-[14px] max-w-xs md:text-right leading-relaxed">
                        These are some of the training modules built inside the Fitflow app
                      </p>
                    </div>
                  </div>

                  {/* 3 Interactive Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => navigateTo('services')}
                      className="group rounded-[24px] border border-[#E7E2E8] bg-white p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-['Manrope'] text-[20px] font-bold text-[#1c1b1f]">
                            Daily Workout Planner
                          </h3>
                          <div className="w-9 h-9 rounded-full bg-[#f2ecf3] group-hover:bg-[#ffbd5a] group-hover:text-[#291800] text-[#57535A] flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-[16px]">north_east</span>
                          </div>
                        </div>
                        <p className="text-[#57535A] text-[14px] leading-relaxed mb-6">
                          Schedule weekly routines, track sets and reps, and get customized rest interval timers.
                        </p>
                      </div>
                      <div className="w-full h-44 rounded-2xl bg-[#f7f2f8] overflow-hidden flex items-center justify-center p-2">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpXkauqOnkce4ydkMgJ4rS3FJcIM3feFvXy2X4zDfvhcVZQEjoUcn0tHU9ESNaJTieQVkO7rBRsfHGFtTkS6-81hRSkQc_j_7wd3B6tDSClDb0ebifx1fmuuL-DnSqh_M8Qu504Hu3t0kLlQ_1EiZidQWeCWvI5ff6cORBkcxITexor2hni23eU0rBn6PZkBH7nfSI0XcH9DOD-HtTkFQYVJXcaO3YISYP851ULD3R"
                          alt="Daily Workout Planner"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                    </motion.div>

                    {/* Card 2: Featured Purple Card */}
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => navigateTo('services')}
                      className="group rounded-[24px] bg-[#6a527c] text-white p-6 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-['Manrope'] text-[20px] font-bold text-white">
                            Biometric Sync & Tracking
                          </h3>
                          <div className="w-9 h-9 rounded-full bg-[#ffbd5a] text-[#291800] flex items-center justify-center font-bold">
                            <span className="material-symbols-outlined text-[16px]">north_east</span>
                          </div>
                        </div>
                        <p className="text-[#f2daff] text-[14px] leading-relaxed mb-6">
                          Sync steps, active calories, and heart rate seamlessly across web and mobile.
                        </p>
                      </div>
                      <div className="w-full h-44 rounded-2xl bg-[#ffddb2]/20 overflow-hidden flex items-center justify-center p-2">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0jTd-hSlDD4SnXOkhA1efXEfSAWGxkHhdpNm-y0uEhguc1iQBWYXg_z7OfYNkkEOaGL6N8YnmE_uh2Gc3qrzuoBH3XQHoRLSLrV7AWO7S4ZS7qye8Gghzx-zrcrOobUsGI3VUyLAq-tBm7wXfPH0twuxKkVzvUeBE8Wn_QyecLorQZhEcB5T2m1onNii01IoLo3RO9Ous9pnXRT8-ev5-o8Q8avHNg4_vOUOr8W_B"
                          alt="Biometric Sync"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => navigateTo('services')}
                      className="group rounded-[24px] border border-[#E7E2E8] bg-white p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-['Manrope'] text-[20px] font-bold text-[#1c1b1f]">
                            Habit Streaks & Milestones
                          </h3>
                          <div className="w-9 h-9 rounded-full bg-[#f2ecf3] group-hover:bg-[#ffbd5a] group-hover:text-[#291800] text-[#57535A] flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-[16px]">north_east</span>
                          </div>
                        </div>
                        <p className="text-[#57535A] text-[14px] leading-relaxed mb-6">
                          Gain XP, level up your athlete profile, and build lifelong healthy exercise habits.
                        </p>
                      </div>
                      <div className="w-full h-44 rounded-2xl bg-[#f7f2f8] overflow-hidden flex items-center justify-center p-2">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAestJaDo2hR_ZmZWnEkGvSTm2dORgcb9bSRitjwE0hoXczGRBSXGvv13mxFxt7402Z4sYIHEHO3IhqUDy663zEcQmMIXxBXdo5UOSPlcWcXZCF1HVlD9p2_ewc8Hjpwy7M4SKSqyQ4YntAKscMhuK4gIZ5QIbXOOe6El9drDDwVPUqBDwz8pv6HKBJr96OhOVcML0cFsnWIemMpOZwq8aNI8tGQ_zxtT9Gh_lu4n0E"
                          alt="Habit Streaks"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                    </motion.div>
                  </div>
                </motion.section>

                {/* ============================================== */}
                {/* COMMUNITY SECTION                              */}
                {/* ============================================== */}
                <section className="w-full my-12" id="section-community">
                  <div className="w-full bg-white rounded-[32px] px-6 py-12 sm:px-12 sm:py-16 border border-[#E7E2E8] shadow-[0_8px_24px_rgba(49,37,55,0.05)] text-center relative overflow-hidden flex flex-col items-center">
                    <span className="text-[13px] text-[#6a527c] font-semibold tracking-wider uppercase mb-4">
                      - Fitflow app -
                    </span>

                    <h2 className="max-w-2xl font-['Manrope'] text-[28px] sm:text-[34px] font-bold text-[#1c1b1f] tracking-tight leading-snug mb-5">
                      Helps you learn and hone your skills through a trusted{' '}
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ffddb2] text-[#291800]">
                        Fitflow
                      </span>{' '}
                      community
                    </h2>

                    <p className="max-w-md text-[14px] text-[#57535A] leading-relaxed mb-10">
                      Come join us and not only increase your knowledge but also your family because we are a solid team
                    </p>

                    <div className="w-full pt-8 border-t border-[#E7E2E8] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#827B86]">
                      <span className="text-[14px] text-[#57535A]">Part of Fitflow app</span>

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

                      <span className="text-[14px] text-[#827B86]">
                        Archived by Fitflow app -- 2026
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
              <span className="text-[#827B86] text-[13px] ml-2">
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
