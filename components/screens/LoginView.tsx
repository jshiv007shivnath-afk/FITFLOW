'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFitFlow } from '@/context/FitFlowContext';

export function LoginView() {
  const { setShowPrivacyPolicy, setShowTerms, showToast, requestOtpLogin } = useFitFlow();

  const [mode, setMode] = useState<'signup' | 'login'>('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutMessage, setLockoutMessage] = useState<string | null>(null);
  const [isAccountDeleted, setIsAccountDeleted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setLockoutMessage(null);
    setIsAccountDeleted(false);
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      showToast('Wrong Email. Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const fullName = firstName ? `${firstName.trim()} ${lastName.trim()}`.trim() : (trimmedEmail ? trimmedEmail.split('@')[0] : 'Athlete');

    try {
      // Send 6-digit OTP to user email
      const otpRes = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const otpData = await otpRes.json().catch(() => ({}));

      if (otpRes.status === 403 || otpData.accountDeleted || otpData.error === 'Your account is deleted') {
        setIsSubmitting(false);
        setIsAccountDeleted(true);
        return;
      }

      if (!otpRes.ok && otpRes.status === 429) {
        showToast(otpData.error || 'Please wait before requesting another code');
        setIsSubmitting(false);
        return;
      }

      if (!otpRes.ok && otpRes.status === 423) {
        setIsSubmitting(false);
        const lockMsg = otpData.error || 'Try again next day';
        setLockoutMessage(lockMsg);
        showToast(lockMsg);
        return;
      }

      setIsSubmitting(false);
      requestOtpLogin(trimmedEmail, fullName);
    } catch (err: any) {
      setIsSubmitting(false);
      showToast(err?.message || 'Verification code sent to email');
      requestOtpLogin(trimmedEmail, fullName);
    }
  };

  return (
    <div className="relative w-full min-h-full flex flex-col justify-between bg-[#F8F8F6] text-[#111312] selection:bg-[#B8F45A] selection:text-[#111312] overflow-y-auto no-scrollbar font-sans">
      {/* 1. Mascot Hero Banner (Clean 3D render with NO baked-in text + Top-Left FitFlow branding) */}
      <div className="w-full h-[260px] sm:h-[275px] relative overflow-hidden shrink-0">
        <img
          src="/login_mascot_clean.jpg"
          alt="FitFlow Mascot"
          className="w-full h-full object-cover object-[center_24%]"
        />

        {/* Top-Left FitFlow Branding with High-Contrast Frosted Dark Pill */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 shadow-sm">
          <img
            src="/icon.png"
            alt=""
            className="w-5 h-5 rounded-md object-contain"
          />
          <span className="text-xs font-bold tracking-widest uppercase text-white drop-shadow-sm">
            FITFLOW
          </span>
        </div>

        {/* Level-One Accessible Headline (Title case, high-contrast dark scrim) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex flex-col justify-end px-5 pb-11 pointer-events-none">
          <h1 className="text-white font-black text-xl sm:text-2xl tracking-tight leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Explore.
            <br />
            Train. Grow.
          </h1>
        </div>
      </div>

      {/* 2. White Sheet Form Container */}
      <div className="relative -mt-8 rounded-t-[32px] bg-white px-5 sm:px-6 pt-4 pb-3 flex-1 flex flex-col justify-between shadow-[0_-10px_32px_rgba(0,0,0,0.07)] z-10">
        <div className="w-full max-w-sm mx-auto flex flex-col">
          {isAccountDeleted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center justify-center text-center py-8 px-4"
            >
              <div className="w-14 h-14 rounded-full bg-[#FFF1F2] border border-[#FFE4E6] text-[#E11D48] flex items-center justify-center text-2xl font-bold mb-4 shadow-xs">
                ✕
              </div>
              <h2 className="text-lg font-bold text-[#111312] mb-6">
                Your account is deleted
              </h2>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  setIsAccountDeleted(false);
                  setEmail('');
                  setFirstName('');
                  setLastName('');
                  setLockoutMessage(null);
                }}
                className="w-full h-11 rounded-xl bg-[#111312] hover:bg-black text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer flex items-center justify-center"
              >
                Try with other email
              </motion.button>
            </motion.div>
          ) : (
            <>
              {/* Editorial Subtitle */}
              <div className="w-full flex flex-col items-center text-center pt-0.5 pb-1">
                <p className="text-xs text-[#525650] max-w-xs leading-normal">
                  {mode === 'signup'
                    ? 'Enter your details to begin your fitness & wellness journey'
                    : 'Enter your email to receive a secure login code'}
                </p>
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 mt-2">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="first-name-input" className="text-xs font-semibold text-[#111312]">First Name</label>
                  <input
                    id="first-name-input"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#F4F5F7] border border-[#E9EAEC] text-sm text-[#111312] placeholder-[#9CA3AF] focus:bg-white focus:border-[#111312] focus:ring-1 focus:ring-[#111312] outline-none transition"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="last-name-input" className="text-xs font-semibold text-[#111312]">Last Name</label>
                  <input
                    id="last-name-input"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#F4F5F7] border border-[#E9EAEC] text-sm text-[#111312] placeholder-[#9CA3AF] focus:bg-white focus:border-[#111312] focus:ring-1 focus:ring-[#111312] outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Email input */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email-input" className="text-xs font-semibold text-[#111312]">Email</label>
              <input
                id="email-input"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#F4F5F7] border border-[#E9EAEC] text-sm text-[#111312] placeholder-[#9CA3AF] focus:bg-white focus:border-[#111312] focus:ring-1 focus:ring-[#111312] outline-none transition"
                required
              />
            </div>

            {/* Lockout Warning Card */}
            {lockoutMessage && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full p-3 rounded-xl bg-red-50 border border-red-200 text-center flex flex-col items-center gap-1 my-1"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider">
                  <span>🔒</span>
                  <span>Account Blocked</span>
                </div>
                <span className="text-sm font-black text-red-700">
                  {lockoutMessage}
                </span>
              </motion.div>
            )}

            {/* Solid Black Primary Action Button */}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-[#111312] hover:bg-black text-white text-sm font-bold transition-colors shadow-xs active:scale-98 cursor-pointer mt-1.5 flex items-center justify-center gap-2 select-none"
            >
              {isSubmitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === 'signup' ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Don't have an account toggle */}
          <div className="text-center text-xs text-[#525650] pt-3 pb-2">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-semibold text-[#111312] hover:underline cursor-pointer ml-0.5"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-[#111312] hover:underline cursor-pointer ml-0.5"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
            </>
          )}
        </div>

        {/* Footer Legal Links */}
        <div className="w-full flex flex-col items-center text-center gap-1.5 pt-2 pb-1 border-t border-[#ECECE9]/60 shrink-0">
          <p className="text-xs text-[#525650] max-w-xs leading-relaxed">
            By continuing, you agree to FitFlow&apos;s{' '}
            <button
              type="button"
              onClick={() => setShowPrivacyPolicy(true)}
              className="font-semibold text-[#111312] hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="font-semibold text-[#111312] hover:underline cursor-pointer"
            >
              Terms of Service
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
