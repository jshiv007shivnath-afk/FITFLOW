'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { useFitFlow } from '@/context/FitFlowContext';
import {
  Calendar,
  Notification,
  Flame,
  Drop,
  CupStar,
  CheckCircle,
  Activity,
  ArrowRight2,
  Clock,
  User,
  ChartBar,
} from 'reicon-react';

export function HomeDashboard() {
  const {
    user,
    today,
    goals,
    addWater,
    logMeal,
    setActiveTab,
    setShowNotifications,
    unreadNotificationCount,
    showToast,
    weekInfo,
    weeklyPlan,
    todayKey,
    toggleDayCompletion,
  } = useFitFlow();

  const todayPlan = weeklyPlan?.days.find(d => d.dayKey === todayKey);
  const isTodayPlanWorkout = Boolean(
    todayPlan && !todayPlan.isRestDay && todayPlan.workoutTitle && todayPlan.workoutTitle !== 'Rest Day'
  );
  const hasUncompletedPlanToday = isTodayPlanWorkout && !todayPlan?.completed;

  const todayDayNumber = weekInfo.days.find(d => d.isToday)?.dayNumber || weekInfo.days[0].dayNumber;
  const [selectedDay, setSelectedDay] = useState(todayDayNumber);

  useEffect(() => {
    if (todayDayNumber) {
      setSelectedDay(todayDayNumber);
    }
  }, [todayDayNumber]);

  const safeWaterTarget = (goals.waterTargetMl && goals.waterTargetMl > 0) ? goals.waterTargetMl : 2500;
  const safeCalorieTarget = (goals.calorieTarget && goals.calorieTarget > 0) ? goals.calorieTarget : 650;
  const safeStepGoal = 10000;

  const waterGlasses = Math.max(0, Math.round(today.waterIntakeMl / 250));
  const targetGlasses = Math.max(1, Math.round(safeWaterTarget / 250));
  const waterPercent = Math.max(0, Math.min(100, Math.round((today.waterIntakeMl / safeWaterTarget) * 100)));
  const caloriePercent = Math.max(0, Math.min(100, Math.round((today.caloriesBurned / safeCalorieTarget) * 100)));
  const stepsWalked = Math.max(0, today.steps ?? 0);
  const stepPercent = Math.max(0, Math.min(100, Math.round((stepsWalked / safeStepGoal) * 100)));

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
      className="flex flex-col w-full pb-28 px-5 pt-4 bg-[#F8F8F6] text-[#111312]"
    >
      {/* 1. Header (Original clean layout: Avatar with NO dot, greeting, calendar, notification bell with dynamic badge) */}
      <motion.div variants={itemVariants} className="flex items-center justify-between pb-3 mb-2">
        <div className="flex items-center gap-3">
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('profile')}
            className="relative cursor-pointer select-none"
          >
            {/* Clean avatar with dynamic user upload support or clean initial */}
            {user.avatar ? (
              <img
                alt={user.name || 'User'}
                className="w-11 h-11 rounded-full object-cover shadow-xs ring-2 ring-white"
                src={user.avatar}
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#111312] text-[#B8F45A] font-extrabold text-sm flex items-center justify-center shadow-xs ring-2 ring-white select-none">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-[19px] text-[#111312] font-bold tracking-tight leading-tight">
              {user.name || 'Athlete'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setActiveTab('progress')}
            aria-label="Calendar view"
            className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#ECECE9] flex items-center justify-center text-[#111312] hover:bg-[#F4F5F2] transition"
            type="button"
          >
            <Calendar size={18} />
          </motion.button>

          {/* Notification Button with exact dynamic count badge */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowNotifications(true)}
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-full bg-white shadow-xs border border-[#ECECE9] flex items-center justify-center text-[#111312] hover:bg-[#F4F5F2] transition"
            type="button"
          >
            <Notification size={18} />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#E11D48] text-white rounded-full text-xs font-extrabold flex items-center justify-center ring-2 ring-white shadow-xs">
                {unreadNotificationCount}
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* 2. Original Weekly Progress Hero Card (Exact Match to User Reference Image) */}
      <motion.div
        variants={itemVariants}
        whileTap={{ scale: 0.98, transition: { type: 'spring', stiffness: 500, damping: 26 } }}
        whileHover={{ y: -1 }}
        onClick={() => setActiveTab('progress')}
        className="w-full bg-[#B8F45A] rounded-2xl p-5 sm:p-6 shadow-xs border border-[#A5EE3A]/50 mb-4 cursor-pointer select-none flex items-center justify-between gap-4 text-[#111312] transition-colors"
      >
        <div className="flex flex-col">
          {/* Top Label: DAILY STREAK */}
          <span className="text-xs font-bold text-[#375F0A] uppercase tracking-wider">
            DAILY STREAK
          </span>

          {/* Title: Daily Streak (two lines) */}
          <h2 className="text-[24px] sm:text-[26px] font-extrabold text-[#111312] tracking-tight leading-tight mt-1">
            Daily<br />Streak
          </h2>

          {/* Subtitle: Dynamic based on real streak */}
          <p className="text-xs sm:text-sm text-[#375F0A] font-medium mt-2 max-w-[210px] leading-snug">
            {(user.streakDays ?? 0) > 0
              ? 'You are crushing your health goals!'
              : 'Start your streak today with a workout!'}
          </p>
        </div>

        {/* Circular Progress Ring (Matches Screenshot: Pale Lime Track + Golden Yellow Progress + Transparent Center) */}
        <div
          className="relative w-24 h-24 flex items-center justify-center shrink-0"
          role="progressbar"
          aria-valuenow={user.streakDays ?? 0}
          aria-valuemin={0}
          aria-valuemax={7}
          aria-label={`${user.streakDays ?? 0} days streak`}
        >
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100" aria-hidden="true">
            {/* Pale light lime track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#D2F68D"
              strokeWidth="9.5"
            />
            {/* Golden Yellow progress indicator */}
            <motion.circle
              initial={{ strokeDashoffset: 251.32 }}
              animate={{
                strokeDashoffset:
                  (user.streakDays ?? 0) > 0
                    ? 251.32 - 251.32 * Math.min(1, (user.streakDays ?? 0) / 7)
                    : 251.32,
              }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#FBBF24"
              strokeWidth="9.5"
              strokeDasharray="251.32"
              strokeLinecap="round"
            />
          </svg>

          {/* Seamless Center Display with isolated background and unified text structure */}
          <div
            className="absolute inset-0 m-auto flex flex-col items-center justify-center w-14 h-14 rounded-full bg-[#B8F45A] isolate z-10 text-center select-none"
            aria-hidden="true"
          >
            <span className="text-[26px] font-extrabold text-[#111312] leading-none inline-flex flex-col items-center">
              <span>{user.streakDays ?? 0}</span>
              <span className="text-xs font-bold text-[#2D5400] mt-1 leading-none">days</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* 3. Original 2-Column Utility Cards (design.md: Steps to walk + Drink water) */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-4">
        {/* Card 1: Step to walk */}
        <motion.div
          onClick={() => setActiveTab('progress')}
          whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 500, damping: 26 } }}
          whileHover={{ y: -1 }}
          className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECECE9] flex flex-col justify-between cursor-pointer select-none transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#5A5E59]">Step to walk</span>
            <div className="w-8 h-8 rounded-full bg-[#E5FBC5] flex items-center justify-center text-[#456800]">
              <Activity size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[24px] font-bold text-[#111312] leading-none">
                {stepsWalked.toLocaleString()}
              </span>
              <span className="text-xs text-[#5A5E59] font-medium">steps</span>
            </div>
            <div className="w-full bg-[#EEF0EB] h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-[#456800] h-full rounded-full transition-all" style={{ width: `${stepPercent}%` }}></div>
            </div>
            <span className="text-xs text-[#456800] font-semibold block mt-1.5">Goal: 10,000 steps</span>
          </div>
        </motion.div>

        {/* Card 2: Drink Water */}
        <motion.div
          onClick={() => {
            addWater(250);
            showToast('+250ml water logged!');
          }}
          whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 500, damping: 26 } }}
          whileHover={{ y: -1 }}
          className="bg-white rounded-2xl p-4 shadow-xs border border-[#ECECE9] flex flex-col justify-between cursor-pointer select-none transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#5A5E59]">Drink Water</span>
            <div className="w-8 h-8 rounded-full bg-[#E4F7FE] flex items-center justify-center text-[#0284C7]">
              <Drop size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[24px] font-bold text-[#111312] leading-none">{waterGlasses}</span>
              <span className="text-xs text-[#5A5E59] font-medium">/ {targetGlasses} glasses</span>
            </div>
            <div className="w-full bg-[#EEF0EB] h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-[#0284C7] h-full rounded-full transition-all" style={{ width: `${waterPercent}%` }}></div>
            </div>
            {/* Issue 3: Contrast increased from 4.09:1 to 5.41:1 using #0369A1 on #FFFFFF */}
            <span className="text-xs text-[#0369A1] font-semibold block mt-1.5">+250ml Quick Add</span>
          </div>
        </motion.div>
      </motion.div>

      {/* 4. Date Strip / Week Selector Card */}
      <motion.div
        variants={itemVariants}
        className="w-full bg-white rounded-2xl p-2 shadow-xs border border-[#ECECE9] mb-4"
      >
        <div className="flex items-center justify-between px-2 py-1 mb-1">
          <span className="text-xs font-bold text-[#111312]">{weekInfo.monthYear}</span>
          <span className="text-xs font-medium text-[#525650]">Week {weekInfo.weekNumber}</span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekInfo.days.map((item) => {
            const isSelected = selectedDay === item.dayNumber;
            return (
              <motion.button
                key={item.dayKey}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSelectedDay(item.dayNumber)}
                type="button"
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all relative ${
                  isSelected
                    ? 'bg-[#111312] text-white shadow-xs font-bold'
                    : 'text-[#525650] hover:bg-[#F4F5F2] font-medium'
                }`}
              >
                <span className={`text-xs uppercase mb-0.5 ${isSelected ? 'text-[#B8F45A]' : 'text-[#525650]'}`}>
                  {item.dayInitial}
                </span>
                <span className="text-sm font-bold">{item.dayNumber}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* 5. Meals Timeline (Dynamic from today.meals) */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2.5 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#111312]">Today meals &amp; nutrition</h2>
          <span className="text-xs font-medium text-[#5A5E59]">
            {today.meals.reduce((sum, m) => sum + m.calories, 0)} kcal logged
          </span>
        </div>

        {today.meals.length === 0 ? (
          <div className="w-full bg-white rounded-2xl p-5 shadow-xs border border-[#ECECE9] text-center flex flex-col items-center justify-center py-6">
            <p className="text-xs font-bold text-[#111312]">No meals logged today yet</p>
            <p className="text-xs text-[#525650] mt-1 max-w-[240px]">
              Keep track of daily intake and pacing by logging your breakfast, lunch or dinner.
            </p>
            <motion.button
              type="button"
              whileTap={{ scale: 0.94, transition: { type: 'spring', stiffness: 500, damping: 25 } }}
              onClick={() => {
                logMeal('Healthy Breakfast Bowl', 'Breakfast', 380);
                showToast('+380 kcal Breakfast logged!');
              }}
              className="mt-3 h-10 px-4 rounded-xl bg-[#111312] text-white text-xs font-semibold hover:bg-black transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              + Quick Log Breakfast
            </motion.button>
          </div>
        ) : (
          today.meals.map((meal) => (
            <div
              key={meal.id}
              className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#ECECE9] flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#111312]">{meal.name}</h3>
                  <span className="text-xs text-[#C2410C] font-semibold bg-[#FFF0DF] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Flame size={12} /> {meal.calories} kcal
                  </span>
                </div>
                <p className="text-xs text-[#5A5E59] mt-1 leading-snug">
                  {meal.mealType} · Logged at {meal.time}
                </p>
              </div>
            </div>
          ))
        )}
      </motion.div>

      {/* 6. Today's Workout Session (Dynamic from Weekly Planner & Logged Workouts) */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2.5 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#111312]">Today&apos;s workout session</h2>
          <span className="text-xs font-semibold text-[#5A5E59]">
            {today.workouts.length} {today.workouts.length === 1 ? 'Workout Logged' : 'Workouts Logged'}
          </span>
        </div>

        {/* 1. Today's Planned Workout from Weekly Planner (if planned & not yet completed) */}
        {hasUncompletedPlanToday && todayPlan && (
          <div className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#ECECE9] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0DF] flex items-center justify-center text-[#FF9D42] shrink-0">
                <Flame size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#111312] truncate">{todayPlan.workoutTitle}</h3>
                  <span className="text-xs font-bold text-[#C2410C] bg-[#FFF0DF] px-2 py-0.5 rounded-full shrink-0">
                    Planned Today
                  </span>
                </div>
                <p className="text-xs text-[#525650] mt-0.5 truncate">
                  {todayPlan.estimatedDurationMin || 30} min · {todayPlan.exercises.length} exercises · Ready to train
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  toggleDayCompletion(todayKey);
                  showToast(`Completed ${todayPlan.workoutTitle}! Streak updated.`);
                }}
                className="h-8 px-3 rounded-xl bg-[#15803D] text-white text-xs font-bold hover:bg-[#166534] transition shadow-xs cursor-pointer flex items-center justify-center gap-1"
                type="button"
              >
                <CheckCircle size={14} />
                <span>Done</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveTab('planner')}
                className="h-8 px-3 rounded-xl bg-[#F4F5F2] text-[#111312] text-xs font-semibold hover:bg-[#ECECE9] transition cursor-pointer flex items-center justify-center"
                type="button"
              >
                Planner
              </motion.button>
            </div>
          </div>
        )}

        {/* 2. Completed / Logged Workouts for Today */}
        {today.workouts.length > 0 ? (
          today.workouts.map((w) => (
            <div
              key={w.id}
              className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#ECECE9] flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#E5FBC5] flex items-center justify-center text-[#15803D] shrink-0">
                  <Activity size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#111312] truncate">{w.title}</h3>
                  <p className="text-xs text-[#525650] mt-0.5">
                    {w.durationMin} min · {w.calories} kcal burned · {w.time}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#15803D] bg-[#E5FBC5] px-2.5 py-1 rounded-full shrink-0">
                Completed
              </span>
            </div>
          ))
        ) : !hasUncompletedPlanToday ? (
          /* 3. Empty State Matching User Reference Image 1 */
          <div className="w-full bg-white rounded-2xl p-6 shadow-xs border border-[#ECECE9] flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-full bg-[#F4F5F2] text-[#525650] flex items-center justify-center mb-2.5">
              <Activity size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#111312] mb-1">No workouts logged yet today</h3>
            <p className="text-xs text-[#525650] max-w-xs mb-3.5 leading-relaxed">
              Your day starts fresh at 0. Check your Weekly Planner for today&apos;s scheduled routine or log a workout now.
            </p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab('planner')}
              type="button"
              className="h-10 px-4 rounded-xl bg-[#111312] text-white text-xs font-semibold hover:bg-black transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>View Weekly Planner</span>
              <ArrowRight2 size={14} />
            </motion.button>
          </div>
        ) : null}
      </motion.div>

      {/* 8. Daily Hydration Hourly Log (Dynamic) */}
      <motion.div
        variants={itemVariants}
        className="w-full bg-white rounded-2xl p-5 shadow-xs border border-[#ECECE9] mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-[#111312]">Hourly hydration timeline</h2>
            <span className="text-xs text-[#5A5E59]">
              {today.waterIntakeMl} / {goals.waterTargetMl} ml target
            </span>
          </div>
          <span className="text-xs font-bold text-[#0369A1] bg-[#E4F7FE] px-2.5 py-0.5 rounded-full">
            {waterPercent}% Complete
          </span>
        </div>

        {today.waterIntakeMl === 0 ? (
          <div className="py-4 text-center">
            <p className="text-xs text-[#525650]">0 ml logged today.</p>
            <p className="text-xs text-[#525650] mt-0.5">
              Tap &quot;+250ml Quick Add&quot; above to begin tracking your hydration.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5A5E59] font-medium">Logged hydration volume</span>
              <span className="font-bold text-[#111312]">{today.waterIntakeMl} ml ({waterGlasses} glasses)</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* 9. Athletic Consistency Barometer (Dynamic from real data) */}
      <motion.div
        variants={itemVariants}
        className="w-full bg-white rounded-2xl p-5 shadow-xs border border-[#ECECE9] mb-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-[#111312]">Daily burn pacing</h2>
          <span className="text-xs font-bold text-[#15803D] bg-[#E5FBC5] px-2.5 py-0.5 rounded-full">
            {user.streakDays} {user.streakDays === 1 ? 'Day' : 'Days'} Active
          </span>
        </div>
        <p className="text-xs text-[#5A5E59] mb-3">
          {today.caloriesBurned > 0
            ? `${today.caloriesBurned} of ${goals.calorieTarget} kcal burned today (${caloriePercent}%). Keep pushing!`
            : `0 of ${goals.calorieTarget} kcal burned today. Start your daily movement to build your streak!`}
        </p>
        <div className="w-full bg-[#F4F5F2] h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#15803D] rounded-full transition-all duration-500"
            style={{ width: `${caloriePercent}%` }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
