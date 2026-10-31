'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function WeeklyTimelineSection() {
  const [selectedDay, setSelectedDay] = useState<number>(0);

  const days = [
    {
      day: 'Mon',
      fullDay: 'Monday',
      title: 'Heavy Lower Body & Zone 2 Base Flush',
      type: 'Strength + Aerobic',
      duration: '75 min',
      calories: '680 kcal',
      volume: '11,400 kg',
      primaryFocus: 'Barbell Back Squats (4x6 @ 125kg), Romanian Deadlifts (3x8 @ 110kg)',
      secondary: '25-minute post-lift Zone 2 watt-bike flush (124-130 BPM average)',
      intensity: 'High CNS Load (RPE 8.5)',
      status: 'Completed',
    },
    {
      day: 'Tue',
      fullDay: 'Tuesday',
      title: 'Lactate Threshold Intervals & Core Agility',
      type: 'Conditioning',
      duration: '50 min',
      calories: '540 kcal',
      volume: '8.4 km run',
      primaryFocus: '5 x 1,000m threshold repeats @ 3:45/km pace with 90s jog recovery',
      secondary: 'Hanging leg raises, hollow body holds, and rotational cable chops',
      intensity: 'Zone 4 Sustained (164 BPM average)',
      status: 'Completed',
    },
    {
      day: 'Wed',
      fullDay: 'Wednesday',
      title: 'Active Recovery, Hip Mobility & Breathwork',
      type: 'Restoration',
      duration: '40 min',
      calories: '180 kcal',
      volume: 'N/A',
      primaryFocus: 'Pigeon stretch, 90/90 hip flow, thoracic spine foam roller extensions',
      secondary: 'Box breathing (4-4-4-4) to stimulate parasympathetic vagal nerve tone',
      intensity: 'Zone 1 Deload (< 110 BPM)',
      status: 'Completed',
    },
    {
      day: 'Thu',
      fullDay: 'Thursday',
      title: 'Upper Body Hypertrophy & Pull Volume',
      type: 'Hypertrophy',
      duration: '65 min',
      calories: '510 kcal',
      volume: '8,900 kg',
      primaryFocus: 'Weighted Pull-ups (4x6 @ +20kg), Incline Dumbbell Bench (4x8 @ 34kg)',
      secondary: 'Chest-supported T-bar rows, lateral raises, and tricep rope extensions',
      intensity: 'Moderate CNS Load (RPE 8)',
      status: 'Completed',
    },
    {
      day: 'Fri',
      fullDay: 'Friday',
      title: 'Neuromuscular Agility & VO2 Max Sprints',
      type: 'Explosiveness',
      duration: '45 min',
      calories: '490 kcal',
      volume: '6.2 km total',
      primaryFocus: '10 x 200m track sprints @ 95% max velocity with 75s walking recovery',
      secondary: 'Box jumps, lateral bounds, and deceleration mechanics',
      intensity: 'Peak Zone 5 Bursts (182 BPM peak)',
      status: 'Completed',
    },
    {
      day: 'Sat',
      fullDay: 'Saturday',
      title: 'Outdoor Trail Long Run & Elevation Sync',
      type: 'Endurance',
      duration: '95 min',
      calories: '980 kcal',
      volume: '18.5 km run',
      primaryFocus: 'Steady aerobic endurance run with +320m positive vertical climb',
      secondary: 'Electrolyte hydration pacing (500ml per 45 min) + continuous GPS tracking',
      intensity: 'Zone 2/3 Aerobic Base (138 BPM average)',
      status: 'Completed',
    },
    {
      day: 'Sun',
      fullDay: 'Sunday',
      title: 'Weekly Mileage Review & Autonomic Reset',
      type: 'Recovery',
      duration: '30 min',
      calories: '120 kcal',
      volume: 'Weekly Audit',
      primaryFocus: 'Sauna hyperthermic conditioning (20 min @ 85C) followed by cold plunge',
      secondary: 'Log consolidation: review volume progression and plan micro-cycles',
      intensity: 'Passive Restoration',
      status: 'Completed',
    },
  ];

  const active = days[selectedDay];

  return (
    <section className="w-full py-16 sm:py-24 bg-[#FCFBFD] border-t border-[#E7E2E8]" id="section-weekly-timeline">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[12px] font-bold text-[#6a527c] tracking-wider uppercase mb-3 px-3.5 py-1 rounded-full bg-[#f2ecf3]">
            The Week in Motion
          </span>
          <h2 className="font-['Manrope'] text-[30px] sm:text-[44px] font-bold text-[#1c1b1f] tracking-tight leading-[1.12] mb-4">
            Structured periodization, engineered for consistency
          </h2>
          <p className="text-[#57535A] text-[15px] sm:text-[17px] leading-relaxed">
            See how everyday athletes balance heavy strength micro-cycles, Zone 2 aerobic pacing, and autonomic recovery without burning out.
          </p>
        </div>

        {/* Weekly Day Selector Ribbon */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 max-w-4xl mx-auto mb-8">
          {days.map((item, idx) => {
            const isSelected = selectedDay === idx;
            return (
              <button
                key={item.day}
                type="button"
                onClick={() => setSelectedDay(idx)}
                className={`flex flex-col items-center justify-center py-3 sm:py-4 px-1 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-md scale-102'
                    : 'bg-white text-neutral-700 border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <span className={`text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider ${isSelected ? 'text-amber-400' : 'text-neutral-500'}`}>
                  {item.day}
                </span>
                <span className="text-[14px] sm:text-[16px] font-bold mt-0.5">
                  0{idx + 1}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full mt-2 ${isSelected ? 'bg-amber-400' : 'bg-orange-500'}`} />
              </button>
            );
          })}
        </div>

        {/* Selected Day Expanded Details Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-[28px] border border-[#E7E2E8] p-6 sm:p-10 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.day}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-0.5 rounded-full bg-[#f2ecf3] text-[#6a527c] text-[11px] font-bold uppercase tracking-wider">
                      {active.fullDay}
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                      {active.type}
                    </span>
                  </div>
                  <h3 className="text-[22px] sm:text-[26px] font-bold text-neutral-900 leading-snug">
                    {active.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Active Burn</div>
                    <div className="text-[18px] font-mono font-bold text-orange-700">{active.calories}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Session Time</div>
                    <div className="text-[18px] font-mono font-bold text-neutral-900">{active.duration}</div>
                  </div>
                </div>
              </div>

              {/* Protocol Details Columns (Unnested Clean Architectural Layout) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                <div className="space-y-2">
                  <div className="text-[13px] font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-orange-600">fitness_center</span>
                    <span>Primary Training Focus</span>
                  </div>
                  <p className="text-[15px] text-neutral-700 leading-relaxed font-medium [text-wrap:pretty]">
                    {active.primaryFocus}
                  </p>
                </div>

                <div className="space-y-2 border-t md:border-t-0 md:border-l border-neutral-200/80 pt-6 md:pt-0 md:pl-8">
                  <div className="text-[13px] font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-blue-600">sync_alt</span>
                    <span>Cardiovascular and Metabolic Work</span>
                  </div>
                  <p className="text-[15px] text-neutral-700 leading-relaxed font-medium [text-wrap:pretty]">
                    {active.secondary}
                  </p>
                </div>
              </div>

              {/* Volume & Intensity Footnote */}
              <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-[13px] text-neutral-600">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900">Total Workload:</span>
                  <span className="font-mono text-neutral-700">{active.volume}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900">Target Intensity:</span>
                  <span className="font-mono text-[#6a527c] font-semibold">{active.intensity}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
