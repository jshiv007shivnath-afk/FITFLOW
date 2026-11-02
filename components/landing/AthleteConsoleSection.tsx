'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function AthleteConsoleSection() {
  const [activeTab, setActiveTab] = useState<'biometrics' | 'strength' | 'recovery'>('biometrics');
  const [selectedZone, setSelectedZone] = useState<number>(2);

  // Strength calculator state
  const [weight, setWeight] = useState<number>(100);
  const [reps, setReps] = useState<number>(5);

  // 1RM Calculation (Epley Formula)
  const oneRepMax = Math.round(weight * (1 + reps / 30));

  const zones = [
    {
      id: 1,
      name: 'Zone 1: Active Recovery',
      bpm: '105 - 120 BPM',
      fuel: '90% Fat / 10% Carbs',
      purpose: 'Flushes metabolic waste, promotes capillary blood flow, and accelerates cellular repair.',
      color: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 2,
      name: 'Zone 2: Aerobic Base',
      bpm: '121 - 138 BPM',
      fuel: '80% Fat / 20% Carbs',
      purpose: 'Maximizes mitochondrial biogenesis, lactate clearance capacity, and endurance stamina.',
      color: 'bg-blue-500',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      id: 3,
      name: 'Zone 3: Tempo / Aerobic Power',
      bpm: '139 - 155 BPM',
      fuel: '55% Fat / 45% Carbs',
      purpose: 'Develops steady-state marathon pacing and glycogen storage efficiency.',
      color: 'bg-amber-500',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      id: 4,
      name: 'Zone 4: Lactate Threshold',
      bpm: '156 - 172 BPM',
      fuel: '25% Fat / 75% Carbs',
      purpose: 'Pushes anaerobic threshold higher, conditioning muscle buffering against lactic fatigue.',
      color: 'bg-orange-500',
      badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
    },
    {
      id: 5,
      name: 'Zone 5: VO2 Max Ceiling',
      bpm: '173 - 190+ BPM',
      fuel: '5% Fat / 95% Carbs',
      purpose: 'Expands maximum cardiac stroke volume and neuromuscular explosive power in short bursts.',
      color: 'bg-rose-500',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    },
  ];

  const currentZone = zones.find((z) => z.id === selectedZone) || zones[1];

  return (
    <section className="w-full py-16 sm:py-24 bg-white border-t border-[#E7E2E8]" id="section-athlete-console">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[12px] font-bold text-[#6a527c] tracking-wider uppercase mb-3 px-3.5 py-1 rounded-full bg-[#f2ecf3]">
            The Daily Performance Matrix
          </span>
          <h2 className="font-['Manrope'] text-[30px] sm:text-[44px] font-bold text-[#1c1b1f] tracking-tight leading-[1.12] mb-4 [text-wrap:balance]">
            Sports science simplified into a fluid daily console
          </h2>
          <p className="text-[#57535A] text-[15px] sm:text-[17px] leading-relaxed max-w-2xl [text-wrap:pretty]">
            Eliminate guesswork. FitFlow automatically calculates your training volume, heart rate zones, and recovery readiness with zero algorithmic noise.
          </p>

          {/* Interactive Console Navigation Tabs */}
          <div className="inline-flex items-center bg-neutral-100/90 border border-neutral-200/80 p-1.5 rounded-full mt-8 gap-1 shadow-xs">
            {[
              { id: 'biometrics', label: 'Biometric Zones', icon: 'favorite' },
              { id: 'strength', label: '1RM & Overload Calculator', icon: 'fitness_center' },
              { id: 'recovery', label: 'Circadian Readiness', icon: 'bedtime' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Panels (Flattened Single-Level Architecture to prevent nested cards) */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'biometrics' && (
              <motion.div
                key="tab-biometrics"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left: Zone Selector Buttons */}
                <div className="lg:col-span-5 space-y-3">
                  <span className="text-[12px] font-bold tracking-wider uppercase text-neutral-500 mb-2 block">
                    Select Heart Rate Zone
                  </span>
                  {zones.map((zone) => {
                    const isSelected = zone.id === selectedZone;
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => setSelectedZone(zone.id)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                            : 'bg-white text-neutral-800 border-neutral-200/80 hover:bg-neutral-50 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3.5 h-3.5 rounded-full ${zone.color}`} />
                          <div>
                            <div className="text-[14px] font-bold">{zone.name}</div>
                            <div className={`text-[12px] font-mono ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                              {zone.bpm}
                            </div>
                          </div>
                        </div>
                        <span className={`text-[12px] font-semibold hidden sm:inline ${isSelected ? 'text-amber-400' : 'text-neutral-600'}`}>
                          {zone.fuel.split('/')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Zone Sports Science Breakdown */}
                <div className="lg:col-span-7 bg-[#FAF9FB] rounded-[28px] border border-[#E7E2E8] p-6 sm:p-8 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-neutral-200/80">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-[12px] font-bold border mb-2 ${currentZone.badgeBg}`}>
                        Target Band: {currentZone.bpm}
                      </span>
                      <h3 className="text-[24px] font-bold text-neutral-900 [text-wrap:balance]">{currentZone.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-[12px] font-bold uppercase tracking-wider text-neutral-500">Fuel Partition</div>
                      <div className="text-[15px] font-mono font-bold text-neutral-900">{currentZone.fuel}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[13px] font-bold text-neutral-800 block mb-1">Cardiovascular Adaptation</span>
                      <p className="text-[14px] text-neutral-600 leading-relaxed max-w-2xl [text-wrap:pretty]">{currentZone.purpose}</p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-[13px] font-semibold text-neutral-700">
                        <span>Metabolic Energy Breakdown</span>
                        <span>{selectedZone <= 2 ? 'Lipid Oxidation Dominant' : 'Carbohydrate Glycolysis'}</span>
                      </div>
                      <div className="w-full h-3 bg-neutral-200/80 rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-orange-500 transition-all duration-500"
                          style={{
                            width:
                              selectedZone === 1 ? '90%' : selectedZone === 2 ? '80%' : selectedZone === 3 ? '55%' : selectedZone === 4 ? '25%' : '5%',
                          }}
                        />
                        <div
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{
                            width:
                              selectedZone === 1 ? '10%' : selectedZone === 2 ? '20%' : selectedZone === 3 ? '45%' : selectedZone === 4 ? '75%' : '95%',
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[12px] font-mono text-neutral-600 pt-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Fat Oxidation
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Glycogen Burn
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200/80 flex flex-wrap items-center justify-between gap-2 text-[13px] text-neutral-600">
                    <span>Synchronizes with Apple Watch, Garmin, and Polar optical HR sensors</span>
                    <span className="font-semibold text-[#6a527c]">Karvonen Method</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'strength' && (
              <motion.div
                key="tab-strength"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left: Interactive Input Controls */}
                <div className="lg:col-span-5 bg-[#FAF9FB] rounded-[28px] border border-[#E7E2E8] p-6 sm:p-8 space-y-6">
                  <h3 className="text-[20px] font-bold text-neutral-900 [text-wrap:balance]">Compound Set Parameters</h3>

                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between items-center text-[14px] font-bold text-neutral-800 mb-2">
                        <span>Working Weight</span>
                        <span className="font-mono text-neutral-900 text-[16px]">{weight} kg</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="260"
                        step="2.5"
                        value={weight}
                        onChange={(e) => setWeight(parseFloat(e.target.value))}
                        className="w-full accent-[#ffbd5a] cursor-pointer"
                        aria-label="Working Weight in Kilograms"
                      />
                      <div className="flex justify-between text-[12px] text-neutral-500 font-mono mt-1">
                        <span>20 kg</span>
                        <span>140 kg</span>
                        <span>260 kg</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[14px] font-bold text-neutral-800 mb-2">
                        <span>Completed Repetitions</span>
                        <span className="font-mono text-neutral-900 text-[16px]">{reps} reps</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="15"
                        step="1"
                        value={reps}
                        onChange={(e) => setReps(parseInt(e.target.value, 10))}
                        className="w-full accent-[#ffbd5a] cursor-pointer"
                        aria-label="Completed Repetitions"
                      />
                      <div className="flex justify-between text-[12px] text-neutral-500 font-mono mt-1">
                        <span>1 rep</span>
                        <span>8 reps</span>
                        <span>15 reps</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[13px] text-neutral-600 leading-relaxed border-t border-neutral-200/80 pt-4 max-w-prose [text-wrap:pretty]">
                    Uses the validated Epley formula with velocity-decay compensation for barbell squats, bench press, and deadlifts.
                  </p>
                </div>

                {/* Right: Calculated Metrics Display (Clean unnested design) */}
                <div className="lg:col-span-7 bg-[#FAF9FB] rounded-[28px] border border-[#E7E2E8] p-6 sm:p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-neutral-200/80">
                    <div>
                      <div className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Estimated 1RM</div>
                      <div className="text-[30px] font-bold text-[#1c1b1f] font-mono mt-1">
                        {oneRepMax} <span className="text-[15px] font-normal text-neutral-500">kg</span>
                      </div>
                      <div className="text-[12px] text-emerald-700 font-medium mt-1">Peak Neuromuscular Output</div>
                    </div>

                    <div>
                      <div className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Rest Recommendation</div>
                      <div className="text-[30px] font-bold text-[#1c1b1f] font-mono mt-1">
                        {reps <= 4 ? '180' : reps <= 8 ? '120' : '90'} <span className="text-[15px] font-normal text-neutral-500">sec</span>
                      </div>
                      <div className="text-[12px] text-neutral-600 font-medium mt-1">ATP-CP Resynthesis Window</div>
                    </div>

                    <div>
                      <div className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Next Cycle Overload</div>
                      <div className="text-[30px] font-bold text-[#6a527c] font-mono mt-1">
                        +{reps >= 6 ? '2.5' : '1.25'} <span className="text-[15px] font-normal text-neutral-500">kg</span>
                      </div>
                      <div className="text-[12px] text-neutral-600 font-medium mt-1">Micro-Loading Benchmark</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-[14px] font-bold text-neutral-800">Training Intensity Percentages</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[13px] font-mono">
                      {[
                        { pct: '90%', kg: Math.round(oneRepMax * 0.9), label: 'Power (2-3 reps)' },
                        { pct: '80%', kg: Math.round(oneRepMax * 0.8), label: 'Strength (5-6 reps)' },
                        { pct: '70%', kg: Math.round(oneRepMax * 0.7), label: 'Hypertrophy (8-10 reps)' },
                        { pct: '60%', kg: Math.round(oneRepMax * 0.6), label: 'Endurance (12-15 reps)' },
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white border border-neutral-200/80">
                          <div className="text-neutral-500 text-[11px] uppercase font-bold">{item.pct}</div>
                          <div className="text-[16px] font-bold text-neutral-900 mt-0.5">{item.kg} kg</div>
                          <div className="text-[11px] text-neutral-500 mt-0.5 truncate">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'recovery' && (
              <motion.div
                key="tab-recovery"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Circadian Schedule Visualization */}
                <div className="lg:col-span-6 bg-[#FAF9FB] rounded-[28px] border border-[#E7E2E8] p-6 sm:p-8 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-neutral-200/80">
                    <div>
                      <div className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Hydration Pacing Curve</div>
                      <h3 className="text-[20px] font-bold text-neutral-900 mt-0.5 [text-wrap:balance]">3.2L Daily Fluid Target</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[12px] font-bold border border-blue-200">
                      Circadian Timed
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {[
                      { time: '07:30 AM (Wake)', amount: '600 ml', note: 'Rehydration and Electrolytes', pct: '20%' },
                      { time: '11:00 AM (Pre-Workout)', amount: '500 ml', note: 'Cellular Hydration Buffer', pct: '35%' },
                      { time: '01:30 PM (Post-Workout)', amount: '800 ml', note: 'Sweat Rate Replacement', pct: '60%' },
                      { time: '05:00 PM (Mid-Afternoon)', amount: '700 ml', note: 'Metabolic Balance', pct: '82%' },
                      { time: '08:30 PM (Evening Taper)', amount: '600 ml', note: 'Hydration Taper for Deep Sleep', pct: '100%' },
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200/80 text-[13px]">
                        <div>
                          <div className="font-bold text-neutral-900">{step.time}</div>
                          <div className="text-neutral-500 text-[12px]">{step.note}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-blue-700">{step.amount}</div>
                          <div className="text-[11px] text-neutral-500 font-mono">{step.pct} Total</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Autonomic Recovery Metric */}
                <div className="lg:col-span-6 bg-[#FAF9FB] rounded-[28px] border border-[#E7E2E8] p-6 sm:p-8 space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-neutral-200/80">
                    <div>
                      <div className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">HRV and Autonomic Readiness</div>
                      <h3 className="text-[20px] font-bold text-neutral-900 mt-0.5 [text-wrap:balance]">Parasympathetic Recovery Score</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[12px] font-bold border border-emerald-200">
                      Optimal (Green)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-neutral-200/80 text-center">
                      <div className="text-[12px] font-bold text-neutral-500 uppercase">Resting Heart Rate</div>
                      <div className="text-[32px] font-bold text-neutral-900 font-mono mt-1">48 <span className="text-[15px] font-normal text-neutral-500">BPM</span></div>
                      <div className="text-[12px] text-emerald-700 font-medium mt-1">4 BPM below baseline</div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-neutral-200/80 text-center">
                      <div className="text-[12px] font-bold text-neutral-500 uppercase">rMSSD Heart Rate Variability</div>
                      <div className="text-[32px] font-bold text-neutral-900 font-mono mt-1">82 <span className="text-[15px] font-normal text-neutral-500">ms</span></div>
                      <div className="text-[12px] text-emerald-700 font-medium mt-1">High Parasympathetic Tone</div>
                    </div>
                  </div>

                  <p className="text-[14px] text-neutral-700 leading-relaxed border-t border-neutral-200/80 pt-4 max-w-prose [text-wrap:pretty]">
                    <strong>Daily Training Recommendation:</strong> Central nervous system recovery is at 94%. You are cleared for maximal intensity intervals, heavy multi-joint lifts, or high-volume endurance blocks today.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
