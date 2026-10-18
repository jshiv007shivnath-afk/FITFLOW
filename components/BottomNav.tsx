'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useFitFlow, TabType } from '@/context/FitFlowContext';
import { Home, Calendar2, ChartBar, User } from 'reicon-react';

export function BottomNav() {
  const { activeTab, setActiveTab } = useFitFlow();

  const navItems: { value: TabType; label: string; icon: React.ReactNode }[] = [
    {
      value: 'home',
      label: 'Home',
      icon: <Home size={18} />,
    },
    {
      value: 'planner',
      label: 'Planner',
      icon: <Calendar2 size={18} />,
    },
    {
      value: 'progress',
      label: 'Progress',
      icon: <ChartBar size={18} />,
    },
    {
      value: 'profile',
      label: 'Profile',
      icon: <User size={18} />,
    },
  ];

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-[390px] flex justify-center pointer-events-auto">
      <nav
        aria-label="FitFlow Health Navigation"
        className="apple-liquid-glass rounded-full p-1.5 flex items-center justify-between gap-0.5 w-full"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.value;

          return (
            <motion.button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              type="button"
              aria-label={item.label}
              whileTap={{ scale: 0.91, transition: { type: 'spring', stiffness: 500, damping: 25 } }}
              whileHover={{ scale: 1.04 }}
              className={`relative flex items-center justify-center h-10 rounded-full transition-colors duration-200 outline-none select-none cursor-pointer ${
                isActive
                  ? 'px-3.5 text-[#111312] font-bold text-[12.5px]'
                  : 'w-9 text-white/70 hover:text-white hover:bg-white/5 text-xs'
              }`}
            >
              {/* Apple Liquid Glass Active Pill with Spring Animation */}
              {isActive && (
                <motion.div
                  layoutId="liquidActivePill"
                  transition={{
                    type: 'spring',
                    stiffness: 520,
                    damping: 34,
                  }}
                  className="absolute inset-0 apple-liquid-glass-active-pill rounded-full z-0"
                />
              )}

              {/* Icon */}
              <span className="relative z-10 flex items-center justify-center shrink-0">
                {item.icon}
              </span>

              {/* Text Label (Only visible on active item) */}
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.15 }}
                  className="relative z-10 tracking-tight font-bold ml-1.5 whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
