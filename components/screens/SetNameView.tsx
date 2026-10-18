'use client';

import React, { useState } from 'react';
import { useFitFlow } from '@/context/FitFlowContext';
import { User, ArrowLeft } from 'reicon-react';
import { BrandMark } from '@/components/ui/BrandMark';
import SlideCommit from '@/components/ui/SlideCommit';

export function SetNameView() {
  const { user, setUserName, setShowSetName, setShowOnboarding, setShowOtp } = useFitFlow();
  const [nameInput, setNameInput] = useState(user.name && user.name !== 'Alex Rivers' ? user.name : '');

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = nameInput.trim() || 'Athlete';
    setUserName(finalName);
    setShowSetName(false);
    setShowOnboarding(true);
  };

  const handleBackToOtp = () => {
    setShowSetName(false);
    setShowOtp(true);
  };

  const isInputValid = nameInput.trim().length > 0;

  return (
    <div className="relative w-full min-h-full flex flex-col bg-[#FBFBFA] text-[#111312] selection:bg-[#B8F45A] selection:text-[#111312] overflow-y-auto no-scrollbar font-sans">
      {/* 1. Clean Top Navigation Header */}
      <div className="w-full flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#ECECE9]/70 shrink-0">
        <button
          type="button"
          onClick={handleBackToOtp}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#525650] hover:text-[#111312] transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-[#F2F3EF] cursor-pointer"
          aria-label="Back to verification"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5">
          <BrandMark size="sm" showText={false} />
          <span className="text-xs font-black tracking-tight text-[#111312]">FitFlow</span>
        </div>

        <div className="w-14 text-right">
          <span className="text-xs font-semibold text-[#525650] tracking-wider uppercase">
            Step 2/2
          </span>
        </div>
      </div>

      {/* 2. Main Natural Content Flow */}
      <div className="w-full max-w-sm mx-auto px-6 pt-8 pb-8 flex-1 flex flex-col justify-between">
        <form onSubmit={handleContinue} className="flex flex-col flex-1 justify-between">
          <div className="flex flex-col">
            {/* Editorial Headline & Context (PROFILE SETUP removed) */}
            <div className="flex flex-col gap-1.5 mb-7 text-left">
              <h1 className="text-[26px] sm:text-[28px] font-black text-[#111312] tracking-tight leading-tight">
                What should we call you?
              </h1>
              <p className="text-xs text-[#525650] leading-relaxed mt-1">
                Enter your preferred name to personalize your daily training targets, hydration goals, and weekly streak.
              </p>
            </div>

            {/* Input Field Section */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="athlete-name-input" className="text-xs font-bold text-[#111312]">
                  Preferred Name
                </label>
                <div className="relative flex items-center w-full">
                  <div className="absolute left-3.5 text-[#525650] pointer-events-none">
                    <User size={18} />
                  </div>
                  <input
                    id="athlete-name-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Ansh"
                    maxLength={30}
                    autoFocus
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white text-[#111312] text-sm font-semibold placeholder-[#8C908A] outline-none border border-[#E4E5DF] focus:border-[#111312] focus:ring-1 focus:ring-[#111312] transition shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Bottom Action & Reassurance with React Bits <SlideCommit /> */}
          <div className="w-full flex flex-col items-center justify-center gap-3 pt-8 mt-auto">
            <div className="w-full flex justify-center">
              <SlideCommit
                label="Slide to continue"
                doneLabel="Continue"
                width={310}
                height={54}
                radius={27}
                trackColor="#111312"
                handleColor="#FFFFFF"
                successColor="#15803D"
                dangerColor="#EF4444"
                disabled={!isInputValid}
                onConfirm={async () => {
                  const finalName = nameInput.trim() || 'Athlete';
                  setUserName(finalName);
                  return true;
                }}
                onDone={() => {
                  setTimeout(() => {
                    handleContinue();
                  }, 350);
                }}
              />
            </div>

            {!isInputValid && (
              <span className="text-xs text-[#525650] text-center">
                Enter your name to enable slide
              </span>
            )}

            <p className="text-center text-xs text-[#525650]">
              You can update your name anytime in profile settings.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
