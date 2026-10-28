'use client';

import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  Flame,
  Activity,
  Droplets,
  Dumbbell,
  Award,
  Lock,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Maximize2,
  ChevronDown,
  Layers,
  Database,
  WifiOff,
} from 'lucide-react';
import { BrandMark } from '@/components/ui/BrandMark';

interface FitFlowLandingPageProps {
  children: React.ReactNode;
  onLaunchApp: () => void;
}

export function FitFlowLandingPage({ children, onLaunchApp }: FitFlowLandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'planner' | 'rings' | 'privacy' | 'analytics'>('planner');

  const faqs = [
    {
      q: 'Can I use FitFlow completely offline without internet?',
      a: 'Yes, 100%. FitFlow uses a resilient offline-first architecture with instantaneous local state persistence. Your workout logging, step counters, hydration logs, and XP progression update in sub-50ms with zero network lag, syncing cleanly to the cloud when you reconnect.',
    },
    {
      q: 'How does the 7-Day Workout Planner prevent messy streaks?',
      a: 'FitFlow implements symmetric rollback logic. Checking off a day automatically awards +120 XP, advances your active streak, and tallies burned calories. If you accidentally tap a day or want to reschedule, unchecking it symmetrically rolls back XP and calories without corrupting your historical records.',
    },
    {
      q: 'How is my private health and account data protected?',
      a: 'FitFlow enforces strict cryptographic safeguards: 2-minute time-limited OTP login via Resend, timing-attack safe verification (crypto.timingSafeEqual), hardened HTTP security headers (HSTS, Anti-Clickjacking), and zero client-side secret leakage.',
    },
    {
      q: 'Can I install FitFlow on my iPhone or Android device?',
      a: 'Absolutely. FitFlow is configured as a Progressive Web App (PWA) with native Capacitor integration (@capacitor/core & @capacitor/android), allowing you to install it directly to your home screen with full offline support and native device feel.',
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07080B] text-[#F0F2ED] font-sans selection:bg-[#B8F45A] selection:text-[#111111] overflow-x-hidden relative">
      {/* Background Ambient Glow Orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[#B8F45A]/[0.035] rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-[45%] right-[-200px] w-[600px] h-[600px] bg-[#FA114F]/[0.025] rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-[-150px] w-[700px] h-[500px] bg-[#00E5FF]/[0.025] rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* 1. FLOATING NAVIGATION BAR */}
      <header className="sticky top-4 z-40 px-4 sm:px-6 max-w-6xl mx-auto">
        <nav className="backdrop-blur-xl bg-[#111312]/80 border border-white/10 rounded-full px-4 sm:px-6 py-3 flex items-center justify-between shadow-[0_12px_32px_rgba(0,0,0,0.45)]">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <BrandMark size="sm" />
            <span className="font-extrabold text-lg text-white tracking-tight">FitFlow</span>
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-white/10 text-[#B8F45A] px-2 py-0.5 rounded-full border border-white/10">
              v1.1
            </span>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-white/70">
            <button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors">
              Overview
            </button>
            <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">
              Pillars
            </button>
            <button onClick={() => scrollToSection('anatomy')} className="hover:text-white transition-colors">
              Anatomy
            </button>
            <button onClick={() => scrollToSection('security')} className="hover:text-white transition-colors">
              Security
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors">
              FAQ
            </button>
          </div>

          {/* Right Action CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={onLaunchApp}
              type="button"
              className="flex items-center gap-2 bg-[#B8F45A] text-[#111312] font-black text-xs uppercase tracking-wider px-4 sm:px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(184,244,90,0.3)] hover:bg-[#a6e646] hover:shadow-[0_0_28px_rgba(184,244,90,0.45)] active:scale-95 transition-all cursor-pointer"
            >
              <span>Launch App</span>
              <ArrowRight size={13} className="stroke-[3]" />
            </button>
          </div>
        </nav>
      </header>

      {/* 2. HERO SECTION WITH EMBEDDED LIVE APP */}
      <section id="hero" className="pt-12 sm:pt-16 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Architectural Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-white/90 text-[11px] font-bold tracking-[0.16em] uppercase mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#B8F45A] animate-ping" />
              <span>Athletic Wellness Architecture</span>
              <span className="text-white/30">•</span>
              <span className="text-[#B8F45A]">Live Interactive Preview</span>
            </div>

            {/* Giant High-Impact Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.04] mb-6">
              Intelligent Movement. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8F45A] via-[#A8F045] to-[#78CD1B]">
                Unstoppable Flow.
              </span>
            </h1>

            {/* Editorial Subhead */}
            <p className="text-base sm:text-lg text-white/70 max-w-xl font-normal leading-relaxed mb-8">
              The high-precision wellness companion that turns daily workouts, step streaks, and hydration into an
              effortless daily ritual. Experience soft pastel bento clarity with zero bloat and military-grade privacy.
            </p>

            {/* CTA Cluster */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <button
                onClick={onLaunchApp}
                type="button"
                className="flex items-center justify-center gap-2.5 bg-[#B8F45A] text-[#111312] px-7 py-4 rounded-full font-black text-sm uppercase tracking-wider shadow-[0_12px_32px_rgba(184,244,90,0.35)] hover:bg-[#a6e646] hover:shadow-[0_16px_40px_rgba(184,244,90,0.5)] active:scale-95 transition-all cursor-pointer w-full sm:w-auto"
              >
                <span>Launch Full App</span>
                <Maximize2 size={16} className="stroke-[2.5]" />
              </button>

              <button
                onClick={() => scrollToSection('features')}
                type="button"
                className="flex items-center justify-center gap-2 bg-[#181A18] text-white/90 hover:text-white px-6 py-4 rounded-full font-bold text-sm border border-white/10 hover:border-white/20 active:scale-95 transition-all cursor-pointer w-full sm:w-auto"
              >
                <span>Explore Features</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Concrete Proof Metrics (Zero AI Marketing Slop) */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-white/10 w-full max-w-lg text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">100%</div>
                <div className="text-xs font-medium text-white/50 mt-0.5">Offline-First Engine</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#B8F45A] tracking-tight">&lt;50ms</div>
                <div className="text-xs font-medium text-white/50 mt-0.5">Haptic State Updates</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">35/35</div>
                <div className="text-xs font-medium text-white/50 mt-0.5">Regression Tests Pass</div>
              </div>
            </div>
          </div>

          {/* Right Column: The Live Embedded Interactive App */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            {/* Ambient Backlight Behind Device */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#B8F45A]/15 via-transparent to-[#FA114F]/10 blur-3xl rounded-full pointer-events-none transform scale-90" />
            
            {/* The Live Interactive FitFlow Phone Frame */}
            <div className="relative z-10 w-full flex justify-center">
              {children}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE ARCHITECTURAL PILLARS (ASYMMETRICAL BENTO GRID) */}
      <section id="features" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
            [ ARCHITECTURAL CAPABILITIES ]
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Engineered for daily execution.
          </h2>
          <p className="text-white/60 text-sm sm:text-base mt-4 font-normal">
            No bloated social feeds, no ads, no noisy paywalls. Just clean software designed to elevate your athletic discipline.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: 8-Column Wide (7-Day Workout Planner) */}
          <div className="md:col-span-8 bg-[#111312] border border-white/10 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#B8F45A]/40 transition-colors shadow-lg">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#B8F45A]/[0.04] rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#1D201E] border border-white/10 flex items-center justify-center text-[#B8F45A] mb-6">
                <Dumbbell size={22} className="stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#B8F45A]">
                Intelligent Scheduling
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 mb-3">
                7-Day Precision Workout Planner
              </h3>
              <p className="text-white/70 text-sm leading-relaxed max-w-xl">
                Deploy 1-tap proven splits (Push/Pull/Legs, Upper/Lower, Full Body) or build custom routines with structured sets, reps, and rest intervals. Built with symmetric rollback logic so streak data remains mathematically clean.
              </p>
            </div>

            {/* Visual Micro-Preview */}
            <div className="mt-8 grid grid-cols-7 gap-2 bg-[#181A18] p-3 rounded-2xl border border-white/10">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div
                  key={day}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl text-center text-xs font-semibold ${
                    idx < 4 ? 'bg-[#B8F45A]/15 text-[#B8F45A] border border-[#B8F45A]/30' : 'bg-white/5 text-white/50'
                  }`}
                >
                  <span className="text-[10px] text-white/40 uppercase">{day}</span>
                  <span className="font-bold mt-0.5">{idx < 4 ? '✓' : '—'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: 4-Column (Three-Ring Calorie & Hydration Engine) */}
          <div className="md:col-span-4 bg-[#111312] border border-white/10 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#FA114F]/40 transition-colors shadow-lg">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FA114F]/[0.04] rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#1D201E] border border-white/10 flex items-center justify-center text-[#FA114F] mb-6">
                <Activity size={22} className="stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#FA114F]">
                Vitals Engine
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1 mb-3">
                Three-Ring Activity Metrics
              </h3>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                Harmonizes 10,000 steps, dynamic active minutes, and 2,500ml water tracking with 250ml fast-add haptics.
              </p>
            </div>

            {/* Rings Preview */}
            <div className="mt-6 flex items-center justify-between bg-[#181A18] p-4 rounded-2xl border border-white/10">
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white">Daily Target</span>
                <span className="text-[11px] text-[#B8F45A] font-semibold">8,420 / 10,000 Steps</span>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-[#FA114F] border-t-transparent animate-spin-slow flex items-center justify-center text-[10px] font-bold text-white">
                84%
              </div>
            </div>
          </div>

          {/* Card 3: 4-Column (Gamification & XP Tiering) */}
          <div className="md:col-span-4 bg-[#111312] border border-white/10 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#00E5FF]/40 transition-colors shadow-lg">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#1D201E] border border-white/10 flex items-center justify-center text-[#00E5FF] mb-6">
                <Award size={22} className="stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#00E5FF]">
                Progression System
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1 mb-3">
                XP &amp; Level Progression
              </h3>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                Earn +120 XP for each completed workout session. Level up through precision tiers with mathematical boundary validation.
              </p>
            </div>

            <div className="mt-6 bg-[#181A18] p-4 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center font-black text-xs">
                  L2
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white">Athlete Tier</span>
                  <span className="text-[10px] text-white/50">360 / 500 XP to Level 3</span>
                </div>
              </div>
              <Flame size={18} className="text-[#FA114F] fill-current" />
            </div>
          </div>

          {/* Card 4: 8-Column Wide (Security & Database Resilience) */}
          <div className="md:col-span-8 bg-[#111312] border border-white/10 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-400/40 transition-colors shadow-lg">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#1D201E] border border-white/10 flex items-center justify-center text-emerald-400 mb-6">
                <ShieldCheck size={22} className="stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-emerald-400">
                Security by Architecture
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 mb-3">
                2-Min OTP &amp; Studio Deletion Defense
              </h3>
              <p className="text-white/70 text-sm leading-relaxed max-w-xl">
                Passwordless authentication with single-use 2-minute OTP codes delivered via Resend. Protected with timing-attack resistant verification, real-time database ban triggers, and batch SQL parameterization.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#181A18] p-3 rounded-xl border border-white/10 text-xs">
                <div className="text-white/50 text-[10px] uppercase font-bold">Timing Attack Defense</div>
                <div className="text-white font-semibold mt-0.5">crypto.timingSafeEqual</div>
              </div>
              <div className="bg-[#181A18] p-3 rounded-xl border border-white/10 text-xs">
                <div className="text-white/50 text-[10px] uppercase font-bold">Brute-Force Guard</div>
                <div className="text-white font-semibold mt-0.5">4 Attempts / 24h Lockout</div>
              </div>
              <div className="bg-[#181A18] p-3 rounded-xl border border-white/10 text-xs">
                <div className="text-white/50 text-[10px] uppercase font-bold">SQL Defense</div>
                <div className="text-white font-semibold mt-0.5">100% Parameterized</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE ANATOMY OF FLOW (TABBED SHOWCASE) */}
      <section id="anatomy" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
            [ THE ANATOMY OF FLOW ]
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Every screen engineered for momentum.
          </h2>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {[
            { id: 'planner', label: '7-Day Planner', icon: Dumbbell },
            { id: 'rings', label: 'Vitals & Rings', icon: Activity },
            { id: 'analytics', label: 'Analytics & kcal', icon: Layers },
            { id: 'privacy', label: 'Offline Sync Engine', icon: WifiOff },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                type="button"
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#B8F45A] text-[#111312] shadow-[0_0_20px_rgba(184,244,90,0.3)]'
                    : 'bg-[#181A18] text-white/70 hover:text-white border border-white/10'
                }`}
              >
                <Icon size={14} className="stroke-[2.2]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Cards */}
        <div className="bg-[#111312] border border-white/10 rounded-[32px] p-6 sm:p-12 text-left shadow-2xl relative overflow-hidden">
          {activeTab === 'planner' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#B8F45A]">Training Architecture</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-4">
                  Full 7-Day Routine Mastery
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Set target durations, exercise reps, and weight progression. Check days off right from the dashboard or deep-dive into the weekly planner with custom exercise addition and instant rollback.
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-white/80">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#B8F45A]" />
                    <span>Instant Push/Pull/Legs and Upper/Lower splits</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#B8F45A]" />
                    <span>Estimated burn calculation per exercise duration</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#B8F45A]" />
                    <span>Zero duplicate exercise array indexing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#181A18] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <span className="text-xs font-bold text-white">Thursday • Upper Body Focus</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#B8F45A]/20 text-[#B8F45A]">
                    Completed
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Incline Dumbbell Press</div>
                      <div className="text-[10px] text-white/50">4 sets • 10-12 reps</div>
                    </div>
                    <span className="text-[10px] text-white/40">60s rest</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Weighted Pull-Ups</div>
                      <div className="text-[10px] text-white/50">4 sets • 8 reps</div>
                    </div>
                    <span className="text-[10px] text-white/40">90s rest</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FA114F]">Biometric Rhythm</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-4">
                  Vector Rings &amp; Quick Hydration
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Track active movement, dynamic calories, and water balance without tedious data entry. Quick +250ml tap logs hydration instantly with optimistic UI feedback.
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-white/80">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#FA114F]" />
                    <span>Concentric SVG Activity Rings with hardware acceleration</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#FA114F]" />
                    <span>Division-by-zero protection prevents NaN progress bars</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#181A18] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <div className="text-3xl font-black text-white">2,250 / 2,500 ml</div>
                <div className="text-xs text-white/50 mt-1 mb-6">Hydration Target (90% Complete)</div>
                <button
                  type="button"
                  className="bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 pointer-events-none"
                >
                  <Droplets size={14} />
                  <span>+250ml Quick Log</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00E5FF]">Historical Insights</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-4">
                  Day-to-Year Calorie Analytics
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Seamlessly toggle between Daily, Weekly, Monthly, and Annual training metrics. High-resolution SVG bar graphs depict net calories, workout time, and consistency trends.
                </p>
              </div>

              <div className="bg-[#181A18] border border-white/10 rounded-2xl p-6">
                <div className="text-xs font-bold text-white mb-4">Weekly Caloric Output</div>
                <div className="flex items-end justify-between h-36 pt-4 gap-2">
                  {[65, 80, 45, 90, 75, 100, 60].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div
                        style={{ height: `${h}%` }}
                        className="w-full bg-[#B8F45A] rounded-t-lg transition-all"
                      />
                      <span className="text-[10px] text-white/40">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Zero-Trust Vault</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-4">
                  Local-First, Self-Hosted Supabase Sync
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Your physical activity and biometric data belong strictly to you. With self-hosted PostgreSQL/Supabase backing, zero external tracking scripts, and instant real-time deletion enforcement.
                </p>
              </div>

              <div className="bg-[#181A18] border border-white/10 rounded-2xl p-6 space-y-3 text-xs">
                <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                  <span className="text-white font-medium">Local State Storage</span>
                  <span className="text-emerald-400 font-bold">Encrypted &amp; Bound</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                  <span className="text-white font-medium">Third-Party Trackers</span>
                  <span className="text-emerald-400 font-bold">0 Detected</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                  <span className="text-white font-medium">Cloud Sync Protocol</span>
                  <span className="text-emerald-400 font-bold">PostgreSQL via pg Pool</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/10 text-left">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
            [ CLARITY &amp; TRUST ]
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#111312] border border-white/10 rounded-2xl overflow-hidden transition-colors hover:border-white/20"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                type="button"
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-sm sm:text-base text-white cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-white/50 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-[#B8F45A]' : ''}`}
                />
              </button>

              {activeFaq === idx && (
                <div className="px-6 pb-5 text-xs sm:text-sm text-white/70 font-normal leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. HIGH-IMPACT LAUNCH BANNER */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-b from-[#181A18] to-[#111312] border border-[#B8F45A]/30 rounded-[36px] p-8 sm:p-14 relative overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-[#B8F45A]/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Step into the ultimate daily flow.
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto mb-8 font-normal">
            No signup fees, no passwords to forget. Just seamless fitness tracking crafted for athletes who execute.
          </p>

          <button
            onClick={onLaunchApp}
            type="button"
            className="inline-flex items-center gap-3 bg-[#B8F45A] text-[#111312] font-black text-sm uppercase tracking-wider px-8 py-4 rounded-full shadow-[0_0_36px_rgba(184,244,90,0.4)] hover:bg-[#a6e646] hover:shadow-[0_0_48px_rgba(184,244,90,0.6)] active:scale-95 transition-all cursor-pointer"
          >
            <span>Launch FitFlow App</span>
            <ArrowRight size={16} className="stroke-[3]" />
          </button>
        </div>
      </section>

      {/* 7. MINIMALIST EDITORIAL FOOTER */}
      <footer className="py-12 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/10 text-xs text-white/50 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <BrandMark size="sm" />
          <span className="font-extrabold text-sm text-white">FitFlow</span>
          <span>•</span>
          <span>Athletic Wellness Architecture</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-white/60">
          <button onClick={onLaunchApp} className="hover:text-white transition-colors cursor-pointer">
            Open App
          </button>
          <a href="#hero" className="hover:text-white transition-colors">
            Back to Top
          </a>
        </div>

        <div>
          © {new Date().getFullYear()} FitFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
