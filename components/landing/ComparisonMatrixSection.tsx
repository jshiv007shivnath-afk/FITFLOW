'use client';

import React from 'react';

export function ComparisonMatrixSection() {
  const rows = [
    {
      feature: 'Biometric Heart Rate Sync',
      fitflow: 'Live 1Hz optical telemetry (BLE 5.3)',
      genericApps: 'Delayed post-workout upload only',
      spreadsheets: 'None (manual entry)',
    },
    {
      feature: 'Rest Interval Timers',
      fitflow: 'Dynamic slope-based recovery cue',
      genericApps: 'Rigid 60-second static beep',
      spreadsheets: 'Requires manual phone stopwatch',
    },
    {
      feature: 'Offline Gym Floor Resilience',
      fitflow: '100% Local-first SQLite database',
      genericApps: 'Errors or spins on poor gym Wi-Fi',
      spreadsheets: 'Clumsy touch input on mobile',
    },
    {
      feature: 'Progressive Overload Tracking',
      fitflow: 'Automated tonnage & RIR fatigue math',
      genericApps: 'Locked behind $14.99/mo subscription',
      spreadsheets: 'Complex cell formulas required',
    },
    {
      feature: 'Injury Risk Monitoring',
      fitflow: 'Acute:Chronic Workload Ratio (ACWR)',
      genericApps: 'No volume spike detection',
      spreadsheets: 'Manual calculation only',
    },
    {
      feature: 'Data Privacy & Export',
      fitflow: 'Export to .FIT, CSV & Apple Health',
      genericApps: 'Telemetry sold to advertiser networks',
      spreadsheets: 'Raw data owned by user',
    },
  ];

  return (
    <section className="w-full py-16 sm:py-24 bg-[#FCFBFD] border-t border-[#E7E2E8]" id="section-comparison">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[12px] font-bold text-[#6a527c] tracking-wider uppercase mb-3 px-3.5 py-1 rounded-full bg-[#f2ecf3]">
            System Comparison
          </span>
          <h2 className="font-['Manrope'] text-[30px] sm:text-[44px] font-bold text-[#1c1b1f] tracking-tight leading-[1.12] mb-4">
            Designed for training, not attention farming
          </h2>
          <p className="text-[#57535A] text-[15px] sm:text-[17px] leading-relaxed">
            Most fitness apps are designed by ad agencies to maximize daily screen time. FitFlow is designed to get you off your phone and focused on the barbell.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="max-w-5xl mx-auto bg-white rounded-[28px] border border-[#E7E2E8] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[#E7E2E8] bg-[#FAF9FB]">
                  <th className="py-4 px-6 text-[13px] font-bold text-neutral-500 uppercase tracking-wider w-[28%]">
                    Capability
                  </th>
                  <th className="py-4 px-6 text-[14px] font-bold text-neutral-900 bg-amber-50/50 border-x border-[#E7E2E8] w-[36%]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>FitFlow Workspace</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-[13px] font-semibold text-neutral-500 w-[18%]">
                    Generic Apps
                  </th>
                  <th className="py-4 px-6 text-[13px] font-semibold text-neutral-500 w-[18%]">
                    Spreadsheets
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2E8] text-[13px]">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-neutral-900">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 font-medium text-neutral-900 bg-amber-50/30 border-x border-[#E7E2E8]">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 font-bold">✓</span>
                        <span>{row.fitflow}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-neutral-500">
                      {row.genericApps}
                    </td>
                    <td className="py-4 px-6 text-neutral-500">
                      {row.spreadsheets}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
