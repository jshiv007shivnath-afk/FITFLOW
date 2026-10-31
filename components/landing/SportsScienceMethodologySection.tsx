'use client';

import React from 'react';
import { motion } from 'motion/react';

export function SportsScienceMethodologySection() {
  const methodologies = [
    {
      code: 'ENG-01',
      title: 'Progressive Overload Auto-Regulation',
      subtitle: 'Volume Load & RIR Fatigue Scaling',
      desc: 'FitFlow computes daily tonnage (sets x reps x load) and evaluates Reps-in-Reserve (RIR). When fatigue velocity slows across consecutive sets, it automatically scales down working sets to prevent central nervous system depletion.',
      metric: 'Micro-Increments: +1.25kg',
      icon: 'trending_up',
    },
    {
      code: 'ENG-02',
      title: 'Dynamic Heart-Rate Recovery Timers',
      subtitle: 'CNS Restoration vs Fixed Clocks',
      desc: 'Static 60-second rest timers ignore physical reality. FitFlow monitors real-time optical heart rate decay: when your cardiovascular rhythm drops into your parasympathetic recovery threshold, an audible haptic cue alerts you for set two.',
      metric: 'Slope Threshold: -25 BPM/min',
      icon: 'timer_play',
    },
    {
      code: 'ENG-03',
      title: 'Acute:Chronic Workload Ratio (ACWR)',
      subtitle: 'Soft-Tissue & Tendon Injury Prevention',
      desc: 'The leading cause of training injuries is sudden volume spikes. FitFlow benchmarks your 7-day acute workload against your 28-day chronic rolling average, alerting you when the ratio exceeds 1.3 to avoid overtraining syndrome.',
      metric: 'Safe Window: 0.8 to 1.3 ACWR',
      icon: 'shield_with_heart',
    },
    {
      code: 'ENG-04',
      title: 'EPOC Caloric Fuel Partitioning',
      subtitle: 'Excess Post-Exercise Oxygen Consumption',
      desc: 'Workouts do not stop burning energy when the timer ends. FitFlow models metabolic oxygen deficit during high-intensity intervals and heavy compound lifts to calculate extended 24-hour basal caloric elevation.',
      metric: 'Extended Burn: +14% 18h Window',
      icon: 'local_fire_department',
    },
  ];

  return (
    <section className="w-full py-16 sm:py-24 bg-[#FCFBFD] border-t border-[#E7E2E8]" id="section-methodology">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[12px] font-bold text-[#6a527c] tracking-wider uppercase mb-3 px-3.5 py-1 rounded-full bg-[#f2ecf3]">
            Scientific Foundations
          </span>
          <h2 className="font-['Manrope'] text-[30px] sm:text-[44px] font-bold text-[#1c1b1f] tracking-tight leading-[1.12] mb-4 [text-wrap:balance]">
            Built on peer-reviewed exercise physiology
          </h2>
          <p className="text-[#57535A] text-[15px] sm:text-[17px] leading-relaxed max-w-2xl [text-wrap:pretty]">
            Most fitness apps repackage generic stopwatch templates. FitFlow translates university sports science directly into your daily workout flow.
          </p>
        </div>

        {/* 2x2 Clean Technical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {methodologies.map((item) => (
            <div
              key={item.code}
              className="bg-white rounded-[24px] border border-[#E7E2E8] p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[12px] font-mono font-bold uppercase tracking-wider text-[#6a527c] bg-[#f2ecf3] px-3 py-1 rounded-full">
                    {item.code}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>
                </div>

                <h3 className="text-[20px] font-bold text-neutral-900 leading-snug mb-1 [text-wrap:balance]">
                  {item.title}
                </h3>
                <div className="text-[13px] font-semibold text-neutral-500 mb-3">
                  {item.subtitle}
                </div>

                <p className="text-[14px] text-neutral-600 leading-relaxed max-w-prose [text-wrap:pretty]">
                  {item.desc}
                </p>
              </div>

              <div className="pt-5 mt-6 border-t border-neutral-100 flex items-center justify-between text-[13px]">
                <span className="text-neutral-500 font-medium">Algorithmic Target:</span>
                <span className="font-mono font-bold text-neutral-900">
                  {item.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
