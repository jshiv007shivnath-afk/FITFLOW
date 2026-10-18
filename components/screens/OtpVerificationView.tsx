'use client';

import React, { useState, useEffect } from 'react';
import { useFitFlow } from '@/context/FitFlowContext';
import { Refresh } from 'reicon-react';
import { BrandMark } from '@/components/ui/BrandMark';
import CodeSlots from '@/components/ui/CodeSlots';
import SlideCommit from '@/components/ui/SlideCommit';

export function OtpVerificationView() {
  const {
    pendingOtpEmail,
    setShowLogin,
    setShowOtp,
    completeOtpLogin,
    showToast,
  } = useFitFlow();

  const emailDisplay = pendingOtpEmail || 'athlete@example.com';
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (status !== 'idle') {
      setStatus('idle');
    }
  };

  const handleVerifyCommit = async (): Promise<boolean> => {
    if (code.length < 6) {
      showToast('Please enter all 6 digits first.');
      throw new Error('Code incomplete');
    }

    setIsVerifying(true);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setIsVerifying(false);

        if (code === '000000') {
          setStatus('error');
          showToast('Invalid verification code. Please try again.');
          reject(new Error('Invalid code'));
          return;
        }

        setStatus('success');
        showToast('Verification successful!');
        resolve(true);
      }, 400);
    });
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(45);
    setCode('');
    setStatus('idle');
    showToast(`New verification code sent to ${emailDisplay}`);
  };

  const handleChangeEmail = () => {
    setShowOtp(false);
    setShowLogin(true);
  };

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
          <div className="flex flex-col gap-1.5 mb-5 text-left">
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
          </div>

          {/* React Bits Physics-Animated CodeSlots Component */}
          <div className="w-full flex flex-col items-center gap-4 py-2">
            <CodeSlots
              length={6}
              value={code}
              status={status}
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

            {/* Resend Code Action */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#525650] pt-2">
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
            </div>
          </div>
        </div>

        {/* 3. Bottom Action: React Bits <SlideCommit /> Animation (Slide to continue) */}
        <div className="w-full flex flex-col items-center justify-center gap-2 pt-6 mt-auto">
          <div className="w-full flex justify-center">
            <SlideCommit
              label="Slide to continue"
              doneLabel="Continue"
              errorLabel="Invalid code"
              width={310}
              height={54}
              radius={27}
              trackColor="#111312"
              handleColor="#FFFFFF"
              successColor="#15803D"
              dangerColor="#EF4444"
              disabled={code.length < 6 || isVerifying}
              onConfirm={handleVerifyCommit}
              onDone={() => {
                setTimeout(() => {
                  completeOtpLogin();
                }, 350);
              }}
            />
          </div>

          {code.length < 6 && (
            <span className="text-xs text-[#525650] text-center">
              Enter 6 digits to enable slide
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
