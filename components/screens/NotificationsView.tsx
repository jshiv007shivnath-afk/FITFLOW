'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
import { useFitFlow, AppNotification } from '@/context/FitFlowContext';
import {
  ArrowLeft,
  DocumentText,
  Star,
  CheckCircle,
  Drop,
  Flame,
  Activity,
  Trash,
} from 'reicon-react';
import HoldButton from '@/components/HoldButton';

export function NotificationsView() {
  const {
    notifications,
    unreadNotificationCount,
    setShowNotifications,
    clearAllNotifications,
  } = useFitFlow();

  const getNotificationIcon = (iconType: AppNotification['iconType']) => {
    switch (iconType) {
      case 'water':
        return <Drop size={20} className="text-[#42BFEF]" />;
      case 'workout':
        return <Flame size={20} className="text-[#FF9D42]" />;
      case 'order':
        return <Activity size={20} className="text-[#1E88E5]" />;
      case 'payment':
        return <DocumentText size={20} className="text-[#456800]" />;
      case 'promo':
        return <Star size={20} className="text-[#FFB800]" />;
      case 'goal':
      default:
        return <CheckCircle size={20} className="text-[#43D69C]" />;
    }
  };

  const getIconBg = (iconType: AppNotification['iconType']) => {
    switch (iconType) {
      case 'water':
        return 'bg-[#E4F7FE]';
      case 'workout':
        return 'bg-[#FFF0DF]';
      case 'payment':
        return 'bg-[#E5FBC5]';
      case 'promo':
        return 'bg-[#FFF9E6]';
      case 'order':
      default:
        return 'bg-[#E8F3FF]';
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.02,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 440,
        damping: 32,
      },
    },
  };

  const isAllEmpty = notifications.length === 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col w-full min-h-full pb-28 px-5 pt-4 bg-[#F8F8F6] text-[#111312]"
    >
      {/* 1. Top Navigation Bar */}
      <motion.div variants={itemVariants} className="flex items-center justify-between pb-3 mb-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setShowNotifications(false)}
          className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#ECECE9] flex items-center justify-center text-[#111312] hover:bg-[#F4F5F2] transition"
          type="button"
          aria-label="Back to App"
        >
          <ArrowLeft size={18} />
        </motion.button>

        <div className="flex items-center gap-2">
          <h1 className="text-[18px] font-bold text-[#111312] tracking-tight">Notifications</h1>
          {unreadNotificationCount > 0 && !isAllEmpty && (
            <span className="px-2 py-0.5 rounded-full bg-[#FF626C] text-white text-xs font-extrabold shadow-xs">
              {unreadNotificationCount}
            </span>
          )}
        </div>

        <div className="w-10 h-10" />
      </motion.div>

      {/* Empty State when all notifications are cleared */}
      {isAllEmpty ? (
        <motion.div
          variants={itemVariants}
          className="w-full bg-white rounded-2xl p-8 my-6 shadow-xs border border-[#ECECE9] flex flex-col items-center justify-center text-center gap-2"
        >
          <div className="w-12 h-12 rounded-full bg-[#E5FBC5] text-[#15803D] flex items-center justify-center mb-1">
            <CheckCircle size={24} />
          </div>
          <h2 className="text-base font-bold text-[#111312]">All Caught Up</h2>
          <p className="text-xs text-[#525650] max-w-xs leading-relaxed">
            No notifications to display. All your messages and activity alerts have been deleted.
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col space-y-3">
          <h2 className="text-xs font-bold text-[#525650]">Recent updates</h2>

          {notifications.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#ECECE9] transition-all"
            >
              <div className="flex items-start gap-3.5">
                {/* Rounded Icon Badge */}
                <div
                  className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-xs ${getIconBg(
                    item.iconType
                  )}`}
                >
                  {getNotificationIcon(item.iconType)}
                </div>

                {/* Text & Timing */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-sm font-bold text-[#111312] truncate">{item.title}</h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.unread && (
                        <span className="px-1.5 py-0.5 rounded bg-[#FF626C]/10 text-[#FF626C] text-xs font-bold">
                          NEW
                        </span>
                      )}
                      <span className="text-xs text-[#525650] font-medium">{item.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#525650] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 4. Delete / Clear All Notifications (React Bits HoldButton) */}
      <motion.div
        variants={itemVariants}
        className="mt-8 mb-4 flex flex-col items-center justify-center gap-2 pt-4 border-t border-[#ECECE9]"
      >
        <HoldButton
          doneLabel="Deleted"
          icon={<Trash size={15} />}
          doneIcon={<CheckCircle size={15} />}
          backgroundColor="#27272a"
          fillColor="#EF4444"
          textColor="#f5f5f5"
          fillTextColor="#ffffff"
          size="md"
          radius={14}
          fillDirection="right"
          holdTime={2000}
          releaseTime={200}
          pressScale={0.97}
          wave
          waveAmplitude={6}
          glow
          resetAfter={1200}
          disabled={isAllEmpty}
          onHold={() => {
            clearAllNotifications();
          }}
        >
          Hold to delete
        </HoldButton>
        <p className="text-xs text-[#525650] font-medium text-center">
          {isAllEmpty
            ? 'No notifications to delete'
            : 'Press and hold for 2 seconds to delete all notifications'}
        </p>
      </motion.div>
    </motion.div>
  );
}
