'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useFitFlow } from '@/context/FitFlowContext';
import { Refresh } from 'reicon-react';
import { BrandMark } from '@/components/ui/BrandMark';
import CodeSlots from '@/components/ui/CodeSlots';
import SlideCommit from '@/components/ui/SlideCommit';
import { SuccessTickAnimation } from '@/components/ui/SuccessTickAnimation';

export function OtpVerificationView() {
  const {
    pendingOtpEmail,
    setShowLogin,
    setShowOtp,
    completeOtpLogin,
    showToast,
    setIsAccountBanned,
  } = useFitFlow();

  const emailDisplay = pendingOtpEmail || 'athlete@example.com';
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(120); // 2 minutes strict expiry
  const [showSuccessTick, setShowSuccessTick] = useState(false);

  const isExpired = otpExpirySeconds <= 0;

  // 2-minute OTP validity countdown timer
  useEffect(() => {
    if (otpExpirySeconds <= 0) return;
    const interval = setInterval(() => {
      setOtpExpirySeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpExpirySeconds]);

  // Resend cooldown timer (60s rate limit)
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCodeChange = (newCode: string) => {
    if (isExpired || isLocked) return;
    setCode(newCode);
    if (status !== 'idle') {
      setStatus('idle');
    }
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleVerifyCommit = async (): Promise<boolean> => {
    if (isExpired) {
      const msg = 'Code expired (2 minutes elapsed). Please request a new code.';
      setErrorMessage(msg);
      showToast(msg);
      throw new Error(msg);
    }

    if (code.length < 6) {
      const msg = 'Please enter all 6 digits first.';
      setErrorMessage(msg);
      showToast(msg);
      throw new Error(msg);
    }

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailDisplay,
          code: code.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      setIsVerifying(false);

      if (res.status === 403 || data.accountBanned || data.error === 'Your ID is ban') {
        setIsAccountBanned(true);
        throw new Error('Your ID is ban');
      }

      if (res.ok && data.success) {
        setStatus('success');
        setErrorMessage(null);
        showToast('Verification successful!');
        return true;
      }

      setStatus('error');
      const errText =
        data.error ||
        (typeof data.remainingAttempts === 'number'
          ? `Wrong OTP. ${data.remainingAttempts} attempt(s) remaining.`
          : 'Wrong OTP. Please try again.');

      setErrorMessage(errText);

      if (res.status === 423) {
        setIsLocked(true);
        showToast(data.error || 'Try again next day');
      } else {
        showToast(errText);
      }

      throw new Error(errText);
    } catch (err: any) {
      setIsVerifying(false);
      setStatus('error');
      const msg = err?.message || 'Wrong OTP. Please try again.';
      setErrorMessage(msg);
      showToast(msg);
      throw err;
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 && !isExpired) return;
    setResendTimer(60);
    setOtpExpirySeconds(120); // Reset 2 minutes validity
    setCode('');
    setStatus('idle');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailDisplay }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 403 || data.accountBanned || data.error === 'Your ID is ban') {
        setIsAccountBanned(true);
        return;
      }

      if (res.status === 423) {
        setIsLocked(true);
        showToast(data.error || 'Try again next day');
        return;
      }

      if (res.status === 429) {
        setResendTimer(data.retryAfterSec || 60);
        showToast(data.error || 'Please wait before requesting a new code.');
        return;
      }

      showToast(`New verification code sent to ${emailDisplay}`);
    } catch {
      showToast(`Verification code sent to ${emailDisplay}`);
    }
  };

  const handleChangeEmail = () => {
    setShowOtp(false);
    setShowLogin(true);
  };

  const handleTickComplete = useCallback(() => {
    setShowSuccessTick(false);
    completeOtpLogin();
  }, [completeOtpLogin]);

  return (
    <div className="relative w-full min-h-full flex flex-col bg-[#FBFBFA] text-[#111312] selection:bg-[#B8F45A] selection:text-[#111312] overflow-y-auto no-scrollbar font-sans">
      {/* 1. Clean Top Header: Original Favicon & Brand (Back button removed as requested) */}
      <div className="w-full flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#ECECE9]/70 shrink-0">
        <div className="flex items-center gap-2">
          <BrandMark size="sm" showText={false} />
          <span className="text-sm font-extrabold tracking-tight text-[#111312]">FitFlow</span>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-[#525650] tracking-wider uppercase">
            Step 1/2
          </span>
        </div>
      </div>

      {/* 2. Main Natural Content Flow: Shifted upwards, Security Verification removed */}
      <div className="w-full max-w-sm mx-auto px-6 pt-3 pb-6 flex-1 flex flex-col justify-between">
        <div className="flex flex-col">
          {/* Editorial Headline & Context (Shifted upward, clean text) */}
          <div className="flex flex-col gap-1.5 mb-3 text-left">
            <h1 className="text-[26px] sm:text-[28px] font-black text-[#111312] tracking-tight leading-tight">
              Enter verification code
            </h1>
            <p className="text-xs text-[#525650] leading-relaxed mt-1">
              We sent a 6-digit confirmation code to{' '}
              <span className="font-bold text-[#111312]">{emailDisplay}</span>.
              <button
                type="button"
                onClick={handleChangeEmail}
                className="ml-1.5 text-[#111312] hover:text-[#525650] underline font-semibold cursor-pointer inline-block"
              >
                Change
              </button>
            </p>

            {/* 2-Minute Expiry Countdown Pill */}
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                  isExpired
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : otpExpirySeconds < 30
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-[#F2F4F1] text-[#111312] border-[#E1E4DF]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isExpired ? 'bg-red-500' : 'bg-[#15803D] animate-pulse'
                  }`}
                />
                <span>
                  {isExpired
                    ? 'Code expired (2 min)'
                    : `Expires in ${formatTime(otpExpirySeconds)}`}
                </span>
              </span>
            </div>
          </div>

          {/* Account Lockout Banner */}
          {isLocked && (
            <div className="w-full p-4 rounded-2xl bg-red-50 border border-red-200 text-center flex flex-col items-center gap-1.5 mb-3 shadow-xs">
              <span className="text-2xl">🔒</span>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Account Blocked for 24 Hours</span>
              <span className="text-base font-black text-red-700">Try again next day</span>
            </div>
          )}

          {/* Code Expired Notice */}
          {isExpired && !isLocked && (
            <div className="w-full p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center flex flex-col items-center gap-1 mb-2 shadow-xs">
              <span className="text-xl">⌛</span>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Code Expired (2 minutes elapsed)
              </span>
              <span className="text-xs text-amber-900 leading-relaxed">
                You can no longer enter this code. Please tap &quot;Resend code&quot; to receive a new code.
              </span>
            </div>
          )}

          {/* React Bits Physics-Animated CodeSlots Component */}
          <div className="w-full flex flex-col items-center gap-4 py-2">
            <CodeSlots
              length={6}
              value={code}
              status={status}
              disabled={isExpired || isLocked}
              onChange={handleCodeChange}
              onComplete={() => {
                // When 6 digits land, status stays ready for SlideCommit
              }}
              accentColor="#111312"
              inkColor="#111312"
              slotColor="#FFFFFF"
              digitColor="#FFFFFF"
              dangerColor="#EF4444"
              slotSize={46}
              gap={8}
              radius={12}
              bounce={0.2}
              settle={0.3}
              rise={8}
              cascade={20}
              autoFocus={true}
            />

            {/* Inline Error Message */}
            {errorMessage && !isLocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[320px] py-2 px-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] flex items-center justify-center gap-1.5 text-xs font-bold text-center shadow-xs"
              >
                <span className="text-sm">⚠️</span>
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Resend Code Action */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#525650] pt-2">
              {isExpired ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="px-4 py-2 rounded-xl bg-[#111312] hover:bg-black text-[#B8F45A] font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <Refresh size={13} />
                  <span>Resend code (2 min)</span>
                </button>
              ) : (
                <>
                  <span>Didn&apos;t get the code?</span>
                  {resendTimer > 0 ? (
                    <span className="font-semibold text-[#111312] tabular-nums">
                      Resend in {resendTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="font-bold text-[#111312] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Refresh size={13} />
                      <span>Resend code</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3. Bottom Action: React Bits <SlideCommit /> Animation (Slide to continue) */}
        <div className="w-full flex flex-col items-center justify-center gap-2 pt-6 mt-auto">
          <div className="w-full flex justify-center">
            <SlideCommit
              label="Slide to continue"
              doneLabel="Continue"
              errorLabel={errorMessage || "Wrong OTP"}
              width={310}
              height={54}
              radius={27}
              trackColor="#111312"
              handleColor="#FFFFFF"
              successColor="#15803D"
              dangerColor="#EF4444"
              disabled={code.length < 6 || isVerifying || isLocked || isExpired}
              onConfirm={handleVerifyCommit}
              onDone={() => {
                setShowSuccessTick(true);
              }}
            />
          </div>

          {isLocked ? (
            <span className="text-xs font-bold text-red-600 text-center">
              Try again next day
            </span>
          ) : isExpired ? (
            <span className="text-xs font-bold text-amber-700 text-center">
              Code expired — Tap &quot;Resend code&quot; to receive a new code
            </span>
          ) : code.length < 6 ? (
            <span className="text-xs text-[#525650] text-center">
              Enter 6 digits to enable slide
            </span>
          ) : null}
        </div>
      </div>

      {/* Payment-Style Success Tick Animation */}
      <SuccessTickAnimation
        show={showSuccessTick}
        durationMs={850}
        onComplete={handleTickComplete}
      />
    </div>
  );
}
