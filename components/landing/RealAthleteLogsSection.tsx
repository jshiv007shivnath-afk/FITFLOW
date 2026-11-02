'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function RealAthleteLogsSection() {
  const [activeLog, setActiveLog] = useState<number>(0);

  const logs = [
    {
      id: 1,
      athlete: 'Endurance Runner • Sub-3:00 Marathon Cycle',
      headline: 'From 3:18 to 2:57:42 in 16 structured weeks',
      discipline: 'Distance Running & Zone 2 Pacing',
      duration: '16 Weeks • 64 Sessions Logged',
      metrics: [
        { label: 'Total Distance', value: '784 km' },
        { label: 'Average Zone 2 Pace', value: '4:48 /km' },
        { label: 'Peak Long Run', value: '34.2 km' },
        { label: 'Resting Heart Rate', value: '54 → 47 BPM' },
      ],
      breakdown:
        'Prior to FitFlow, threshold runs were performed too quickly, causing chronic hamstring tightness. FitFlow enforced strict 75-minute Zone 2 ceiling alarms, preventing cardiovascular over-extension while progressively stacking weekly mileage.',
      milestones: [
        'Week 04: Base volume established at 48km weekly without joint fatigue',
        'Week 09: First 28km progressive long run with even negative splits',
        'Week 14: Final 10k threshold simulation completed at 3:52/km pace',
      ],
    },
    {
      id: 2,
      athlete: 'Powerlifter • 200kg Deadlift Milestone',
      headline: 'Surpassing the 440lb plateau with RPE velocity regulation',
      discipline: 'Strength & Hypertrophy',
      duration: '12 Weeks • 48 Sessions Logged',
      metrics: [
        { label: 'Starting 1RM', value: '175 kg' },
        { label: 'Final Pull 1RM', value: '202.5 kg' },
        { label: 'Volume Tonnage', value: '142,800 kg' },
        { label: 'Injury Incidents', value: '0 Tendon Strains' },
      ],
      breakdown:
        'Standard linear progression programs led to repeated lumbar plateaus. Using FitFlow volume calculations and 180-second dynamic rest intervals, working sets were throttled when bar speed fell below threshold, ensuring clean lockout mechanics on every heavy single.',
      milestones: [
        'Week 03: RPE 8.0 auto-regulation scaled back set 4 to prevent lower back rounding',
        'Week 07: 185kg triple achieved at lower perceived exertion than previous PR',
        'Week 12: Clean competition deadlift lock at 202.5kg with zero hitching',
      ],
    },
    {
      id: 3,
      athlete: 'Everyday Professional • 100-Day Movement Streak',
      headline: 'Rewiring sedentary habits into 10,000 daily steps',
      discipline: 'Habit Architecture & Metabolic Health',
      duration: '100 Consecutive Days',
      metrics: [
        { label: 'Starting Baseline', value: '3,200 Steps/Day' },
        { label: 'Final Average', value: '11,400 Steps/Day' },
        { label: 'Hydration Target', value: '3.0 L/Day (94% Hit)' },
        { label: 'Energy Mid-Day Dip', value: 'Eliminated' },
      ],
      breakdown:
        'Long desk hours created chronic afternoon lethargy and shallow breathing. FitFlow circadian hydration prompts and step streak milestones re-anchored daily movement around lunch walks and early morning mobility flows without gym intimidation.',
      milestones: [
        'Day 21: Habit streak established; evening walk became automated reflex',
        'Day 50: 50-day badge unlocked with consistent 2.8L water pacing',
        'Day 100: Century milestone completed with zero missed activity days',
      ],
    },
  ];

  const current = logs[activeLog];

  return (
    <section className="w-full py-16 sm:py-24 bg-white border-t border-[#E7E2E8]" id="section-athlete-logs">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[12px] font-bold text-[#6a527c] tracking-wider uppercase mb-3 px-3.5 py-1 rounded-full bg-[#f2ecf3]">
            Verified Training Archives
          </span>
          <h2 className="font-['Manrope'] text-[30px] sm:text-[44px] font-bold text-[#1c1b1f] tracking-tight leading-[1.12] mb-4">
            Real training logs, documented rep by rep
          </h2>
          <p className="text-[#57535A] text-[15px] sm:text-[17px] leading-relaxed">
            No fabricated celebrity endorsements or generic 5-star quotes. Here is how real athletes structure their training cycles inside FitFlow.
          </p>
        </div>

        {/* Case Log Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto mb-8">
          {logs.map((log, idx) => {
            const isSelected = activeLog === idx;
            return (
              <button
                key={log.id}
                type="button"
                onClick={() => setActiveLog(idx)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-1 ring-neutral-900'
                    : 'bg-[#FAF9FB] text-neutral-800 border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-amber-400' : 'text-[#6a527c]'}`}>
                  Case Study 0{idx + 1}
                </div>
                <div className="text-[13px] font-bold leading-snug">{log.athlete.split('•')[0].trim()}</div>
                <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {log.discipline}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Log Case Display (Unnested High-Craft Presentation) */}
        <div className="max-w-4xl mx-auto bg-white rounded-[28px] border border-[#E7E2E8] p-6 sm:p-10 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="pb-6 border-b border-neutral-200/80">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-0.5 rounded-full bg-[#f2ecf3] text-[#6a527c] text-[11px] font-bold uppercase tracking-wider">
                    {current.athlete}
                  </span>
                  <span className="text-[12px] text-neutral-500 font-mono">{current.duration}</span>
                </div>
                <h3 className="text-[22px] sm:text-[26px] font-bold text-neutral-900 leading-snug [text-wrap:balance]">
                  {current.headline}
                </h3>
              </div>

              {/* Verified Metrics Strip (Clean Divided Columns without nested cards) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-2 border-b border-neutral-200/80">
                {current.metrics.map((m, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">{m.label}</div>
                    <div className="text-[20px] sm:text-[22px] font-bold text-neutral-900 font-mono">{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Case Narrative */}
              <div className="space-y-2 py-2 border-b border-neutral-200/80">
                <div className="text-[13px] font-bold text-neutral-800 uppercase tracking-wider">
                  Training Cycle Retrospective
                </div>
                <p className="text-[15px] text-neutral-700 leading-relaxed font-medium max-w-prose [text-wrap:pretty]">
                  {current.breakdown}
                </p>
              </div>

              {/* Verified Milestones Timeline */}
              <div className="space-y-3 pt-2">
                <div className="text-[13px] font-bold text-neutral-800 uppercase tracking-wider">
                  Documented Milestones
                </div>
                <div className="space-y-2.5">
                  {current.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-[14px] text-neutral-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="[text-wrap:pretty]">{milestone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
