'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function AthleteFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does FitFlow work completely offline in basement gyms with zero cellular signal?',
      a: 'Yes. FitFlow is engineered with an offline-first SQLite database architecture. You can log multi-set exercises, track resting intervals, and record continuous sensor data underground. Everything synchronizes automatically in the background when connectivity resumes without data loss or UI freezing.',
    },
    {
      q: 'How does the dynamic rest timer determine when I am physically ready for my next set?',
      a: 'Instead of an arbitrary 60-second countdown, FitFlow monitors the optical heart-rate recovery slope via connected BLE sensors. When your heart rate drops into your individual parasympathetic recovery threshold (typically -25 to -30 BPM from peak working load), FitFlow triggers a subtle haptic pulse signaling CNS readiness.',
    },
    {
      q: 'Can I program custom periodization routines like 5/3/1, Push/Pull/Legs, or conjugate waves?',
      a: 'Yes. FitFlow supports custom micro-cycles and mesocycles. You can define custom rep schemes, automated percentage-based 1RM loading, drop-sets, supersets, and scheduled deload recovery weeks with automated volume rollbacks.',
    },
    {
      q: 'How are cardiovascular training zones calculated for individual athletes?',
      a: 'FitFlow uses the clinically validated Karvonen formula (Heart Rate Reserve = Max HR - Resting HR) rather than crude 220-minus-age approximations. You can calibrate benchmarks directly using a 20-minute threshold field test or manual lab lactate results.',
    },
    {
      q: 'Can I export clean workout telemetry to Strava, TrainingPeaks, or Apple Health?',
      a: 'Yes. FitFlow features native bidirectional sync with Apple HealthKit and Google Health Connect, along with one-click export into standard .FIT, GPX, and CSV formats for your personal coach or analytics dashboards.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full py-16 sm:py-24 bg-white border-t border-[#E7E2E8]" id="section-faq">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[12px] font-bold text-[#6a527c] tracking-wider uppercase mb-3 px-3.5 py-1 rounded-full bg-[#f2ecf3]">
            Athlete FAQ
          </span>
          <h2 className="font-['Manrope'] text-[30px] sm:text-[44px] font-bold text-[#1c1b1f] tracking-tight leading-[1.12] mb-4">
            Answers to common training and telemetry questions
          </h2>
          <p className="text-[#57535A] text-[15px] sm:text-[17px] leading-relaxed">
            Specific answers regarding sports science calibration, sensor latency, and offline gym floor mechanics.
          </p>
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E7E2E8] bg-[#FAF9FB] transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6a527c]"
                  aria-expanded={isOpen}
                >
                  <span className="font-['Manrope'] text-[15px] sm:text-[16px] font-bold text-neutral-900 leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 p-1 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-neutral-900 text-white rotate-180' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-[14px] text-neutral-600 leading-relaxed border-t border-neutral-200/60 pt-4 max-w-2xl [text-wrap:pretty]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
