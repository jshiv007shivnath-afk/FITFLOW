'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ScrollExpand from '@/components/reactbits/ScrollExpand';
import GradientASCII from '@/components/reactbits/GradientASCII';
import TechText from '@/components/reactbits/TechText';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import CountUp from '@/components/reactbits/CountUp';
import GradualBlur from '@/components/reactbits/GradualBlur';
import { CaseStudyFlipStack } from '@/components/reactbits/CaseStudyFlipStack';
import { ScrollTiltedGrid } from '@/components/reactbits/ScrollTiltedGrid';
import { DownloadModal } from '@/components/landing/DownloadModal';

const TILTED_GRID_SCREENS = [
  { src: '/screens/screen_home.png', alt: 'FitFlow Dashboard and Active Burn' },
  { src: '/screens/screen_progress.png', alt: 'FitFlow Telemetry and Workout Progress' },
  { src: '/screens/screen_rewards.png', alt: 'FitFlow Streaks and Milestone Vault' },
  { src: '/screens/screen_profile.png', alt: 'FitFlow Biometric Profile & Recovery' },
  { src: '/screens/screen_add.png', alt: 'FitFlow Quick Session Logger' },
  { src: '/screens/screen_login.png', alt: 'FitFlow Athlete Authentication' },
] as const;

export function RuangEditLandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'home' | 'services' | 'about'>('home');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState<'strength' | 'biometrics' | 'hydration' | 'habits'>('strength');

  // Track scroll position for dynamic navbar width and active section indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 60);

      const servicesEl = document.getElementById('services');
      const aboutEl = document.getElementById('about');

      if (aboutEl && scrollY >= aboutEl.offsetTop - 300) {
        setActiveSection('about');
      } else if (servicesEl && scrollY >= servicesEl.offsetTop - 300) {
        setActiveSection('services');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: 'home' | 'services' | 'about') => {
    setActiveSection(id);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const serviceTracks = {
    strength: {
      tag: 'Track 01 • Heavy Compound Progression',
      title: 'Automated Overload & Fatigue Limits',
      description:
        'Log sets and reps with zero latency. FitFlow tracks weight progression, sets per muscle group, and prompts rest intervals without friction.',
      metrics: [
        { label: 'Tracking Speed', value: 'Instant One-Tap' },
        { label: 'Volume Math', value: 'Auto-Aggregated' },
        { label: 'Deload Alert', value: 'Fatigue Threshold' },
      ],
      features: [
        'Precise set, rep, weight and RPE tracking with millisecond reaction',
        'Automatic volume computation per muscle group with weekly targets',
        'Built-in rest countdown with subtle haptic signals when ready',
        'Intelligent deload suggestions when recovery volume spikes',
      ],
      phonePreview: {
        screenTitle: 'Workout Session',
        exercise: 'Barbell Back Squat',
        set: 'Set 3 of 4 • 140 kg × 5 reps',
        weight: 'RPE 8.5 • Optimal Overload',
        status: 'Rest Timer: 01:45',
        badge: 'Session Active',
      },
    },
    biometrics: {
      tag: 'Track 02 • Cardiac & Calorie Telemetry',
      title: 'Zero-Lag BLE Sensor Streaming',
      description:
        'Sync heart-rate zones directly from your Bluetooth strap or smartwatch. Live heart-rate variability and calorie burn without cloud dependencies.',
      metrics: [
        { label: 'Stream Delay', value: '< 14ms BLE' },
        { label: 'Target Zones', value: '5-Tier Cardio' },
        { label: 'Battery Impact', value: '0.4% per hour' },
      ],
      features: [
        'Direct connection to standard heart rate monitors via Web Bluetooth',
        'Continuous active calorie computation synced with workout intensity',
        'Automatic heart rate recovery rate (HRR) calculation post-set',
        'Zero cloud lag: telemetry processed locally on your phone',
      ],
      phonePreview: {
        screenTitle: 'Telemetry Stream',
        exercise: 'Metabolic Conditioning',
        set: 'Zone 4 Threshold',
        weight: '158 BPM (88% Max)',
        status: 'Active Sync • 480 kcal',
        badge: 'Telemetry Active',
      },
    },
    hydration: {
      tag: 'Track 03 • Metabolic Balance',
      title: 'Intelligent Hydration & Macro Pacing',
      description:
        'Keep cellular energy and muscle recovery optimal. FitFlow calculates precise fluid benchmarks adjusted for ambient temperature and training volume.',
      metrics: [
        { label: 'Logging Speed', value: 'One-Tap 250ml' },
        { label: 'Daily Target', value: '3,000 ml Baseline' },
        { label: 'Notification', value: 'Circadian Pacing' },
      ],
      features: [
        'Dynamic hydration target adjusting for active sweat loss during workouts',
        'Quick-tap volume increments (250ml, 500ml, custom glass)',
        'Daily intake timeline highlighting hydration deficit windows',
        'Subtle circadian reminders timed between training blocks',
      ],
      phonePreview: {
        screenTitle: 'Hydration Engine',
        exercise: 'Daily Water Intake',
        set: '2,400 / 3,000 ml',
        weight: '80% of Daily Target',
        status: 'Optimal Fluid Balance',
        badge: 'Hydration Sync',
      },
    },
    habits: {
      tag: 'Track 04 • Habit Architecture',
      title: '21-Day Streak Consistency & XP Leveling',
      description:
        'Transform physical discipline from an occasional chore into an unshakeable daily reflex using positive reinforcement and tiered XP unlocks.',
      metrics: [
        { label: 'Streak Target', value: '21 Days to Habit' },
        { label: 'Level Cap', value: 'Level 10 Master' },
        { label: 'Offline Sync', value: '100% Local PWA' },
      ],
      features: [
        'Visual 28-day habit matrix celebrating uninterrupted discipline',
        'Symmetric XP engine: 500 XP per level with rollover safeguards',
        'Milestone badges for volume, attendance, and streak breakthroughs',
        'Full offline persistence that works deep underground without Wi-Fi',
      ],
      phonePreview: {
        screenTitle: 'Discipline Engine',
        exercise: '21-Day Habit Streak',
        set: 'Day 14 Active Streak',
        weight: 'Level 4 Athlete (340/500 XP)',
        status: 'Discipline Maintained',
        badge: 'Consistency Fire',
      },
    },
  };

  const currentTrack = serviceTracks[activeServiceTab];

  return (
    <div className="bg-white min-h-screen text-neutral-900 antialiased font-['Manrope',sans-serif] selection:bg-[#FF5500] selection:text-white overflow-x-clip">
      {/* ============================================================== */}
      {/* 0. INTRO PRELOADER WITH COUNTUP COMPONENT (PURE BLACK, MINIMAL)*/}
      {/* ============================================================== */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center select-none"
          >
            <div className="text-white font-extrabold text-7xl sm:text-9xl font-mono tracking-tight flex items-baseline">
              <CountUp
                from={0}
                to={100}
                duration={1.8}
                mode="count"
                easing="easeOut"
                suffix="%"
                trigger="load"
                onEnd={() => {
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 250);
                }}
                className="text-white font-extrabold tracking-tight"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 1. EXPANDED / DYNAMIC NAVBAR (BLACK & WHITE, EXPANDS & SHRINKS) */}
      {/* ============================================================== */}
      <header className="fixed top-3 sm:top-5 inset-x-0 z-50 px-3 sm:px-6 transition-all duration-300 pointer-events-none">
        <motion.div
          animate={{
            maxWidth: isScrolled ? '860px' : '1180px',
            scale: isScrolled ? 0.98 : 1,
            y: isScrolled ? -2 : 0,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="w-full mx-auto rounded-full bg-neutral-950 backdrop-blur-2xl border border-white/20 px-3.5 sm:px-7 py-2.5 sm:py-3 shadow-[0_12px_40px_rgba(0,0,0,0.65)] flex items-center justify-between gap-2 sm:gap-4 pointer-events-auto"
        >
          {/* Brand Logo & Name */}
          <button
            type="button"
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer shrink-0"
          >
            <img
              src="/icon.png"
              alt="FitFlow Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-contain shadow-xs group-hover:scale-105 transition-transform"
            />
            <span className="font-bold text-white text-sm sm:text-base tracking-tight">
              Fitflow app
            </span>
          </button>

          {/* Nav Links with Animated Active Indicator */}
          <nav className="inline-flex items-center bg-white/[0.08] border border-white/15 p-1 rounded-full backdrop-blur-sm gap-1">
            {(['home', 'services', 'about'] as const).map((sectionId) => {
              const label = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={sectionId}
                  type="button"
                  onClick={() => scrollToSection(sectionId)}
                  className={`relative px-3 sm:px-5 py-1.5 text-xs sm:text-sm font-semibold transition-colors duration-200 rounded-full cursor-pointer ${
                    isActive ? 'text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-white rounded-full shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Download App CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDownloadModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 h-10 px-4 sm:px-6 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 text-xs sm:text-sm font-bold transition-all group cursor-pointer shadow-sm"
            >
              <svg aria-hidden="true" className="w-3.5 h-3.5 text-neutral-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="hidden xs:inline">Download App</span>
              <span className="xs:hidden">Get App</span>
            </motion.button>
          </div>
        </motion.div>
      </header>

      {/* ============================================================== */}
      {/* 2. HERO SECTION WITH FULL SCREEN ASCII CANVAS                  */}
      {/* (Starts ONLY AFTER loading count animation completes)          */}
      {/* ============================================================== */}
      <section
        id="home"
        className="relative w-full min-h-[100dvh] overflow-hidden bg-[#070913] flex flex-col justify-center"
      >
        {/* LOCKED (READ-ONLY) GUARDRAIL 1: GradientASCII Background Canvas */}
        <div
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
        >
          {!isLoading && (
            <div className="absolute inset-0 w-full h-full pointer-events-auto">
              <GradientASCII
                colors={['#1e3fd8', '#f6f8ff', '#a5d8ff', '#38bdf8']}
                shape="horizon"
                characters=" =+xX0S8#@"
                cellSize={18}
                density={0.8}
              />
            </div>
          )}

          {/* Base Architectural Grid Pattern */}
          <div
            className="absolute inset-0 w-full h-full opacity-20 pointer-events-none z-1"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        {/* Contrast Scrim to Keep Text Sharp */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(6, 9, 16, 0.5) 0%, rgba(6, 9, 16, 0.25) 50%, transparent 85%)',
          }}
        />

        {/* Hero Foreground Content */}
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-32 pb-20 sm:pt-36 sm:pb-28 flex flex-col items-center justify-center text-center">
          
          {/* THREE-LINE HERO HEADLINE STRUCTURE */}
          {/* Line 1: Medium Font */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-['Manrope',sans-serif] text-lg sm:text-2xl md:text-3xl text-neutral-300 font-bold tracking-tight select-none"
          >
            Level Up Your
          </motion.div>

          {/* Line 2: Daily Fitness with */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-['Manrope',sans-serif] text-3xl sm:text-5xl md:text-6xl text-white font-extrabold tracking-tight select-none mt-1 sm:mt-2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
          >
            Daily Fitness with
          </motion.h1>

          {/* Line 3: Big Single Word "FitFlow" with TechText Animated Vector Outlines */}
          <div className="w-full max-w-2xl h-[95px] xs:h-[120px] sm:h-[150px] md:h-[175px] relative mx-auto my-1 sm:my-2 flex items-center justify-center">
            <TechText
              text="FitFlow"
              fontFamily="'Manrope', sans-serif"
              fontWeight={800}
              fontSize={135}
              color="#ffffff"
              accentColor="#FF5500"
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={15}
              intro="none"
              sweep={true}
              speed={1}
              clickKick={true}
              guides={false}
            />
          </div>

          {/* Clean Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl mx-auto text-sm sm:text-base text-neutral-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] font-medium leading-relaxed mt-3 [text-wrap:pretty]"
          >
            Built for everyday athletes. Sync your reps, heart-rate zones, and daily recovery in one fluid workspace.
          </motion.p>

          {/* Centered High-End "Download FitFlow" CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex items-center justify-center"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsDownloadModalOpen(true)}
              className="inline-flex items-center justify-center gap-3 h-12 sm:h-14 px-8 sm:px-11 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm sm:text-base shadow-[0_0_36px_rgba(255,255,255,0.3)] transition-all cursor-pointer"
            >
              <svg aria-hidden="true" className="w-5 h-5 text-neutral-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download FitFlow</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. LOCKED GUARDRAIL 2: SCROLL-EXPAND VIDEO SECTION             */}
      {/* ============================================================== */}
      <section className="w-full relative bg-white" id="section-scroll-expand">
        <ScrollExpand
          className="!bg-white"
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
            <span className="px-3.5 py-1 rounded-full bg-[#FF5500] text-white text-xs font-bold tracking-normal mb-3 shadow-md">
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
              onClick={() => setIsDownloadModalOpen(true)}
              className="inline-flex items-center justify-center h-11 px-7 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              Download FitFlow ↗
            </button>
          </div>
        </ScrollExpand>
      </section>

      {/* ============================================================== */}
      {/* 3.5. CASE STUDY FLIP STACK (DIRECTLY BELOW SCROLL-EXPAND)      */}
      {/* ============================================================== */}
      <CaseStudyFlipStack
        heading="Tactile Engineering That Delivers"
        endLabel="Train With Precision"
      />

      {/* ============================================================== */}
      {/* 3.6. SCROLL TILTED GRID (DIRECTLY BELOW CASE STUDY FLIP STACK) */}
      {/* ============================================================== */}
      <ScrollTiltedGrid images={TILTED_GRID_SCREENS} />

      {/* ============================================================== */}
      {/* 4. BALANCED SERVICES SECTION (HOME PAGE • WHITE + ORANGE THEME)*/}
      {/* ============================================================== */}
      <section id="services" className="w-full bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto flex flex-col gap-10 sm:gap-14">
          
          {/* Section Header with AnimatedContent */}
          <AnimatedContent distance={30} direction="vertical" duration={0.8} ease="power2.out">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
              <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#9A3412] text-xs font-bold tracking-wide mb-3">
                Core Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight leading-tight [text-wrap:balance]">
                Four Precision Engines for Real Progress
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 mt-4 leading-relaxed [text-wrap:pretty]">
                No generic AI fluff, no noisy notifications. FitFlow delivers tactile, local-first logging calibrated for serious athletic consistency.
              </p>
            </div>
          </AnimatedContent>

          {/* Interactive 4-Track System */}
          <AnimatedContent distance={40} direction="vertical" duration={0.9} delay={0.1} ease="power2.out">
            {/* Track Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-1.5 bg-neutral-100 rounded-2xl max-w-3xl mx-auto mb-8 sm:mb-12">
              {(
                [
                  { id: 'strength', label: 'Strength Logging' },
                  { id: 'biometrics', label: 'Biometrics Sync' },
                  { id: 'hydration', label: 'Hydration Target' },
                  { id: 'habits', label: 'Habit Streaks' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveServiceTab(tab.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeServiceTab === tab.id
                      ? 'bg-white text-neutral-950 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Track Content Card (Side-by-Side Detail & Live Preview) */}
            <div className="bg-neutral-50 border border-neutral-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Track Info & Features */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div>
                  <span className="text-xs font-bold text-[#9A3412] tracking-wide">
                    {currentTrack.tag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight mt-1 mb-3">
                    {currentTrack.title}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                    {currentTrack.description}
                  </p>
                </div>

                {/* 3 Quick Telemetry Metrics */}
                <div className="grid grid-cols-3 gap-3 py-4 border-y border-neutral-200">
                  {currentTrack.metrics.map((m, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-xs text-neutral-500 font-semibold">{m.label}</span>
                      <span className="text-xs sm:text-sm font-bold text-neutral-950 mt-0.5">{m.value}</span>
                    </div>
                  ))}
                </div>

                {/* Feature Bullet Checklist */}
                <ul className="flex flex-col gap-2.5">
                  {currentTrack.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <span aria-hidden="true" className="w-4 h-4 rounded-full bg-orange-100 text-[#9A3412] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: High-Craft Live Phone Telemetry Preview */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[320px] rounded-3xl bg-neutral-950 text-white p-5 shadow-2xl border border-neutral-800 flex flex-col gap-4">
                  
                  {/* Phone Header Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
                      <span className="text-xs font-mono font-bold tracking-tight text-white">
                        {currentTrack.phonePreview.screenTitle}
                      </span>
                    </div>
                    <span className="text-xs font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-[#FF7A00] border border-orange-500/30">
                      {currentTrack.phonePreview.badge}
                    </span>
                  </div>

                  {/* Active Exercise Metric Card */}
                  <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4 flex flex-col gap-2">
                    <span className="text-xs text-neutral-400 font-medium">Active Telemetry</span>
                    <span className="text-lg font-extrabold text-white tracking-tight">
                      {currentTrack.phonePreview.exercise}
                    </span>
                    <div className="flex items-center justify-between text-xs text-neutral-300 font-mono mt-1">
                      <span>{currentTrack.phonePreview.set}</span>
                      <span className="font-bold text-[#FF5500]">{currentTrack.phonePreview.weight}</span>
                    </div>
                  </div>

                  {/* Progress Bar & Status */}
                  <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800/80 p-3.5 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-neutral-300">
                      <span>Status</span>
                      <span className="text-emerald-400 font-semibold">{currentTrack.phonePreview.status}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#FF5500] to-orange-400 rounded-full w-4/5 animate-pulse" />
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <button
                    type="button"
                    onClick={() => setIsDownloadModalOpen(true)}
                    className="w-full h-10 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs text-center transition-all cursor-pointer shadow-sm flex items-center justify-center"
                  >
                    Launch on Phone ↗
                  </button>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. BALANCED ABOUT SECTION (HOME PAGE • WHITE + ORANGE THEME)   */}
      {/* ============================================================== */}
      <section id="about" className="w-full bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto flex flex-col gap-10 sm:gap-14">
          
          {/* Section Header with AnimatedContent */}
          <AnimatedContent distance={30} direction="vertical" duration={0.8} ease="power2.out">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
              <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#9A3412] text-xs font-bold tracking-wide mb-3">
                The FitFlow Manifesto
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight leading-tight [text-wrap:balance]">
                Built for Athletes Who <span className="text-[#FF5500]">Respect the Process</span>
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 mt-4 leading-relaxed [text-wrap:pretty]">
                FitFlow was born out of frustration with noisy notification loops, toxic gym culture, and unrealistic 7-day shred routines that lead to burnout and injury.
              </p>
            </div>
          </AnimatedContent>

          {/* 2-Column Editorial Conviction */}
          <AnimatedContent distance={35} direction="vertical" duration={0.85} delay={0.1} ease="power2.out">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 py-8 border-y border-neutral-200">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#9A3412] tracking-wide">
                  The Problem
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight mt-1 mb-3">
                  Modern fitness apps are engineered for engagement, not progress.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Most digital workout apps bombard you with fake AI chatbots, aggressive renewal popups, and algorithmic guilt trips when you miss a session. They want you addicted to their app, not thriving in your body.
                </p>
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#9A3412] tracking-wide">
                  Our Antidote
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight mt-1 mb-3">
                  A calm, distraction-free sanctuary for physical discipline.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  FitFlow is built like precision sporting equipment. Clean typography, local-first storage that works deep underground with zero Wi-Fi, and honest metrics that celebrate true consistency: progressive overload, hydration, and 21-day streaks.
                </p>
              </div>
            </div>
          </AnimatedContent>

          {/* 4 Core Principles (2x2 Grid) */}
          <AnimatedContent distance={40} direction="vertical" duration={0.9} delay={0.15} ease="power2.out">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight mb-6 text-center sm:text-left">
                Foundational Principles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#9A3412] font-mono font-bold flex items-center justify-center text-sm mb-1">
                    01
                  </div>
                  <h4 className="text-base font-bold text-neutral-950">Zero Toxic Gamification</h4>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    XP is earned only through verified physical exertion. If you uncheck a set, your XP rolls back symmetrically. We value truth over artificial scores.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#9A3412] font-mono font-bold flex items-center justify-center text-sm mb-1">
                    02
                  </div>
                  <h4 className="text-base font-bold text-neutral-950">Local-First Sovereignty</h4>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    Your workout logs, PRs, and biometric charts stay on your device. Instant offline loading with zero mandatory cloud sync or tracking pixels.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#9A3412] font-mono font-bold flex items-center justify-center text-sm mb-1">
                    03
                  </div>
                  <h4 className="text-base font-bold text-neutral-950">Fatigue & Deload Protection</h4>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    Auto-regulated deload warnings notify you before cumulative fatigue turns into chronic injury. Long-term durability always beats short-term burn.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#9A3412] font-mono font-bold flex items-center justify-center text-sm mb-1">
                    04
                  </div>
                  <h4 className="text-base font-bold text-neutral-950">Calm, Focused Utility</h4>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    Zero interstitial ads, zero sponsored fitness influencers. Open the app, record your sets with haptic feedback, and get back to your workout.
                  </p>
                </div>

              </div>
            </div>
          </AnimatedContent>

          {/* Quick CTA Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-neutral-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Ready to train with real discipline?</h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">Install FitFlow directly onto your phone or open in your browser.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsDownloadModalOpen(true)}
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm transition-all shrink-0 cursor-pointer shadow-md"
            >
              Get Started Free ↗
            </button>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. CLEAN WHITE FOOTER                                          */}
      {/* ============================================================== */}
      <footer className="w-full border-t border-neutral-200 bg-white py-12 px-6 lg:px-12 relative overflow-hidden select-none">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/icon.png"
                alt="FitFlow Logo"
                className="w-6 h-6 rounded-full object-contain"
              />
              <span className="font-bold text-neutral-950 text-sm tracking-tight">FitFlow</span>
            </div>
            <span className="hidden sm:inline text-neutral-300">•</span>
            <span className="text-xs text-neutral-500">Autonomous athlete companion & telemetry client</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-500 font-medium">
            <span>Local-First</span>
            <span>Zero Trackers</span>
            <span>Offline Sovereignty</span>
            <span>© {new Date().getFullYear()} FitFlow</span>
          </div>
        </div>

        {/* Gradual Blur on footer */}
        <GradualBlur
          position="bottom"
          height="3rem"
          blurAmount="4px"
          color="rgba(255, 255, 255, 0.4)"
          className="z-0"
        />
      </footer>

      {/* ============================================================== */}
      {/* 7. APP DOWNLOAD MODAL DIALOG                                   */}
      {/* ============================================================== */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
}
