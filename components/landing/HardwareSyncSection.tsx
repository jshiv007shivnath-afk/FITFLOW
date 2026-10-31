'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

export function HardwareSyncSection() {
  const [activeDevice, setActiveDevice] = useState<string>('apple-watch');
  const [isPinging, setIsPinging] = useState<boolean>(false);

  const devices = [
    {
      id: 'apple-watch',
      name: 'Apple Watch',
      model: 'Series 9 & Ultra 2',
      protocol: 'Apple HealthKit Dual-Engine Sync',
      latency: '0.18s Sync P95',
      rate: '1Hz Continuous Optical HR',
      batteryImpact: '< 1.8% per 60min Session',
      status: 'Connected (BLE 5.3)',
      icon: 'watch',
    },
    {
      id: 'garmin',
      name: 'Garmin Ecosystem',
      model: 'Forerunner & Fenix Series',
      protocol: 'Direct Garmin Connect API + FIT Export',
      latency: '0.24s Direct Stream',
      rate: 'HRV Stress + Running Dynamics',
      batteryImpact: 'Negligible (Native Applet)',
      status: 'Paired & Verified',
      icon: 'timer',
    },
    {
      id: 'whoop',
      name: 'Whoop 4.0',
      model: 'Biometric Strap',
      protocol: 'Continuous Strain & Sleep Ingestion',
      latency: 'Instant Webhook Push',
      rate: 'Autonomic HRV Recovery Stream',
      batteryImpact: 'Zero Device Overhead',
      status: 'Continuous Sync',
      icon: 'vital_signs',
    },
    {
      id: 'polar',
      name: 'Polar H10 & Verity',
      model: 'ECG Chest & Optical Armband',
      protocol: 'ECG Gold-Standard Electrode Sync',
      latency: '0.08s Sub-Second Telemetry',
      rate: 'Millisecond R-R Interval Precision',
      batteryImpact: 'Extended BLE Broadcast',
      status: 'High-Precision Mode',
      icon: 'ecg_heart',
    },
  ];

  const current = devices.find((d) => d.id === activeDevice) || devices[0];

  const handlePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
    }, 1200);
  };

  return (
    <section className="w-full py-16 sm:py-24 bg-white border-t border-[#E7E2E8]" id="section-hardware-sync">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[12px] font-bold text-[#6a527c] tracking-wider uppercase mb-3 px-3.5 py-1 rounded-full bg-[#f2ecf3]">
            Hardware & Biometric Ingestion
          </span>
          <h2 className="font-['Manrope'] text-[30px] sm:text-[44px] font-bold text-[#1c1b1f] tracking-tight leading-[1.12] mb-4">
            Connects to the sensors you already trust
          </h2>
          <p className="text-[#57535A] text-[15px] sm:text-[17px] leading-relaxed">
            No proprietary dongles or locked silos. FitFlow ingests high-frequency metrics directly from Apple Watch, Garmin, Whoop, and Polar optical sensors.
          </p>
        </div>

        {/* Device Selection Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-8">
          {devices.map((device) => {
            const isSelected = device.id === activeDevice;
            return (
              <button
                key={device.id}
                type="button"
                onClick={() => setActiveDevice(device.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-1 ring-neutral-900'
                    : 'bg-white text-neutral-800 border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`material-symbols-outlined text-[24px] ${isSelected ? 'text-amber-400' : 'text-[#6a527c]'}`}>
                    {device.icon}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                </div>
                <div>
                  <div className="text-[14px] font-bold">{device.name}</div>
                  <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {device.model}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Device Telemetry Card (Unnested Single-Level Architecture) */}
        <div className="max-w-4xl mx-auto bg-white rounded-[28px] border border-[#E7E2E8] p-6 sm:p-10 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-200/80">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  {current.status}
                </span>
                <span className="text-[12px] text-neutral-500 font-mono">Channel: BLE 5.3 Active</span>
              </div>
              <h3 className="text-[22px] font-bold text-neutral-900 [text-wrap:balance]">{current.name}</h3>
              <p className="text-[14px] text-neutral-600 mt-0.5">{current.protocol}</p>
            </div>

            <button
              type="button"
              onClick={handlePing}
              disabled={isPinging}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm text-[13px] font-semibold transition-all cursor-pointer disabled:opacity-60"
            >
              <span className={`material-symbols-outlined text-[16px] text-amber-400 ${isPinging ? 'animate-spin' : ''}`}>
                cached
              </span>
              <span>{isPinging ? 'Syncing Telemetry...' : 'Test Sensor Ping'}</span>
            </button>
          </div>

          {/* Telemetry Metrics Grid (Clean Divided Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-neutral-200/80">
            <div className="space-y-1">
              <div className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Sync Latency</div>
              <div className="text-[22px] font-bold text-neutral-900 font-mono mt-1">{current.latency}</div>
              <div className="text-[12px] text-neutral-500">Local Bluetooth Transport</div>
            </div>

            <div className="space-y-1">
              <div className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Sampling Frequency</div>
              <div className="text-[22px] font-bold text-neutral-900 font-mono mt-1">{current.rate}</div>
              <div className="text-[12px] text-neutral-500">High-Precision Ingestion</div>
            </div>

            <div className="space-y-1">
              <div className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Battery Overhead</div>
              <div className="text-[22px] font-bold text-neutral-900 font-mono mt-1">{current.batteryImpact}</div>
              <div className="text-[12px] text-neutral-500">Optimized Background Daemons</div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-700">lock</span>
              <span>End-to-end encrypted on-device. Zero biometric telemetry sold to advertisers.</span>
            </div>
            <span className="font-mono text-neutral-500">Local-First Storage • SQLite Native</span>
          </div>
        </div>
      </div>
    </section>
  );
}
