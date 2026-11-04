'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import ScrollExpand from '@/components/reactbits/ScrollExpand';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import GradualBlur from '@/components/reactbits/GradualBlur';
import { CaseStudyFlipStack } from '@/components/reactbits/CaseStudyFlipStack';
import { ScrollTiltedGrid } from '@/components/reactbits/ScrollTiltedGrid';
import { DownloadModal } from '@/components/landing/DownloadModal';
import ReactLenis from 'lenis/react';

const TILTED_GRID_SCREENS = [
  { src: '/screens/screen_home.png', alt: 'FitFlow Dashboard and Active Burn' },
  { src: '/screens/screen_progress.png', alt: 'FitFlow Telemetry and Workout Progress' },
  { src: '/screens/screen_rewards.png', alt: 'FitFlow Streaks and Milestone Vault' },
  { src: '/screens/screen_profile.png', alt: 'FitFlow Biometric Profile & Recovery' },
  { src: '/screens/screen_add.png', alt: 'FitFlow Quick Session Logger' },
  { src: '/screens/screen_login.png', alt: 'FitFlow Athlete Authentication' },
] as const;

export function RuangEditLandingPage() {
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
      tag: 'Strength & Progressive Overload',
      title: 'Automated Overload & Rest Timers',
      description:
        'Log sets and reps in two taps. FitFlow aggregates weekly volume per muscle group and automatically prompts rest countdowns with subtle haptic signals.',
      metrics: [
        { label: 'Logging Speed', value: '2-Tap Record' },
        { label: 'Volume Math', value: 'Auto-Aggregated' },
        { label: 'Rest Timer', value: 'Automated Haptics' },
      ],
      features: [
        'Rapid set, rep, weight and RPE logging designed for sweaty gym hands',
        'Automatic weekly volume calculation per muscle group',
        'Built-in rest countdown timer with subtle vibration cues',
        'Fatigue detection alerts before cumulative stress leads to burnout',
      ],
      phonePreview: {
        screenTitle: 'Workout Session',
        exercise: 'Barbell Back Squat',
        set: 'Set 3 of 4 • 140 kg × 5 reps',
        weight: 'RPE 8.5 • Heavy Compound',
        status: 'Rest Timer: 01:45',
        badge: 'Session Active',
      },
    },
    biometrics: {
      tag: 'Heart Rate & Telemetry',
      title: 'Direct Bluetooth Sensor Sync',
      description:
        'Connect directly to standard heart-rate chest straps and smart sensors via Web Bluetooth. View real-time Zone 4 thresholds and recovery pulse post-set.',
      metrics: [
        { label: 'Connection', value: 'Direct BLE Sync' },
        { label: 'Cardio Zones', value: '5-Tier Real-Time' },
        { label: 'Recovery', value: 'HRR Post-Set' },
      ],
      features: [
        'Direct connection to standard heart rate chest straps and wearables',
        'Real-time cardio zone mapping (Aerobic base to anaerobic threshold)',
        'Automatic post-set heart rate recovery (HRR) calculation',
        'Zero cloud lag: telemetry processed 100% locally on your phone',
      ],
      phonePreview: {
        screenTitle: 'Telemetry Stream',
        exercise: 'Metabolic Conditioning',
        set: 'Zone 4 Threshold Pacing',
        weight: '158 BPM (88% Max)',
        status: 'Active Sync • 480 kcal',
        badge: 'Telemetry Active',
      },
    },
    hydration: {
      tag: 'Hydration & Sweat Pacing',
      title: 'Dynamic Daily Hydration Benchmarks',
      description:
        'Keep muscular performance and joint recovery peak. FitFlow calculates realistic fluid benchmarks adjusted for your training volume.',
      metrics: [
        { label: 'Logging Speed', value: 'One-Tap 250ml' },
        { label: 'Daily Target', value: '3,000 ml Baseline' },
        { label: 'Pacing', value: 'Hourly Progress' },
      ],
      features: [
        'Dynamic hydration target scaling with active training exertion',
        'Quick-tap increments (250ml, 500ml, custom bottle size)',
        'Visual daily timeline highlighting hydration deficit windows',
        'Zero annoying popups: clean glanceable dashboard indicators',
      ],
      phonePreview: {
        screenTitle: 'Hydration Engine',
        exercise: 'Daily Water Intake',
        set: '2,400 / 3,000 ml',
        weight: '80% of Daily Target Met',
        status: 'Optimal Fluid Balance',
        badge: 'Hydration Active',
      },
    },
    habits: {
      tag: 'Discipline & Consistency',
      title: '21-Day Habit Streaks & Verified XP',
      description:
        'Build unshakeable physical discipline. Earn verified athlete XP that rolls back symmetrically if you uncheck a set—honest metrics for honest athletes.',
      metrics: [
        { label: 'Streak Target', value: '21 Days to Habit' },
        { label: 'Discipline Level', value: 'Level 4 Athlete' },
        { label: 'Storage', value: '100% Offline' },
      ],
      features: [
        'Visual 28-day habit matrix celebrating true unbroken discipline',
        'Symmetric XP engine: real points earned exclusively from exertion',
        'Milestone badges for volume, PR breakthroughs, and streaks',
        'Full offline storage that works deep underground without Wi-Fi',
      ],
      phonePreview: {
        screenTitle: 'Discipline Engine',
        exercise: '21-Day Habit Streak',
        set: 'Day 14 Active Streak',
        weight: 'Level 4 Athlete (340/500 XP)',
        status: 'Discipline Maintained',
        badge: 'Habit Locked',
      },
    },
  };

  const currentTrack = serviceTracks[activeServiceTab];

  return (
    <ReactLenis root options={{ autoRaf: true, lerp: 0.1, wheelMultiplier: 1.0, touchMultiplier: 1.0 }}>
      <div className="bg-white min-h-screen text-neutral-900 antialiased font-['Manrope',sans-serif] selection:bg-[#FF5500] selection:text-white overflow-x-clip">
      {/* ============================================================== */}
      {/* 1. EXPANDED / DYNAMIC NAVBAR (CLEAN, PROMINENT BRANDING)       */}
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
          {/* Brand Logo & Name (Clean, Bold, Large, and Prominent) */}
          <button
            type="button"
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer shrink-0"
          >
            <img
              src="/icon.png"
              alt="FitFlow Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-contain shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="flex items-baseline gap-1.5 select-none">
              <span className="font-extrabold text-white text-base sm:text-xl tracking-tight">
                FitFlow
              </span>
              <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-md bg-white/10 text-neutral-300 border border-white/10">
                app
              </span>
            </div>
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
      {/* 2. HERO SECTION (BOLD, ATHLETIC, DISTRACTION-FREE)             */}
      {/* ============================================================== */}
      <section
        id="home"
        className="relative w-full min-h-[100dvh] overflow-hidden bg-[#070913] flex flex-col justify-center"
      >
        {/* Athletic Atmosphere: Deep radial atmospheric glow & subtle grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
        >
          {/* Subtle Orange & Slate Athletic Glow */}
          <div
            className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-25"
            style={{
              background: 'radial-gradient(circle, #FF5500 0%, #3B82F6 40%, transparent 75%)',
            }}
          />

          {/* Base Architectural Grid Pattern */}
          <div
            className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        {/* Hero Foreground Content */}
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-32 pb-20 sm:pt-36 sm:pb-28 flex flex-col items-center justify-center text-center">
          
          {/* Real Athletic Social Proof Badge (No Pill Fluff) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-neutral-300 text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-sm"
          >
            <span className="text-[#FF5500] font-bold">★★★★★</span>
            <span className="font-semibold text-white">4.9 / 5</span>
            <span className="text-neutral-500">•</span>
            <span>2,000+ Active Lifters</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400">100% Offline & Private</span>
          </motion.div>

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

          {/* Line 2: Large Bold Text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-['Manrope',sans-serif] text-3xl sm:text-5xl md:text-6xl text-white font-extrabold tracking-tight select-none mt-1 sm:mt-2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
          >
            Daily Fitness with
          </motion.h1>

          {/* Line 3: Big Bold Rock-Solid "FitFlow" (Pure Athletic Craft, No AI Slop Dashed Boxes) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="my-1 sm:my-3 select-none flex items-center justify-center"
          >
            <span className="font-['Manrope',sans-serif] text-6xl xs:text-7xl sm:text-8xl md:text-9xl font-black tracking-tight text-white drop-shadow-[0_4px_40px_rgba(255,85,0,0.35)]">
              FitFlow<span className="text-[#FF5500]">.</span>
            </span>
          </motion.div>

          {/* Clean Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl mx-auto text-sm sm:text-base text-neutral-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] font-medium leading-relaxed mt-2 [text-wrap:pretty]"
          >
            The distraction-free workout logger. Track compound progression, heart-rate recovery, and 21-day discipline with 100% local-first storage.
          </motion.p>

          {/* Centered High-End CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsDownloadModalOpen(true)}
              className="inline-flex items-center justify-center gap-2.5 h-12 sm:h-14 px-8 sm:px-10 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm sm:text-base shadow-[0_0_36px_rgba(255,255,255,0.25)] transition-all cursor-pointer w-full sm:w-auto"
            >
              <svg aria-hidden="true" className="w-5 h-5 text-neutral-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download FitFlow</span>
            </motion.button>

            <motion.a
              href="/login"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-2 h-12 sm:h-14 px-7 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white font-semibold text-sm sm:text-base backdrop-blur-sm transition-all cursor-pointer w-full sm:w-auto"
            >
              <span>Open Web App ↗</span>
            </motion.a>
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
        heading="Built for Real Training"
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
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight leading-tight [text-wrap:balance]">
                Four Precision Engines for Real Progress
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 mt-4 leading-relaxed [text-wrap:pretty]">
                No gimmicks, no noisy notifications. FitFlow delivers tactile, local-first logging calibrated for serious athletic consistency.
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

              {/* Right Column: High-Craft Live Phone Telemetry Preview (Large & Clear) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[380px] sm:max-w-[420px] rounded-3xl bg-neutral-950 text-white p-6 sm:p-7 shadow-2xl border border-neutral-800 flex flex-col gap-5">
                  
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
                <span className="text-xs font-bold text-[#9A3412] tracking-wide uppercase">
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
                <span className="text-xs font-bold text-[#9A3412] tracking-wide uppercase">
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

          {/* 4 Core Principles (2x2 Athletic Bento Grid with Custom SVG Icons) */}
          <AnimatedContent distance={40} direction="vertical" duration={0.9} delay={0.15} ease="power2.out">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight mb-6 text-center sm:text-left">
                Foundational Principles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Principle 1: Barbell / Exertion */}
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FF5500] flex items-center justify-center shrink-0 mb-1">
                    <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6.5 6.5 11 11" />
                      <path d="m21 21-1-1" />
                      <path d="m3 3 1 1" />
                      <path d="m18 22 4-4" />
                      <path d="m2 6 4-4" />
                      <path d="m3 10 7-7" />
                      <path d="m14 21 7-7" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold text-neutral-950">Zero Toxic Gamification</h4>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    XP is earned only through verified physical exertion. If you uncheck a set, your XP rolls back symmetrically. We value truth over artificial scores.
                  </p>
                </div>

                {/* Principle 2: Shield / Local Sovereignty */}
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FF5500] flex items-center justify-center shrink-0 mb-1">
                    <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold text-neutral-950">Local-First Sovereignty</h4>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    Your workout logs, PRs, and biometric charts stay on your device. Instant offline loading with zero mandatory cloud sync or tracking pixels.
                  </p>
                </div>

                {/* Principle 3: Pulse / Fatigue Protection */}
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FF5500] flex items-center justify-center shrink-0 mb-1">
                    <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.22 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.46 12H2" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold text-neutral-950">Fatigue & Deload Protection</h4>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    Auto-regulated deload warnings notify you before cumulative fatigue turns into chronic injury. Long-term durability always beats short-term burn.
                  </p>
                </div>

                {/* Principle 4: Focus / Zero Distractions */}
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FF5500] flex items-center justify-center shrink-0 mb-1">
                    <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
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
          <div className="p-8 sm:p-10 rounded-3xl bg-neutral-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
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
      {/* 5.5. ATHLETE REVIEWS & SOCIAL PROOF (AUTHENTIC ATHLETES)       */}
      {/* ============================================================== */}
      <section className="w-full bg-[#070913] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto flex flex-col gap-12 sm:gap-16">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-neutral-300 text-xs font-semibold mb-3">
              <span className="text-[#FF5500]">★</span> Verified Athlete Feedback
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight [text-wrap:balance]">
              Tested Under the Bar by Real Lifters
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 mt-4 leading-relaxed">
              From powerlifting basements to Hyrox race tracks. Hear why athletes choose FitFlow over bloated corporate apps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Review 1: Marcus T. */}
            <div className="p-7 rounded-3xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between gap-6 hover:border-neutral-700 transition-colors">
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center gap-1 text-[#FF5500] text-sm">
                  ★★★★★
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal">
                  "FitFlow is the first workout logger that doesn't try to sell me a subscription between sets. It opens instantly in my basement gym with zero cell signal, and the rest timer has never failed me."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
                <div className="w-9 h-9 rounded-full bg-orange-500/20 text-[#FF5500] font-bold flex items-center justify-center text-xs">
                  MT
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-white">Marcus T.</span>
                  <span className="text-[11px] text-neutral-400">Competitive Powerlifter (600lb Deadlift)</span>
                </div>
              </div>
            </div>

            {/* Review 2: Priya S. */}
            <div className="p-7 rounded-3xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between gap-6 hover:border-neutral-700 transition-colors">
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center gap-1 text-[#FF5500] text-sm">
                  ★★★★★
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal">
                  "The heart rate telemetry and recovery tracking are spot-on. No cheesy AI chatbot or animated confetti, just raw data and clean visual trends that actually help me pace my intervals."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
                <div className="w-9 h-9 rounded-full bg-orange-500/20 text-[#FF5500] font-bold flex items-center justify-center text-xs">
                  PS
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-white">Priya S.</span>
                  <span className="text-[11px] text-neutral-400">Hyrox Competitor & Distance Runner</span>
                </div>
              </div>
            </div>

            {/* Review 3: David K. */}
            <div className="p-7 rounded-3xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between gap-6 hover:border-neutral-700 transition-colors">
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center gap-1 text-[#FF5500] text-sm">
                  ★★★★★
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal">
                  "I recommend FitFlow to all my athletes. The progressive overload volume math is crystal clear, and the 21-day consistency streak keeps lifters accountable without toxic guilt-trips."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
                <div className="w-9 h-9 rounded-full bg-orange-500/20 text-[#FF5500] font-bold flex items-center justify-center text-xs">
                  DK
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-white">David K.</span>
                  <span className="text-[11px] text-neutral-400">Head Strength & Conditioning Coach</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. CLEAN FOOTER                                                */}
      {/* ============================================================== */}
      <footer className="w-full border-t border-neutral-800 bg-[#070913] text-neutral-400 py-12 px-6 lg:px-12 relative overflow-hidden select-none">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/icon.png"
                alt="FitFlow Logo"
                className="w-6 h-6 rounded-full object-contain"
              />
              <span className="font-bold text-white text-sm tracking-tight">FitFlow</span>
            </div>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="text-xs text-neutral-400">Distraction-free workout & recovery logger for serious lifters</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-400 font-medium">
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
          color="rgba(7, 9, 19, 0.4)"
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
  </ReactLenis>
  );
}
