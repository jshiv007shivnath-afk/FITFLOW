'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface RuangEditLandingPageProps {
  onLaunchApp?: () => void;
}

export function RuangEditLandingPage({ onLaunchApp }: RuangEditLandingPageProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  const scrollCarousel = (offset: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#1c1b1f] antialiased font-['Manrope',sans-serif] selection:bg-[#ffbd5a] selection:text-[#291800] overflow-x-hidden">
      {/* Top Main Canvas Container (Clean White Canvas, No Side Purple Background) */}
      <div className="w-full bg-white flex flex-col">
        {/* ============================================== */}
        {/* HEADER                                         */}
        {/* ============================================== */}
        <header className="w-full h-[76px] border-b border-[#E7E2E8] bg-white/95 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-12">
          <div className="max-w-[1240px] mx-auto h-full flex items-center justify-between">
            {/* Left Nav */}
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-8">
                <a
                  href="#home"
                  className="transition-colors text-[#6a527c] font-bold text-[14px] tracking-wide"
                >
                  Home
                </a>
                <button
                  type="button"
                  onClick={() => scrollToSection('section-our-feature')}
                  className="text-[#57535A] hover:text-[#1c1b1f] font-semibold text-[14px] tracking-wide transition-colors cursor-pointer"
                >
                  Services
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('section-community')}
                  className="text-[#57535A] hover:text-[#1c1b1f] font-semibold text-[14px] tracking-wide transition-colors cursor-pointer"
                >
                  About
                </button>
              </nav>
            </div>

            {/* Brand Logo & Name (Using local App Favicon) */}
            <div className="flex items-center gap-3">
              <a href="#home" className="flex items-center gap-2.5 group">
                <img
                  src="/icon.png"
                  alt="FitFlow Logo"
                  className="w-8 h-8 rounded-lg object-contain shadow-sm group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    // Fallback to SVG if image fails
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="font-['Manrope'] text-[22px] text-[#1c1b1f] tracking-tight font-bold">
                  Fitflow app
                </span>
              </a>
            </div>

            {/* Right Nav & Action CTAs */}
            <div className="flex items-center gap-4 lg:gap-6">
              <nav className="hidden md:flex items-center">
                <button
                  type="button"
                  onClick={() => scrollToSection('section-our-feature')}
                  className="text-[#57535A] hover:text-[#1c1b1f] font-semibold text-[14px] tracking-wide transition-colors cursor-pointer"
                >
                  Class
                </button>
              </nav>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={onLaunchApp}
                className="hidden sm:inline-flex items-center gap-2 h-[44px] px-6 rounded-full bg-[#FBFAFC] border border-[#E7E2E8] hover:border-[#B6A6BE] text-[#57535A] hover:text-[#1c1b1f] text-[13px] font-semibold transition-all group cursor-pointer shadow-sm"
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
                className="w-9 h-9 rounded-full bg-[#6a527c] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-sm hover:bg-[#5a426c] transition-colors"
                aria-label="User Profile"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
              </motion.button>

              {/* Mobile Menu Dropdown Button */}
              <div className="md:hidden relative">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-[#E7E2E8] bg-[#FBFAFC] text-[#1c1b1f]"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {mobileMenuOpen ? 'close' : 'menu'}
                  </span>
                </button>

                <AnimatePresence>
                  {mobileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 w-56 p-4 bg-white border border-[#E7E2E8] rounded-2xl shadow-xl flex flex-col gap-3 z-50"
                    >
                      <a
                        href="#home"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[#57535A] hover:text-[#1c1b1f] text-[14px] font-semibold py-1.5"
                      >
                        Home
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          scrollToSection('section-our-feature');
                        }}
                        className="text-left text-[#57535A] hover:text-[#1c1b1f] text-[14px] font-semibold py-1.5"
                      >
                        Services
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          scrollToSection('section-community');
                        }}
                        className="text-left text-[#57535A] hover:text-[#1c1b1f] text-[14px] font-semibold py-1.5"
                      >
                        About
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          scrollToSection('section-our-feature');
                        }}
                        className="text-left text-[#57535A] hover:text-[#1c1b1f] text-[14px] font-semibold py-1.5"
                      >
                        Class
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onLaunchApp?.();
                        }}
                        className="text-[#57535A] hover:text-[#1c1b1f] text-[14px] font-semibold py-2 flex items-center justify-between border-t border-[#E7E2E8] mt-1 pt-3 text-left w-full cursor-pointer"
                      >
                        <span>Contacts us</span>
                        <span className="material-symbols-outlined text-[16px]">north_east</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* ============================================== */}
        {/* MAIN BODY                                      */}
        {/* ============================================== */}
        <main className="flex-1 w-full bg-white relative">
          <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative" id="home">
            {/* ============================================== */}
            {/* FLOATING DECORATIVE STARS (Motion Spec 1)      */}
            {/* ============================================== */}
            {/* Star 1: Top Left Subtle Accent */}
            <motion.div
              aria-hidden="true"
              animate={{
                y: [0, -10, 0, 10, 0],
                rotate: [0, 90, 180, 270, 360],
                opacity: [0.65, 0.95, 0.7, 0.95, 0.65],
              }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="pointer-events-none absolute top-14 left-4 sm:left-8 md:left-14 text-[#846a96]/80 z-10 w-8 h-8 flex items-center justify-center"
            >
              <svg fill="currentColor" height="22" viewBox="0 0 24 24" width="22">
                <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z" />
              </svg>
            </motion.div>

            {/* Star 2: Top Right above Heading */}
            <motion.div
              aria-hidden="true"
              animate={{
                y: [0, -12, 0, 12, 0],
                rotate: [0, -90, -180, -270, -360],
                opacity: [0.75, 1, 0.8, 1, 0.75],
              }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="pointer-events-none absolute top-16 right-16 sm:right-28 md:right-36 text-[#846a96] z-10 w-10 h-10 flex items-center justify-center"
            >
              <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
              </svg>
            </motion.div>

            {/* Star 3: Mid Right beside "with Our" */}
            <motion.div
              aria-hidden="true"
              animate={{
                y: [0, 10, 0, -10, 0],
                rotate: [0, 120, 240, 360],
                opacity: [0.6, 0.9, 0.65, 0.9, 0.6],
              }}
              transition={{
                duration: 5.0,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="pointer-events-none absolute top-48 right-6 sm:right-14 md:right-20 text-[#846a96]/75 z-10 w-9 h-9 flex items-center justify-center"
            >
              <svg fill="currentColor" height="19" viewBox="0 0 24 24" width="19">
                <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z" />
              </svg>
            </motion.div>

            {/* Star 4: Lower Right Hero */}
            <motion.div
              aria-hidden="true"
              animate={{
                y: [0, -8, 0, 8, 0],
                rotate: [0, 90, 180, 270, 360],
                opacity: [0.7, 1, 0.75, 1, 0.7],
              }}
              transition={{
                duration: 3.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="pointer-events-none absolute top-[360px] right-8 sm:right-20 md:right-28 text-[#846a96] z-10 w-10 h-10 flex items-center justify-center"
            >
              <svg fill="currentColor" height="22" viewBox="0 0 24 24" width="22">
                <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
              </svg>
            </motion.div>

            {/* ============================================== */}
            {/* HERO SECTION (Motion Spec 2)                   */}
            {/* ============================================== */}
            <section className="w-full pt-10 pb-12 flex flex-col items-center relative overflow-hidden">
              {/* Top Right Version Pill Badge (1.0.0 Requirement) */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex justify-end mb-4 md:mb-6"
              >
                <div className="inline-flex items-center gap-1.5 p-1 bg-[#f2ecf3] rounded-full shadow-sm">
                  <span className="px-3.5 py-1 rounded-full bg-[#846a96] text-white text-[12px] font-semibold tracking-wide">
                    Fitflow 1.0.0
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#f2daff] text-[#543e63] text-[12px] font-semibold">
                    2026.04
                  </span>
                </div>
              </motion.div>

              {/* Centered Editorial Display Headline with Reveal & Stagger */}
              <div className="max-w-4xl text-center select-none relative z-10">
                <h1 className="font-['Manrope'] text-[38px] sm:text-[54px] lg:text-[72px] text-[#1c1b1f] tracking-tight font-bold leading-[1.08] mb-3 flex flex-col items-center">
                  {/* Line 1: Hero Stagger 1 */}
                  <motion.span
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                    className="block"
                  >
                    Level Up Your
                  </motion.span>

                  {/* Line 2: with Signature Warm Amber Pill & Sparkle */}
                  <motion.span
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="inline-flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-1"
                  >
                    <span>Fitness</span>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{
                        opacity: 1,
                        scale: [1, 1.03, 1],
                      }}
                      transition={{
                        opacity: { duration: 0.7, delay: 0.28 },
                        scale: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                      }}
                      whileHover={{ scale: 1.08, rotate: 2 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={onLaunchApp}
                      title="Open FitFlow App"
                      className="inline-flex items-center justify-center w-24 sm:w-28 md:w-32 h-11 sm:h-12 md:h-14 rounded-full bg-[#ffbd5a] shadow-inner transition-transform cursor-pointer"
                    >
                      <motion.svg
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                        className="drop-shadow-sm text-white"
                        fill="#FFFFFF"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
                      </motion.svg>
                    </motion.span>
                    <span>with Our</span>
                  </motion.span>

                  {/* Line 3: Curved Orbit Swoosh Underline + FitFlow app */}
                  <motion.span
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
                    className="relative inline-flex items-center justify-center mt-2"
                  >
                    {/* Hand-drawn purple loop swoosh positioned on left */}
                    <motion.svg
                      initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                      className="absolute -left-12 sm:-left-20 -bottom-2 sm:-bottom-3 w-16 sm:w-24 md:w-28 h-auto text-[#846a96] pointer-events-none"
                      fill="none"
                      stroke="#846a96"
                      strokeLinecap="round"
                      strokeWidth="3.2"
                      viewBox="0 0 110 52"
                    >
                      <path d="M102 38C75 48 18 52 8 36C-2 20 18 10 44 8C78 6 94 22 72 32C52 41 22 36 14 26" />
                    </motion.svg>
                    <span className="relative z-10">FitFlow app</span>
                  </motion.span>
                </h1>
              </div>

              {/* Hero Underline Row: Metrics (Left) & Join Us CTA (Right) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.44 }}
                className="w-full max-w-[1080px] mt-10 md:mt-14 flex items-end justify-between px-2 sm:px-4"
              >
                {/* Left Utilitarian Stats Module */}
                <div className="flex flex-col text-left">
                  <span className="text-[12px] text-[#57535A] tracking-wider uppercase font-semibold">
                    With more than
                  </span>
                  <span className="text-[24px] sm:text-[28px] font-bold text-[#1c1b1f] tracking-tight mt-0.5">
                    2K + MEMBERS
                  </span>
                  <span className="text-[13px] font-semibold text-[#57535A]">
                    500 + TUTORIALS
                  </span>
                </div>

                {/* Right Join Us / DOWNLOAD Pill Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLaunchApp}
                  className="group inline-flex items-center gap-3 pl-6 pr-2 py-1.5 rounded-full bg-[#f7f2f8] hover:bg-[#f2ecf3] shadow-sm border border-[#E7E2E8] hover:border-[#B6A6BE] transition-all duration-300 cursor-pointer"
                >
                  <span className="text-[13px] text-[#1c1b1f] font-semibold group-hover:text-[#6a527c] transition-colors tracking-wide">
                    Join us
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[#ffbd5a] text-[#744c00] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                    <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      north_east
                    </span>
                  </div>
                </motion.button>
              </motion.div>

              {/* ============================================== */}
              {/* FEATURED ILLUSTRATION CAROUSEL (Spec 4)         */}
              {/* ============================================== */}
              <div className="w-full max-w-[1140px] mt-12 md:mt-16 flex items-center justify-center gap-3 sm:gap-5 md:gap-7 relative px-2">
                {/* Nav Button: Prev */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => scrollCarousel(-240)}
                  aria-label="Previous illustrations"
                  className="w-12 h-12 rounded-full bg-[#BDA5D0]/50 hover:bg-[#BDA5D0] active:bg-[#BDA5D0]/90 text-white flex items-center justify-center shadow-sm shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C4F83]/40 z-20 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[22px] transition-transform duration-150 active:-translate-x-0.5">
                    arrow_back
                  </span>
                </motion.button>

                {/* 4 Distinct Rounded Pastel Cards Container matching Stitch */}
                <div
                  ref={carouselRef}
                  className="flex items-center gap-4 sm:gap-6 md:gap-7 overflow-x-auto scroll-smooth py-5 px-3 no-scrollbar"
                >
                  {/* Tile 1: Soft Pastel Pink (#F078AD) */}
                  <motion.div
                    whileHover={{ y: -6, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={onLaunchApp}
                    className="w-[160px] sm:w-[190px] md:w-[210px] h-[160px] sm:h-[190px] md:h-[210px] rounded-[36px] bg-[#F078AD] p-3.5 sm:p-4 shrink-0 flex items-center justify-center shadow-[0_10px_28px_rgba(240,120,173,0.22)] cursor-pointer"
                  >
                    <div className="w-full h-full rounded-[26px] overflow-hidden flex items-center justify-center bg-white/25 backdrop-blur-[1px]">
                      <img
                        alt="Daily Habit & Goal Tracking"
                        className="w-full h-full object-cover rounded-[22px] transition-transform duration-300 hover:scale-105"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgjg8LI1bmMZDHiQYFD97qH4RbxRF07S3y1hEX2Vs4NwkYipvIKSXHN6p7uVE9qUK6vJu_psLkFlzu0IPiU6V56sTqpnjRkt7KDOCev4A9HLBRoXKs_WV5YFOnTFl_8ZV6j-PlHzbFtOSAScE2wpQ02dSYtXQs4O4S8-4GRCX4AggbMm6qcDLREhyuaFCiVL53hP0EXBCJvHbFsS9zNK2e24mxhClIzxRjYkrG4t6i"
                      />
                    </div>
                  </motion.div>

                  {/* Tile 2: Soft Purple / Lavender (#BDA5D0) */}
                  <motion.div
                    whileHover={{ y: -6, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={onLaunchApp}
                    className="w-[160px] sm:w-[190px] md:w-[210px] h-[160px] sm:h-[190px] md:h-[210px] rounded-[36px] bg-[#BDA5D0] p-3.5 sm:p-4 shrink-0 flex items-center justify-center shadow-[0_10px_28px_rgba(189,165,208,0.25)] cursor-pointer"
                  >
                    <div className="w-full h-full rounded-[26px] overflow-hidden flex items-center justify-center bg-white/25 backdrop-blur-[1px]">
                      <img
                        alt="Weekly Workout Planner"
                        className="w-full h-full object-cover rounded-[22px] transition-transform duration-300 hover:scale-105"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiQH2kdhl9qctfUjdWYG_KPyNg80SkF4nawnR6N_TCcxiPcwtXdZZX7HjQSaksOdVVZ7NW1dpX2jinAzNt1TB9JDDVl8zTRKKv8GEtG98CJnPxWwgEsMK0Wl9AnYEdc2-O6K7w8wTLUqGSZwLZ-yaGcMnzG9miEM5FouFJCg6QpOe3uMhDAh8Sc73guTphPfNSzR5TcQgL7USGCXvnWPNwmT83d1tqPdpFuC7vBtNC"
                      />
                    </div>
                  </motion.div>

                  {/* Tile 3: Vibrant Aqua / Cyan (#7DD9E7) */}
                  <motion.div
                    whileHover={{ y: -6, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={onLaunchApp}
                    className="w-[160px] sm:w-[190px] md:w-[210px] h-[160px] sm:h-[190px] md:h-[210px] rounded-[36px] bg-[#7DD9E7] p-3.5 sm:p-4 shrink-0 flex items-center justify-center shadow-[0_10px_28px_rgba(125,217,231,0.25)] cursor-pointer"
                  >
                    <div className="w-full h-full rounded-[26px] overflow-hidden flex items-center justify-center bg-white/25 backdrop-blur-[1px]">
                      <img
                        alt="Biometric Vitals & Hydration"
                        className="w-full h-full object-cover rounded-[22px] transition-transform duration-300 hover:scale-105"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-b-73omA53MczqBA_-xr71eVKiybUY3B5FXaqtnrK9i8K9AUBZYEy8EgQgCpcIhchn5cg4SxR0coIslbKx32kVY-HL3jD4rwrzax-eviJB75bSScCW9lbVy5WoQzJhweGax6NOGPAanyEIdt3SWFFRIrDHLayXMXUmpQ3kId3-GjnytnoaRRZueTaPEAtJDylwdUUFESDyqDimoFcJji0KP6X7PFXpqbZp-iATmt3"
                      />
                    </div>
                  </motion.div>

                  {/* Tile 4: Warm Amber / Orange (#F7B653) */}
                  <motion.div
                    whileHover={{ y: -6, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={onLaunchApp}
                    className="w-[160px] sm:w-[190px] md:w-[210px] h-[160px] sm:h-[190px] md:h-[210px] rounded-[36px] bg-[#F7B653] p-3.5 sm:p-4 shrink-0 flex items-center justify-center shadow-[0_10px_28px_rgba(247,182,83,0.25)] cursor-pointer"
                  >
                    <div className="w-full h-full rounded-[26px] overflow-hidden flex items-center justify-center bg-white/25 backdrop-blur-[1px]">
                      <img
                        alt="Step Streaks & Activity Rings"
                        className="w-full h-full object-cover rounded-[22px] transition-transform duration-300 hover:scale-105"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoZScG9lAHG5P-vIrWJQLX8yqikSYLpJ5IXqS3pepz2TMDziYFkSLEFFkOnG754ADcZxm_8S-WuCOJSUuMlHD4M54nCwAAWbr9gitue5allATg--UcDZ-hfFkPQ8VBu3MhJ0uS2fmd59ET10hlU3LUqxoV2Cwext6G1jxIJajY0R5wnROmaa3qHJQ-1ES_hmh8OKJbTYwaHUGZ58KCPs8uABFik_0HA_GqCQCE0XeO"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Nav Button: Next */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => scrollCarousel(240)}
                  aria-label="Next illustrations"
                  className="w-12 h-12 rounded-full bg-[#BDA5D0]/50 hover:bg-[#BDA5D0] active:bg-[#BDA5D0]/90 text-white flex items-center justify-center shadow-sm shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C4F83]/40 z-20 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[22px] transition-transform duration-150 active:translate-x-0.5">
                    arrow_forward
                  </span>
                </motion.button>
              </div>
            </section>

            {/* Orbiting Sparkle Star at Right Margin */}
            <motion.div
              aria-hidden="true"
              animate={{
                y: [0, -10, 0, 10, 0],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 4.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="pointer-events-none absolute top-[740px] right-12 md:right-20 text-[#846a96] z-10 w-12 h-12 flex items-center justify-center"
            >
              <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
              </svg>
            </motion.div>

            {/* ============================================== */}
            {/* 'OUR FEATURE' SECTION PANEL (Spec 3 & 5)       */}
            {/* ============================================== */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full py-8"
              id="section-our-feature"
            >
              <div className="w-full bg-white rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-[0_8px_24px_rgba(49,37,55,0.06)] border border-[#E7E2E8] relative">
                {/* Section Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-10 pb-2">
                  <h2 className="font-['Manrope'] text-[30px] sm:text-[36px] font-bold text-[#1c1b1f] tracking-tight">
                    Our Feature
                  </h2>
                  <p className="max-w-xs text-[14px] text-[#57535A] text-left sm:text-right leading-relaxed">
                    This is some of the material that will be taught in the Fitflow app
                  </p>
                </div>

                {/* 3-Column Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                  {/* CARD 1: Weekly Planner */}
                  <motion.article
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={onLaunchApp}
                    className="group rounded-[24px] bg-white border border-[#E7E2E8] hover:border-[#B6A6BE] p-6 flex flex-col justify-between shadow-[0_8px_24px_rgba(49,37,55,0.04)] hover:shadow-[0_18px_36px_rgba(49,37,55,0.12)] cursor-pointer"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-['Manrope'] text-[24px] font-bold text-[#1c1b1f] leading-tight">
                          Weekly Planner
                        </h3>
                        <div className="w-10 h-10 rounded-full bg-[#846a96] text-white flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                          <span className="material-symbols-outlined text-[18px]">north_east</span>
                        </div>
                      </div>
                      <p className="text-[14px] text-[#57535A] mb-6 leading-relaxed">
                        Learn to how to set a weekly excersie in the app
                      </p>
                    </div>

                    {/* Artwork Container */}
                    <div className="w-full h-44 rounded-[18px] bg-[#f7f2f8] overflow-hidden flex items-center justify-center p-2 relative">
                      <img
                        alt="Weekly Planner Workout Splits"
                        className="w-full h-full object-cover rounded-[14px] transition-transform duration-300 group-hover:scale-105"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvexe6g9ZjDr0jWfjWrh1svGmrO80Vrb3CF5WEjYX_t-28StFuTkKpMZAGAR0azlf6bwSqKdlwOL6BUrkg3X87qriEjT3W0Eyk8UIB7GXtBys_a_F5wWFEQyoszykMPSSK6GxdkBtby9fO-thhn0_WuomZLVKvf3yPA9ss8Zh8CKWb-TMZkpp0yED8igurQpIkUl2w5_3LSeArjbmdvc23Jcamkwjt-HH5SuqADr-W"
                      />
                    </div>
                  </motion.article>

                  {/* CARD 2 (ACTIVE ACCENT): Daily Streaks */}
                  <motion.article
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={onLaunchApp}
                    className="group rounded-[24px] bg-[#846a96] text-white p-6 flex flex-col justify-between shadow-xl hover:shadow-[0_20px_40px_rgba(132,106,150,0.35)] relative overflow-hidden cursor-pointer"
                  >
                    {/* Background soft ambient gradient circle */}
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-['Manrope'] text-[24px] font-bold text-white leading-tight">
                          Daily
                          <br />
                          Streaks
                        </h3>
                        <div className="w-10 h-10 rounded-full bg-[#ffbd5a] text-[#744c00] flex items-center justify-center shrink-0 shadow-md transition-transform duration-200 group-hover:scale-105">
                          <span className="material-symbols-outlined text-[18px]">north_east</span>
                        </div>
                      </div>
                      <p className="text-[14px] text-white/85 mb-6 leading-relaxed">
                        Learn how to dicipline looks like
                      </p>
                    </div>

                    {/* Artwork Container */}
                    <div className="w-full h-44 rounded-[18px] bg-[#271138]/20 overflow-hidden flex items-center justify-center p-2 relative z-10">
                      <img
                        alt="Daily Streaks and Activity Rings"
                        className="w-full h-full object-cover rounded-[14px] transition-transform duration-300 group-hover:scale-105"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB578IZnXKQG24EBNybakBwWJHk6sgVVy--MlZmo0zNT_V8zslRWBczPY1JGHry6o8f9uqrnIMwxq8ra3z1mDwYpCKaP0tSi2wlRcli-pkVsZfM64o9TMOLi1QeD_zlBBRCEMKdRU3fCXMS0TCfFoYslu3VjnoA65BP_RYZz7TkBarjslX00UGgE4iyvOj1IchZG62XaJez5F84jEyJqsrb9AGY2bkvUbtrX5c1Gfs0"
                      />
                    </div>
                  </motion.article>

                  {/* CARD 3: Visual Health */}
                  <motion.article
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={onLaunchApp}
                    className="group rounded-[24px] bg-white border border-[#E7E2E8] hover:border-[#B6A6BE] p-6 flex flex-col justify-between shadow-[0_8px_24px_rgba(49,37,55,0.04)] hover:shadow-[0_18px_36px_rgba(49,37,55,0.12)] cursor-pointer"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-['Manrope'] text-[24px] font-bold text-[#1c1b1f] leading-tight">
                          Visual
                          <br />
                          Health
                        </h3>
                        <div className="w-10 h-10 rounded-full bg-[#846a96] text-white flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                          <span className="material-symbols-outlined text-[18px]">north_east</span>
                        </div>
                      </div>
                      <p className="text-[14px] text-[#57535A] mb-6 leading-relaxed">
                        Learn how to get the fit by every daily excersices
                      </p>
                    </div>

                    {/* Artwork Container */}
                    <div className="w-full h-44 rounded-[18px] bg-[#f7f2f8] overflow-hidden flex items-center justify-center p-2 relative">
                      <img
                        alt="Visual Health Biometrics"
                        className="w-full h-full object-cover rounded-[14px] transition-transform duration-300 group-hover:scale-105"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7cjjRsfci3HSdW3eZthxXPhWeNpH1UTLLLPuqThmsJmRxNV0iqBdT__jfm1jsJSYuF2lb64H0mwHd1yrYMRgH0xxqU-nSu-1xl5gN_hGTDxl362qspx-jNnkSJZqd0Z8eiJVpdk6X96T26kozdgovxNx2vH0gU4_eh-6Qqlwrwx2PZf3XKpIch39hvmdyW3nzqILX__v_3AUrHJ2-HIP_zKW9UEfutW9v3FZIoCgY"
                      />
                    </div>
                  </motion.article>
                </div>

                {/* Carousel Pagination Dots */}
                <div className="w-full flex items-center justify-center gap-1.5 mt-8">
                  {[0, 1, 2, 3].map((dot) => (
                    <button
                      key={dot}
                      type="button"
                      aria-label={`Go to slide ${dot + 1}`}
                      onClick={() => setActiveDot(dot)}
                      className={`transition-all rounded-full cursor-pointer ${
                        activeDot === dot
                          ? 'w-3 h-2 bg-[#846a96]'
                          : 'w-1.5 h-1.5 bg-[#cdc4ce] hover:bg-[#7c757e]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Navigation Arrows Below Panel */}
            <div className="w-full flex justify-end gap-3 -mt-2 mb-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Previous view"
                onClick={() => scrollToSection('section-our-feature')}
                className="p-2 rounded-full border border-[#E7E2E8] hover:border-[#B6A6BE] text-[#1c1b1f] hover:text-[#6a527c] transition-colors flex items-center cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_left_alt</span>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Next view"
                onClick={() => scrollToSection('section-community')}
                className="p-2 rounded-full border border-[#E7E2E8] hover:border-[#B6A6BE] text-[#1c1b1f] hover:text-[#6a527c] transition-colors flex items-center cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_right_alt</span>
              </motion.button>
            </div>

            {/* Decorative Orbiting Sparkle Star above Community Section */}
            <motion.div
              aria-hidden="true"
              animate={{
                y: [0, -8, 0, 8, 0],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 4.0,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="pointer-events-none absolute bottom-44 right-10 sm:right-16 text-[#846a96] z-10 w-12 h-12 flex items-center justify-center"
            >
              <svg fill="currentColor" height="22" viewBox="0 0 24 24" width="22">
                <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
              </svg>
            </motion.div>

            {/* ============================================== */}
            {/* CLOSING / COMMUNITY INSET PANEL (Spec 5)       */}
            {/* ============================================== */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full pb-14"
              id="section-community"
            >
              <div className="w-full bg-white rounded-[32px] px-6 py-12 sm:px-12 sm:py-16 border border-[#E7E2E8] shadow-[0_8px_24px_rgba(49,37,55,0.05)] text-center relative overflow-hidden flex flex-col items-center">
                {/* Eyebrow text */}
                <span className="text-[13px] text-[#6a527c] font-semibold tracking-wider uppercase mb-4">
                  - Fitflow app -
                </span>

                {/* Headline Statement with Highlighted Pill */}
                <h2 className="max-w-2xl font-['Manrope'] text-[28px] sm:text-[34px] font-bold text-[#1c1b1f] tracking-tight leading-snug mb-5">
                  Helps you learn and hone your skills through a trusted{' '}
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ffddb2] text-[#291800]">
                    Fitflow app
                  </span>{' '}
                  community
                </h2>

                {/* Description Subtitle */}
                <p className="max-w-md text-[14px] text-[#57535A] leading-relaxed mb-10">
                  Come join us and not only increase your knowledge but also your family because we
                  are solid team
                </p>

                {/* Bottom Metadata & Social Bar */}
                <div className="w-full pt-8 border-t border-[#E7E2E8] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#827B86]">
                  {/* Left: Brand lineage */}
                  <span className="text-[14px] text-[#57535A]">Part of Fitflow app</span>

                  {/* Center: Minimal Social Channels */}
                  <div className="flex items-center gap-4 text-[#57535A]">
                    <motion.a
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.92 }}
                      href="mailto:support@fitflow.app"
                      aria-label="Direct Email"
                      className="w-8 h-8 rounded-full border border-[#E7E2E8] flex items-center justify-center hover:text-[#1c1b1f] hover:border-[#B6A6BE] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">mail</span>
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.92 }}
                      href="#home"
                      aria-label="Direct Call Contact"
                      className="w-8 h-8 rounded-full border border-[#E7E2E8] flex items-center justify-center hover:text-[#1c1b1f] hover:border-[#B6A6BE] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">call</span>
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.92 }}
                      href="#home"
                      aria-label="Instagram Community Profile"
                      className="w-8 h-8 rounded-full border border-[#E7E2E8] flex items-center justify-center hover:text-[#1c1b1f] hover:border-[#B6A6BE] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                    </motion.a>
                  </div>

                  {/* Right: Archival Attribution */}
                  <span className="text-[14px] text-[#827B86]">
                    Archived by Fitflow app -- 2026
                  </span>
                </div>
              </div>
            </motion.section>
          </div>
        </main>

        {/* ============================================== */}
        {/* FOOTER                                         */}
        {/* ============================================== */}
        <footer className="w-full border-t border-[#E7E2E8] bg-[#FBFAFC] py-12 px-6 lg:px-12">
          <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/icon.png"
                alt="FitFlow Logo"
                className="w-7 h-7 rounded-md object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="font-['Manrope'] text-[18px] text-[#1c1b1f] font-bold">
                Fitflow App
              </span>
              <span className="text-[#827B86] text-[14px] ml-2">
                © 2026 fitflow app. All rights reserved.
              </span>
            </div>

            <div className="flex items-center gap-6 text-[13px] font-semibold text-[#57535A]">
              <button
                type="button"
                onClick={() => scrollToSection('section-our-feature')}
                className="hover:text-[#1c1b1f] transition-colors cursor-pointer"
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('section-community')}
                className="hover:text-[#1c1b1f] transition-colors cursor-pointer"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('section-our-feature')}
                className="hover:text-[#1c1b1f] transition-colors cursor-pointer"
              >
                Class
              </button>
              <button
                type="button"
                onClick={onLaunchApp}
                className="hover:text-[#1c1b1f] transition-colors cursor-pointer"
              >
                Launch App
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Action Pill to Launch Live App */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={onLaunchApp}
          className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#1c1b1f] text-white hover:bg-[#271138] border border-white/20 shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-all cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd5a] animate-ping" />
          <span className="text-[13px] font-bold tracking-wide">Launch Live App</span>
          <span className="material-symbols-outlined text-[16px] text-[#ffbd5a] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            phone_iphone
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
