'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
import { useFitFlow } from '@/context/FitFlowContext';
import {
  User,
  Setting2,
  Notification,
  DocumentText,
  Message,
  Star,
  ShieldTick,
  Refresh,
  ArrowLeft,
  ArrowRight2,
  Activity,
  Flame,
  CupStar,
  Plus,
  CheckCircle,
} from 'reicon-react';

export function ProfileView() {
  const {
    user,
    goals,
    updateGoals,
    updateUserAvatar,
    setActiveTab,
    setShowLogin,
    setShowNotifications,
    setShowPrivacyPolicy,
    setShowTerms,
    setShowHelpCenter,
    setShowDisclaimer,
    setShowAccessibilityStatement,
    resetToDefaults,
    logoutUser,
    unreadNotificationCount,
    showToast,
  } = useFitFlow();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file');
        e.target.value = '';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast('Image file must be under 10MB');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_DIM = 160;
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > MAX_DIM) {
                height = Math.round((height * MAX_DIM) / width);
                width = MAX_DIM;
              }
            } else {
              if (height > MAX_DIM) {
                width = Math.round((width * MAX_DIM) / height);
                height = MAX_DIM;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressed = canvas.toDataURL('image/jpeg', 0.8);
              updateUserAvatar(compressed);
            } else {
              showToast('Could not process image avatar');
            }
          };
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [calTarget, setCalTarget] = useState(goals.calorieTarget.toString());
  const [waterTarget, setWaterTarget] = useState(goals.waterTargetMl.toString());
  const [weightKg, setWeightKg] = useState(goals.weightKg.toString());

  useEffect(() => {
    setCalTarget(goals.calorieTarget.toString());
    setWaterTarget(goals.waterTargetMl.toString());
    setWeightKg(goals.weightKg.toString());
  }, [goals.calorieTarget, goals.waterTargetMl, goals.weightKg]);

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCal = parseInt(calTarget, 10);
    const parsedWater = parseInt(waterTarget, 10);
    const parsedWeight = parseFloat(weightKg);
    updateGoals({
      calorieTarget: isNaN(parsedCal) ? 650 : Math.max(100, Math.min(10000, parsedCal)),
      waterTargetMl: isNaN(parsedWater) ? 2500 : Math.max(500, Math.min(10000, parsedWater)),
      weightKg: isNaN(parsedWeight) ? 68.5 : Math.max(20, Math.min(300, parsedWeight)),
    });
    showToast('Health targets saved successfully!');
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
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
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col w-full min-h-full pb-28 px-5 pt-4 bg-[#FFFFFF] text-[#111111]"
    >
      {/* 1. Top Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between pb-3 mb-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setActiveTab('home')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#111111] hover:bg-[#F4F4F4] transition"
          type="button"
          aria-label="Back to Home"
        >
          <ArrowLeft size={20} />
        </motion.button>

        <h1 className="text-[19px] font-bold text-[#111111] tracking-tight">Profile &amp; Account</h1>

        <div className="w-10 h-10" />
      </motion.div>

      {/* 2. User Info Card with tactile Plus button from reicon */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 py-3 mb-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative shrink-0 w-[74px] h-[74px] group cursor-pointer"
        >
          {user.avatar ? (
            <img
              className="w-full h-full rounded-full object-cover shadow-sm ring-2 ring-black/10 group-hover:opacity-90 transition-opacity"
              src={user.avatar}
              alt={user.name || 'User'}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-[#111312] text-[#B8F45A] font-extrabold text-2xl flex items-center justify-center shadow-sm ring-2 ring-black/10 select-none">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          {/* Plus icon from reicon-react */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#111312] text-[#B8F45A] border-2 border-white flex items-center justify-center shadow-md hover:bg-black hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Upload profile photo"
            aria-label="Upload profile photo"
          >
            <Plus size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <h2 className="text-[20px] font-bold text-[#111111] leading-snug truncate">
            {user.name || 'Athlete'}
          </h2>
          <p className="text-[13px] text-[#767676] truncate">
            {user.email || 'No email registered (Local session)'}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-[#527800] font-semibold text-left mt-0.5 hover:underline flex items-center gap-1"
          >
            {user.avatar ? 'Change photo' : 'Upload your photo'}
          </button>
        </div>
      </motion.div>

      {/* 4. Expandable Goals & Biometrics drawer */}
      <AnimatePresence>
        {showProfileDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden bg-[#F7F7F6] rounded-2xl p-5 mb-4 border border-[#ECECE9]"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#111111]">Health targets</span>
              <span className="text-xs text-[#456800] font-bold bg-[#E5FBC5] px-2.5 py-0.5 rounded-full">
                Saved &amp; Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-3.5">
              <div className="bg-white p-3 rounded-2xl text-center border border-[#E8EAE5] shadow-xs">
                <span className="text-xs text-[#525650] block font-medium">Calories</span>
                <span className="text-base font-bold text-[#111111]">{goals.calorieTarget}</span>
              </div>
              <div className="bg-white p-3 rounded-2xl text-center border border-[#E8EAE5] shadow-xs">
                <span className="text-xs text-[#525650] block font-medium">Water (ml)</span>
                <span className="text-base font-bold text-[#111111]">{goals.waterTargetMl}</span>
              </div>
              <div className="bg-white p-3 rounded-2xl text-center border border-[#E8EAE5] shadow-xs">
                <span className="text-xs text-[#525650] block font-medium">Weight (kg)</span>
                <span className="text-base font-bold text-[#111111]">{goals.weightKg}</span>
              </div>
            </div>

            <form onSubmit={handleSaveGoals} className="flex gap-2">
              <input
                type="number"
                placeholder="Cal"
                aria-label="Daily Calorie Target (kcal)"
                value={calTarget}
                onChange={(e) => setCalTarget(e.target.value)}
                className="w-1/3 px-3 py-2 text-xs font-medium bg-white rounded-xl border border-[#E8EAE5] outline-none"
              />
              <input
                type="number"
                placeholder="Water"
                aria-label="Daily Water Target (ml)"
                value={waterTarget}
                onChange={(e) => setWaterTarget(e.target.value)}
                className="w-1/3 px-3 py-2 text-xs font-medium bg-white rounded-xl border border-[#E8EAE5] outline-none"
              />
              <button
                type="submit"
                className="w-1/3 py-2 bg-[#111111] text-white text-xs font-bold rounded-xl hover:bg-black transition active:scale-95"
              >
                Update
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>



      {/* 6. Menu Items List */}
      <div className="flex flex-col space-y-1">
        <h2 className="text-xs font-bold text-[#525650] mb-1">Preferences &amp; support</h2>

        {/* 1. My Profile Targets */}
        <motion.button
          variants={itemVariants}
          whileHover={{ x: 2, backgroundColor: '#FAFBFD' }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setShowProfileDetails(!showProfileDetails)}
          className="w-full flex items-center justify-between py-3.5 px-2 rounded-2xl text-left transition-colors"
          type="button"
        >
          <div className="flex items-center gap-4">
            <User size={22} className="text-[#333333]" />
            <span className="text-[15px] font-semibold text-[#111111]">My Health Objectives</span>
          </div>
          <ArrowRight2 size={18} className="text-[#B0B3BA]" />
        </motion.button>

        {/* 2. Notifications with dynamic badge */}
        <motion.button
          variants={itemVariants}
          whileHover={{ x: 2, backgroundColor: '#FAFBFD' }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setShowNotifications(true)}
          className="w-full flex items-center justify-between py-3.5 px-2 rounded-2xl text-left transition-colors"
          type="button"
        >
          <div className="flex items-center gap-4">
            <Notification size={22} className="text-[#333333]" />
            <span className="text-[15px] font-semibold text-[#111111]">Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            {unreadNotificationCount > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#FF626C] text-white text-xs font-extrabold flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
            <ArrowRight2 size={18} className="text-[#B0B3BA]" />
          </div>
        </motion.button>

        {/* 3. Settings */}
        <motion.button
          variants={itemVariants}
          whileHover={{ x: 2, backgroundColor: '#FAFBFD' }}
          whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 500, damping: 25 } }}
          onClick={() => setActiveTab('progress')}
          className="w-full flex items-center justify-between py-3.5 px-2 rounded-2xl text-left transition-colors"
          type="button"
        >
          <div className="flex items-center gap-4">
            <Setting2 size={22} className="text-[#333333]" />
            <span className="text-[15px] font-semibold text-[#111111]">Settings &amp; Units</span>
          </div>
          <ArrowRight2 size={18} className="text-[#B0B3BA]" />
        </motion.button>



        {/* Admin Command Center */}
        <Link
          href="/admin"
          className="w-full flex items-center justify-between py-3.5 px-3 rounded-2xl bg-[#B8F45A]/15 border border-[#B8F45A]/40 text-left transition-colors hover:bg-[#B8F45A]/25 cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-4">
            <ShieldTick size={22} className="text-[#111111]" />
            <div>
              <span className="text-[15px] font-bold text-[#111111] flex items-center gap-1.5">
                Admin Command Center
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B8F45A] text-black">
                  Live
                </span>
              </span>
              <span className="text-xs text-neutral-600 block">Monitor athletes, metrics & export CSV</span>
            </div>
          </div>
          <ArrowRight2 size={18} className="text-[#111111]" />
        </Link>

        {/* 5. FAQ */}
        <motion.button
          variants={itemVariants}
          whileHover={{ x: 2, backgroundColor: '#FAFBFD' }}
          whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 500, damping: 25 } }}
          onClick={() => setShowHelpCenter(true)}
          className="w-full flex items-center justify-between py-3.5 px-2 rounded-2xl text-left transition-colors"
          type="button"
        >
          <div className="flex items-center gap-4">
            <Message size={22} className="text-[#333333]" />
            <span className="text-[15px] font-semibold text-[#111111]">FAQ &amp; Knowledge Base</span>
          </div>
          <ArrowRight2 size={18} className="text-[#B0B3BA]" />
        </motion.button>



        {/* 7. Privacy Policy */}
        <motion.button
          variants={itemVariants}
          whileHover={{ x: 2, backgroundColor: '#FAFBFD' }}
          whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 500, damping: 25 } }}
          onClick={() => setShowPrivacyPolicy(true)}
          className="w-full flex items-center justify-between py-3.5 px-2 rounded-2xl text-left transition-colors"
          type="button"
        >
          <div className="flex items-center gap-4">
            <ShieldTick size={22} className="text-[#333333]" />
            <span className="text-[15px] font-semibold text-[#111111]">Privacy Policy</span>
          </div>
          <ArrowRight2 size={18} className="text-[#B0B3BA]" />
        </motion.button>

        {/* 8. Terms & Conditions */}
        <motion.button
          variants={itemVariants}
          whileHover={{ x: 2, backgroundColor: '#FAFBFD' }}
          whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 500, damping: 25 } }}
          onClick={() => setShowTerms(true)}
          className="w-full flex items-center justify-between py-3.5 px-2 rounded-2xl text-left transition-colors cursor-pointer"
          type="button"
        >
          <div className="flex items-center gap-4">
            <DocumentText size={22} className="text-[#333333]" />
            <span className="text-[15px] font-semibold text-[#111111]">Terms &amp; Conditions</span>
          </div>
          <ArrowRight2 size={18} className="text-[#B0B3BA]" />
        </motion.button>

        {/* 9. Medical & Health Disclaimer */}
        <motion.button
          variants={itemVariants}
          whileHover={{ x: 2, backgroundColor: '#FAFBFD' }}
          whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 500, damping: 25 } }}
          onClick={() => setShowDisclaimer(true)}
          className="w-full flex items-center justify-between py-3.5 px-2 rounded-2xl text-left transition-colors cursor-pointer"
          type="button"
        >
          <div className="flex items-center gap-4">
            <Activity size={22} className="text-[#333333]" />
            <span className="text-[15px] font-semibold text-[#111111]">Medical &amp; Health Disclaimer</span>
          </div>
          <ArrowRight2 size={18} className="text-[#B0B3BA]" />
        </motion.button>

        {/* 10. Accessibility Statement */}
        <motion.button
          variants={itemVariants}
          whileHover={{ x: 2, backgroundColor: '#FAFBFD' }}
          whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 500, damping: 25 } }}
          onClick={() => setShowAccessibilityStatement(true)}
          className="w-full flex items-center justify-between py-3.5 px-2 rounded-2xl text-left transition-colors cursor-pointer"
          type="button"
        >
          <div className="flex items-center gap-4">
            <CheckCircle size={22} className="text-[#333333]" />
            <span className="text-[15px] font-semibold text-[#111111]">Accessibility Statement</span>
          </div>
          <ArrowRight2 size={18} className="text-[#B0B3BA]" />
        </motion.button>

        {/* 9. Reset Demo Data */}
        <motion.button
          variants={itemVariants}
          whileHover={{ x: 2, backgroundColor: '#FFF5F5' }}
          whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 500, damping: 25 } }}
          onClick={resetToDefaults}
          className="w-full flex items-center justify-between py-3.5 px-2 rounded-2xl text-left transition-colors text-[#BA1A1A]"
          type="button"
        >
          <div className="flex items-center gap-4">
            <Refresh size={22} />
            <span className="text-[15px] font-semibold">Reset App Data</span>
          </div>
          <Refresh size={16} />
        </motion.button>

        {/* 10. Logout */}
        <motion.button
          variants={itemVariants}
          whileHover={{ x: 2, backgroundColor: '#FAFBFD' }}
          whileTap={{ scale: 0.99 }}
          onClick={() => logoutUser()}
          className="w-full flex items-center justify-between pt-4 pb-3 px-2 rounded-2xl text-left transition-colors"
          type="button"
        >
          <div className="flex items-center gap-4">
            <ArrowLeft size={22} className="text-[#333333]" />
            <span className="text-[15px] font-semibold text-[#111111]">Logout</span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}
