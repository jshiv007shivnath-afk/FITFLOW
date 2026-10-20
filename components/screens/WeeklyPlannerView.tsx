'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  useFitFlow,
  DayWorkoutPlan,
  ExercisePlanItem,
  ExerciseTargetType,
} from '@/context/FitFlowContext';
import {
  Calendar2,
  Clock,
  Check,
  CheckCircle,
  Edit2,
  Add,
  Trash,
  Repeat,
  Activity,
  Flame,
  ArrowRight2,
} from 'reicon-react';
import { Dumbbell, Sparkles, ChevronRight, Plus, Minus, Zap } from 'lucide-react';

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
      type: 'spring',
      stiffness: 420,
      damping: 28,
    },
  },
};

export function WeeklyPlannerView() {
  const {
    weeklyPlan,
    saveWeeklyPlan,
    updateDayWorkout,
    toggleDayCompletion,
    repeatPreviousWeekPlan,
    createNewWeeklyPlan,
    showNewWeekDialog,
    setShowNewWeekDialog,
    showToast,
    todayKey,
  } = useFitFlow();

  const prefersReducedMotion = useReducedMotion();

  // Selected Day in Week Navigation Strip (defaults to real dynamic todayKey)
  const [selectedDayKey, setSelectedDayKey] = useState<DayWorkoutPlan['dayKey']>(todayKey || 'mon');

  // Keep selectedDayKey aligned with todayKey on mount or day change
  useEffect(() => {
    if (todayKey) {
      setSelectedDayKey(todayKey);
    }
  }, [todayKey]);

  // Track checked off individual exercises per day session (interactive checklist)
  const [completedExerciseIds, setCompletedExerciseIds] = useState<Record<string, boolean>>({});

  // Floating XP toast animation trigger
  const [showXpCelebration, setShowXpCelebration] = useState(false);

  // State for Editing a Day (Modal / Bottom Sheet)
  const [editingDayKey, setEditingDayKey] = useState<DayWorkoutPlan['dayKey'] | null>(null);
  const [draftDay, setDraftDay] = useState<DayWorkoutPlan | null>(null);

  // Accessible Escape key dismissal for editing modal
  useEffect(() => {
    if (!draftDay) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingDayKey(null);
        setDraftDay(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [draftDay]);

  // Quick preset workout suggestions for editor and quick swap
  const workoutPresets = [
    {
      title: 'Push-ups & Chest Core',
      est: 30,
      calories: 220,
      ex: [
        { id: 'p1', name: 'Push-ups', targetType: 'reps' as const, sets: 3, reps: 15, restIntervalSec: 60 },
        { id: 'p2', name: 'Dumbbell Floor Press', targetType: 'reps' as const, sets: 3, reps: 12, restIntervalSec: 60 },
        { id: 'p3', name: 'Core Plank Hold', targetType: 'duration' as const, sets: 3, durationSeconds: 60, restIntervalSec: 45 },
      ],
    },
    {
      title: 'Legs & Lower Body',
      est: 35,
      calories: 280,
      ex: [
        { id: 'l1', name: 'Goblet Squats', targetType: 'reps' as const, sets: 3, reps: 15, restIntervalSec: 60 },
        { id: 'l2', name: 'Walking Lunges', targetType: 'reps' as const, sets: 3, reps: 12, restIntervalSec: 60 },
        { id: 'l3', name: 'Calf Raises', targetType: 'reps' as const, sets: 3, reps: 20, restIntervalSec: 45 },
      ],
    },
    {
      title: 'Cardio & Aerobic Pacing',
      est: 25,
      calories: 210,
      ex: [
        { id: 'c1', name: 'Zone 2 Brisk Walking', targetType: 'duration' as const, sets: 1, durationSeconds: 1200, restIntervalSec: 0 },
        { id: 'c2', name: 'Abdominal Mountain Climbers', targetType: 'duration' as const, sets: 3, durationSeconds: 45, restIntervalSec: 30 },
      ],
    },
    {
      title: 'Pull & Upper Back',
      est: 35,
      calories: 260,
      ex: [
        { id: 'b1', name: 'Dumbbell Rows', targetType: 'reps' as const, sets: 3, reps: 12, restIntervalSec: 60 },
        { id: 'b2', name: 'Hammer Curls', targetType: 'reps' as const, sets: 3, reps: 12, restIntervalSec: 45 },
        { id: 'b3', name: 'Face Pulls', targetType: 'reps' as const, sets: 3, reps: 15, restIntervalSec: 45 },
      ],
    },
    {
      title: 'Full Body Circuit',
      est: 40,
      calories: 320,
      ex: [
        { id: 'f1', name: 'Kettlebell Swings', targetType: 'reps' as const, sets: 3, reps: 20, restIntervalSec: 60 },
        { id: 'f2', name: 'Bodyweight Burpees', targetType: 'reps' as const, sets: 3, reps: 10, restIntervalSec: 60 },
        { id: 'f3', name: 'Jump Rope Conditioning', targetType: 'duration' as const, sets: 1, durationSeconds: 600, restIntervalSec: 0 },
      ],
    },
  ];

  // Helper stats (derived from genuine plan)
  const totalPlannedDays = weeklyPlan.days.filter((d) => !d.isRestDay).length;
  const completedDays = weeklyPlan.days.filter((d) => !d.isRestDay && d.completed).length;
  const restDaysCount = weeklyPlan.days.filter((d) => d.isRestDay).length;
  const remainingWorkouts = Math.max(0, totalPlannedDays - completedDays);
  const progressPercent = totalPlannedDays > 0 ? Math.round((completedDays / totalPlannedDays) * 100) : 0;

  // Currently selected day object
  const rawSelectedDay = weeklyPlan?.days?.find((d) => d.dayKey === selectedDayKey) || weeklyPlan?.days?.[0];
  const selectedDay: DayWorkoutPlan = rawSelectedDay ? {
    ...rawSelectedDay,
    exercises: Array.isArray(rawSelectedDay.exercises) ? rawSelectedDay.exercises : [],
  } : {
    dayKey: 'mon',
    dayName: 'Monday',
    shortDate: '',
    workoutTitle: 'Rest Day',
    isRestDay: true,
    estimatedDurationMin: 0,
    completed: false,
    exercises: [],
  };

  // Total sets in selected day
  const selectedDayTotalSets = selectedDay.exercises.reduce((acc, ex) => acc + (ex?.sets || 0), 0);

  // Check how many exercises in the current day are marked done
  const currentDayCheckedCount = selectedDay.exercises.filter(
    (ex) => completedExerciseIds[`${selectedDay.dayKey}-${ex.id}`]
  ).length;

  // Toggle single exercise checked state
  const handleToggleExerciseCheck = (exId: string) => {
    const key = `${selectedDay.dayKey}-${exId}`;
    setCompletedExerciseIds((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Open editor for a day
  const handleStartEditDay = (day: DayWorkoutPlan) => {
    setEditingDayKey(day.dayKey);
    setDraftDay(JSON.parse(JSON.stringify(day)));
  };

  // Add a new exercise to draft
  const handleAddExercise = () => {
    if (!draftDay) return;
    const newEx: ExercisePlanItem = {
      id: 'ex-' + Date.now(),
      name: 'New Exercise',
      targetType: 'reps',
      sets: 3,
      reps: 12,
      restIntervalSec: 60,
    };
    setDraftDay({
      ...draftDay,
      exercises: [...draftDay.exercises, newEx],
      estimatedDurationMin: Math.max(15, draftDay.estimatedDurationMin + 10),
    });
  };

  // Remove exercise from draft
  const handleRemoveExercise = (exId: string) => {
    if (!draftDay) return;
    setDraftDay({
      ...draftDay,
      exercises: draftDay.exercises.filter((e) => e.id !== exId),
      estimatedDurationMin: Math.max(0, draftDay.estimatedDurationMin - 8),
    });
  };

  // Update exercise field in draft
  const handleUpdateExercise = (exId: string, updates: Partial<ExercisePlanItem>) => {
    if (!draftDay) return;
    setDraftDay({
      ...draftDay,
      exercises: draftDay.exercises.map((e) => (e.id === exId ? { ...e, ...updates } : e)),
    });
  };

  // Apply a preset to draft
  const handleApplyPreset = (preset: typeof workoutPresets[0]) => {
    if (!draftDay) return;
    setDraftDay({
      ...draftDay,
      workoutTitle: preset.title,
      isRestDay: false,
      estimatedDurationMin: preset.est,
      exercises: preset.ex.map((item) => ({ ...item, id: 'ex-' + Date.now() + Math.random().toString().slice(2, 6) })),
    });
    showToast(`Loaded "${preset.title}" preset`);
  };

  // Save draft day
  const handleSaveDraftDay = () => {
    if (!draftDay || !editingDayKey) return;
    if (!draftDay.isRestDay && !draftDay.workoutTitle.trim()) {
      showToast('Please enter a workout title');
      return;
    }
    updateDayWorkout(editingDayKey, draftDay);
    setEditingDayKey(null);
    setDraftDay(null);
    showToast(`Updated ${draftDay.dayName} plan`);
  };

  // Trigger celebration on completing a workout
  const handleCompleteWorkout = () => {
    if (selectedDay.isRestDay) {
      showToast('This is a rest day. Add a workout first if you trained today.');
      return;
    }
    const isNowCompleted = !selectedDay.completed;
    toggleDayCompletion(selectedDay.dayKey);

    if (isNowCompleted) {
      // Trigger confetti celebration
      if (!prefersReducedMotion && typeof window !== 'undefined') {
        confetti({
          particleCount: 55,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#B8F45A', '#15803D', '#111312', '#FBBF24'],
        });
      }
      setShowXpCelebration(true);
      setTimeout(() => setShowXpCelebration(false), 2400);
      showToast(`${selectedDay.dayName} workout completed! +120 XP earned`);
    } else {
      showToast(`Marked ${selectedDay.dayName} as incomplete`);
    }
  };

  // Quick swap selected day with a preset
  const handleQuickSwapPreset = (preset: typeof workoutPresets[0]) => {
    updateDayWorkout(selectedDay.dayKey, {
      workoutTitle: preset.title,
      isRestDay: false,
      estimatedDurationMin: preset.est,
      exercises: preset.ex.map((item) => ({ ...item, id: 'ex-' + Date.now() + Math.random().toString().slice(2, 6) })),
    });
    showToast(`Applied "${preset.title}" to ${selectedDay.dayName}`);
  };

  // Format week label to strictly use regular hyphen '-' (taste-skill anti-slop rule)
  const sanitizedWeekLabel = (weeklyPlan.weekLabel || 'Oct 12 - Oct 18, 2026')
    .replace(/[—–]/g, '-')
    .replace(/\s*-\s*/g, ' - ');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 w-full bg-[#F8F8F6] text-[#111312] px-4 sm:px-5 py-6 pb-36 min-h-screen font-sans flex flex-col gap-6 max-w-lg mx-auto"
    >
      {/* 1. MAIN PAGE HEADER */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3">
        {/* Top Meta Bar */}
        <div className="flex items-start justify-between gap-3">
          {/* Left: Date Capsule + Planned/Rest Subtitle */}
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs font-bold text-[#15803D] bg-[#E5FBC5] px-3.5 py-1.5 rounded-full tracking-wide shadow-2xs select-none">
              {sanitizedWeekLabel}
            </span>
            <span className="text-xs text-[#525650] font-medium pl-0.5 select-none">
              {totalPlannedDays} planned · {restDaysCount} rest
            </span>
          </div>

          {/* Right: Tactile Soft-Touch Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            <motion.button
              type="button"
              onClick={() => setShowNewWeekDialog(true)}
              whileTap={{ scale: 0.94, transition: { type: 'spring', stiffness: 500, damping: 26 } }}
              whileHover={{ y: -1 }}
              className="h-10 px-3.5 rounded-2xl bg-white border border-[#ECECE9] hover:bg-[#F4F5F2] shadow-xs text-xs font-semibold text-[#111312] flex items-center gap-1.5 select-none transition-colors"
              aria-label="New Week Planning Options"
            >
              <Repeat size={14} className="text-[#15803D]" />
              <span>Week Flow</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleStartEditDay(selectedDay)}
              whileTap={{ scale: 0.94, transition: { type: 'spring', stiffness: 500, damping: 26 } }}
              whileHover={{ y: -1 }}
              className="h-10 px-3.5 rounded-2xl bg-[#111312] text-white hover:bg-black shadow-xs text-xs font-semibold flex items-center gap-1.5 select-none transition-colors"
              aria-label="Edit Schedule"
            >
              <Edit2 size={13} className="text-[#B8F45A]" />
              <span>Edit</span>
            </motion.button>
          </div>
        </div>

        {/* Title and Subtitle with Confident Swiss Typography */}
        <div className="pt-1">
          <h1 className="text-[26px] font-black text-[#111312] tracking-tight leading-tight">
            Weekly Workout Planner
          </h1>
          <p className="text-sm text-[#525650] mt-1 font-normal leading-relaxed">
            Plan your week. Focus on showing up.
          </p>
        </div>
      </motion.div>

      {/* 2. WEEK NAVIGATION (7-DAY STRIP WITH GLIDING LIQUID CAPSULE) */}
      <motion.div variants={itemVariants} className="w-full">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-xs font-bold text-[#525650] uppercase tracking-wider">
            7-Day Schedule
          </span>
          <span className="text-xs text-[#525650] font-normal">
            Select a day to view workout
          </span>
        </div>

        {/* 7-Day Horizontal Bar Card */}
        <div
          role="tablist"
          aria-label="Weekly Workout Schedule Days"
          className="grid grid-cols-7 gap-1 sm:gap-1.5 w-full bg-white p-2.5 sm:p-3 rounded-2xl border border-[#ECECE9] shadow-[0_4px_24px_rgba(20,25,20,0.03)] relative"
        >
          {weeklyPlan.days.map((day) => {
            const isSelected = day.dayKey === selectedDayKey;
            const isToday = day.dayKey === todayKey;
            const dayInitial = day.dayName.slice(0, 3).toUpperCase();
            const dateNum = day.shortDate.split(' ')[1] || '';

            return (
              <motion.button
                key={day.dayKey}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`${day.dayName}, ${day.shortDate}: ${day.isRestDay ? 'Rest Day' : day.workoutTitle}${day.completed ? ', Completed' : ''}`}
                onClick={() => setSelectedDayKey(day.dayKey)}
                whileTap={{ scale: 0.93, transition: { type: 'spring', stiffness: 500, damping: 25 } }}
                whileHover={{ y: -1 }}
                className="relative flex flex-col items-center justify-between py-2.5 px-1 min-h-[84px] rounded-2xl select-none outline-none transition-colors cursor-pointer"
              >
                {/* Gliding Active Capsule with Spring Physics */}
                {isSelected && (
                  <motion.div
                    layoutId="activeDayScheduleCapsule"
                    transition={{
                      type: 'spring',
                      stiffness: 480,
                      damping: 32,
                    }}
                    className="absolute inset-0 bg-[#111312] rounded-2xl z-0 shadow-sm"
                  />
                )}


                {/* Day Abbreviation */}
                <span
                  className={`relative z-10 text-xs font-bold tracking-tight uppercase select-none ${
                    isSelected ? 'text-[#B8F45A]' : 'text-[#525650]'
                  }`}
                >
                  {dayInitial}
                </span>

                {/* Calendar Date Number */}
                <span
                  className={`relative z-10 text-base font-extrabold leading-tight my-0.5 select-none ${
                    isSelected ? 'text-white' : 'text-[#111312]'
                  }`}
                >
                  {dateNum}
                </span>

                {/* Status Indicator or Clean Whitespace (Strictly Zero Green Dots) */}
                <div className="relative z-10 h-4 flex items-center justify-center select-none">
                  {day.completed ? (
                    <span
                      aria-label="Completed"
                      className={`text-[10px] font-bold flex items-center justify-center ${
                        isSelected ? 'text-[#B8F45A]' : 'text-[#15803D]'
                      }`}
                    >
                      <Check size={12} />
                    </span>
                  ) : day.isRestDay ? (
                    <span
                      className={`text-[10.5px] font-semibold tracking-tight ${
                        isSelected ? 'text-white/80' : 'text-[#525650]'
                      }`}
                    >
                      Rest
                    </span>
                  ) : null}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* 3. SELECTED-DAY WORKOUT DETAIL (INTERACTIVE HERO WITH SPRING TRANSITIONS) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay.dayKey}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(20,25,20,0.03)] border border-[#ECECE9] flex flex-col gap-4 relative overflow-hidden"
        >
          {/* Floating XP Reward Burst Popup */}
          <AnimatePresence>
            {showXpCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: -8 }}
                exit={{ opacity: 0, scale: 0.8, y: -25 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="absolute top-4 right-4 z-30 bg-[#B8F45A] text-[#111312] font-black text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 select-none"
              >
                <Sparkles size={13} className="text-[#15803D]" />
                <span>+120 XP EARNED!</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Day Header Row */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F4F5F2]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-black text-[#111312]">
                {selectedDay.dayName}
              </span>
              <span className="text-xs text-[#525650] font-semibold">
                · {selectedDay.shortDate}
              </span>
            </div>

            {/* Status Badge */}
            {selectedDay.isRestDay ? (
              <span className="text-xs font-semibold text-[#525650] bg-[#F4F5F2] px-3 py-1 rounded-full">
                {selectedDay.exercises.length === 0 ? 'Unscheduled' : 'Rest Day'}
              </span>
            ) : selectedDay.completed ? (
              <span className="text-xs font-bold text-[#15803D] bg-[#E5FBC5] px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle size={13} />
                <span>Done</span>
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#15803D] bg-[#E5FBC5]/60 px-3 py-1 rounded-full">
                Scheduled
              </span>
            )}
          </div>

          {/* REST / UNPLANNED DAY STATE (User plans their own routine) */}
          {selectedDay.isRestDay ? (
            <div className="flex flex-col items-center text-center py-6 px-4 bg-[#F8F8F6] rounded-2xl border border-[#EEF0EB]">
              {/* Animated Floating Planning/Recovery Icon */}
              <motion.div
                animate={prefersReducedMotion ? {} : { y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-[#ECECE9] text-[#15803D] flex items-center justify-center mb-3"
              >
                <Dumbbell size={24} className="text-[#15803D]" />
              </motion.div>

              <h2 className="text-base font-bold text-[#111312] mb-1">
                Plan Your {selectedDay.dayName} Workout
              </h2>
              <p className="text-xs text-[#525650] max-w-sm leading-relaxed mb-4">
                No routine assigned yet. Design your custom exercises and pacing, or apply a one-tap template to get moving.
              </p>

              {/* Quick Workout Template Suggestions */}
              <div className="w-full mb-4">
                <span className="text-xs font-bold text-[#525650] uppercase tracking-wider block mb-2 text-center">
                  Quick workout templates
                </span>
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {workoutPresets.map((p) => (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => handleQuickSwapPreset(p)}
                      className="h-8 px-3 rounded-xl bg-white border border-[#ECECE9] hover:bg-[#F4F5F2] text-xs font-semibold text-[#111312] transition shadow-xs cursor-pointer active:scale-95"
                    >
                      + {p.title.split('&')[0].trim()} ({p.est}m)
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Plan Custom or Rest */}
              <div className="flex items-center gap-2.5 flex-wrap justify-center">
                <motion.button
                  type="button"
                  onClick={() => handleStartEditDay(selectedDay)}
                  whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 500, damping: 25 } }}
                  className="h-10 px-5 rounded-xl bg-[#111312] text-white hover:bg-black text-xs font-bold shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Build Custom Workout for {selectedDay.dayName}</span>
                </motion.button>
              </div>
            </div>
          ) : (
            /* WORKOUT DETAIL STATE */
            <div className="flex flex-col gap-4">
              {/* Title & Quick Stats Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <h2 className="text-lg font-black text-[#111312] leading-tight">
                    {selectedDay.workoutTitle}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-[#525650] font-medium">
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-[#525650]" />
                      {selectedDay.estimatedDurationMin} min
                    </span>
                    <span>·</span>
                    <span>
                      {selectedDay.exercises.length} {selectedDay.exercises.length === 1 ? 'exercise' : 'exercises'}
                    </span>
                    {selectedDayTotalSets > 0 && (
                      <>
                        <span>·</span>
                        <span>{selectedDayTotalSets} sets</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Edit Workout Button */}
                <motion.button
                  type="button"
                  onClick={() => handleStartEditDay(selectedDay)}
                  whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 500, damping: 25 } }}
                  className="h-9 px-3.5 rounded-xl bg-[#F8F8F6] border border-[#ECECE9] hover:bg-[#EEF0EB] text-xs font-semibold text-[#111312] transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Edit2 size={13} />
                  <span>Edit Routine</span>
                </motion.button>
              </div>

              {/* 4 Restrained Meta Capsules */}
              <div className="grid grid-cols-4 gap-2 bg-[#FAFBF9] p-2.5 rounded-2xl border border-[#ECECE9] text-center">
                <div className="flex flex-col py-0.5">
                  <span className="text-[10px] text-[#525650] font-bold uppercase">Duration</span>
                  <span className="text-xs font-bold text-[#111312] mt-0.5">{selectedDay.estimatedDurationMin}m</span>
                </div>
                <div className="flex flex-col py-0.5 border-l border-[#ECECE9]">
                  <span className="text-[10px] text-[#525650] font-bold uppercase">Exercises</span>
                  <span className="text-xs font-bold text-[#111312] mt-0.5">{selectedDay.exercises.length}</span>
                </div>
                <div className="flex flex-col py-0.5 border-l border-[#ECECE9]">
                  <span className="text-[10px] text-[#525650] font-bold uppercase">Total Sets</span>
                  <span className="text-xs font-bold text-[#111312] mt-0.5">{selectedDayTotalSets}</span>
                </div>
                <div className="flex flex-col py-0.5 border-l border-[#ECECE9]">
                  <span className="text-[10px] text-[#525650] font-bold uppercase">Est. Burn</span>
                  <span className="text-xs font-bold text-[#15803D] mt-0.5">~{Math.round(selectedDay.estimatedDurationMin * 7.5)} kcal</span>
                </div>
              </div>

              {/* Exercise Checklist Section */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-xs font-bold text-[#111312]">
                    Exercise Routine
                  </span>
                  {selectedDay.exercises.length > 0 && (
                    <span className="text-xs font-semibold text-[#15803D]">
                      {currentDayCheckedCount} of {selectedDay.exercises.length} checked
                    </span>
                  )}
                </div>

                {selectedDay.exercises.length > 0 ? (
                  <div className="divide-y divide-[#F4F5F2] border border-[#ECECE9] rounded-2xl overflow-hidden bg-white">
                    {selectedDay.exercises.map((ex, index) => {
                      const isChecked = !!completedExerciseIds[`${selectedDay.dayKey}-${ex.id}`];

                      return (
                        <motion.div
                          key={ex.id}
                          layout
                          onClick={() => handleToggleExerciseCheck(ex.id)}
                          role="checkbox"
                          aria-checked={isChecked}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              handleToggleExerciseCheck(ex.id);
                            }
                          }}
                          className={`flex items-center justify-between p-3.5 transition-colors cursor-pointer select-none ${
                            isChecked ? 'bg-[#F2FBF0]/40' : 'hover:bg-[#FAFBF9]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Interactive Animated Checkbox */}
                            <motion.div
                              whileTap={{ scale: 0.85 }}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                isChecked
                                  ? 'bg-[#15803D] text-white shadow-xs'
                                  : 'border-2 border-[#DCDFD8] bg-white text-transparent hover:border-[#15803D]'
                              }`}
                            >
                              <Check size={14} className={isChecked ? 'opacity-100' : 'opacity-0'} />
                            </motion.div>

                            <div className="flex flex-col">
                              <span
                                className={`text-xs font-bold transition-all ${
                                  isChecked ? 'text-[#525650] line-through' : 'text-[#111312]'
                                }`}
                              >
                                {ex.name}
                              </span>
                              {ex.restIntervalSec && ex.restIntervalSec > 0 ? (
                                <span className="text-xs text-[#525650]">
                                  {ex.restIntervalSec}s rest between sets
                                </span>
                              ) : null}
                            </div>
                          </div>

                          {/* Numeric Target Badge */}
                          <div className="text-right shrink-0">
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-xl transition-colors ${
                                isChecked
                                  ? 'bg-[#EEF0EB] text-[#525650]'
                                  : 'bg-[#E5FBC5] text-[#15803D]'
                              }`}
                            >
                              {ex.targetType === 'reps' && `${ex.sets} sets × ${ex.reps || 12} reps`}
                              {ex.targetType === 'duration' &&
                                `${ex.sets} × ${Math.round(ex.durationSeconds || 60)} sec`}
                              {ex.targetType === 'distance' &&
                                `${ex.sets} × ${ex.distanceKm || 3} km`}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-[#FAFBF9] rounded-2xl border border-dashed border-[#DCDFD8]">
                    <p className="text-xs text-[#525650] mb-3">
                      No specific exercises added for this day yet.
                    </p>
                    <motion.button
                      type="button"
                      onClick={() => handleStartEditDay(selectedDay)}
                      whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 500, damping: 25 } }}
                      className="h-9 px-4 rounded-xl bg-[#111312] text-white text-xs font-semibold shadow-xs hover:bg-black transition-colors"
                    >
                      + Add Exercises
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Workout Completion CTA Button */}
              {!selectedDay.isRestDay && <div className="pt-2">
                <motion.button
                  type="button"
                  onClick={handleCompleteWorkout}
                  whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 500, damping: 25 } }}
                  className={`w-full h-12 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                    selectedDay.completed
                      ? 'bg-[#E5FBC5] text-[#15803D] hover:bg-[#d8f5b0]'
                      : 'bg-[#15803D] text-white hover:bg-[#166534]'
                  }`}
                >
                  <CheckCircle size={16} />
                  <span>
                    {selectedDay.completed
                      ? 'Completed ✓ (Tap to Undo)'
                      : 'Mark Workout as Completed (+120 XP)'}
                  </span>
                </motion.button>
              </div>}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 4. QUICK ROUTINE SWAP DRAWER / CHIPS */}
      {!selectedDay.isRestDay && (
        <motion.div variants={itemVariants} className="w-full">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-[#525650]">
              Quick Routine Swap
            </span>
            <span className="text-xs text-[#525650] font-normal">
              1-tap apply to {selectedDay.dayName}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            {workoutPresets.map((preset) => (
              <motion.button
                key={preset.title}
                type="button"
                onClick={() => handleQuickSwapPreset(preset)}
                whileTap={{ scale: 0.95 }}
                whileHover={{ y: -1 }}
                className="shrink-0 px-3.5 py-2 rounded-xl bg-white border border-[#ECECE9] hover:border-[#15803D] shadow-2xs text-left flex flex-col gap-0.5 transition-colors"
              >
                <span className="text-xs font-bold text-[#111312] whitespace-nowrap">
                  {preset.title}
                </span>
                <span className="text-xs text-[#525650] font-medium">
                  {preset.est} min · {preset.ex.length} exercises
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* 5. RESTRAINED WEEKLY SUMMARY */}
      <motion.div
        variants={itemVariants}
        className="w-full bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(20,25,20,0.03)] border border-[#ECECE9] flex flex-col gap-4"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#111312]">Weekly Plan Overview</span>
          <span className="font-semibold text-[#15803D]">
            {completedDays} of {totalPlannedDays} completed ({progressPercent}%)
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-[#EEF0EB] h-2.5 rounded-full overflow-hidden my-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-[#15803D] rounded-full"
          />
        </div>

        {/* 4 Restrained Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#F4F5F2] text-center">
          <div className="flex flex-col py-1">
            <span className="text-xs text-[#525650] font-medium">Planned</span>
            <span className="text-base font-bold text-[#111312] mt-0.5">{totalPlannedDays}</span>
          </div>
          <div className="flex flex-col py-1 border-l border-[#F4F5F2]">
            <span className="text-xs text-[#525650] font-medium">Rest Days</span>
            <span className="text-base font-bold text-[#525650] mt-0.5">{restDaysCount}</span>
          </div>
          <div className="flex flex-col py-1 border-l border-[#F4F5F2]">
            <span className="text-xs text-[#525650] font-medium">Completed</span>
            <span className="text-base font-bold text-[#15803D] mt-0.5">{completedDays}</span>
          </div>
          <div className="flex flex-col py-1 border-l border-[#F4F5F2]">
            <span className="text-xs text-[#525650] font-medium">Remaining</span>
            <span className="text-base font-bold text-[#111312] mt-0.5">{remainingWorkouts}</span>
          </div>
        </div>
      </motion.div>

      {/* 6. DAY & EXERCISE EDITOR MODAL */}
      <AnimatePresence>
        {editingDayKey && draftDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 480, damping: 28 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-routine-heading"
              className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-[#ECECE9] max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#F4F5F2] mb-3">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider">
                    Editing Routine
                  </span>
                  <h3 id="modal-routine-heading" className="text-base font-bold text-[#111312]">
                    {draftDay.dayName} ({draftDay.shortDate})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingDayKey(null);
                    setDraftDay(null);
                  }}
                  className="w-8 h-8 rounded-full bg-[#F4F5F2] hover:bg-[#EEF0EB] text-[#525650] flex items-center justify-center text-sm font-bold transition"
                  aria-label="Close dialog"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                {/* Rest Day Switch */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8F8F6] border border-[#ECECE9]">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#111312]">Mark as Rest Day</span>
                    <span className="text-xs text-[#525650]">
                      Schedule active recovery & restorative mobility
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    id="rest-day-toggle"
                    aria-label="Mark as Rest Day"
                    checked={draftDay.isRestDay}
                    onChange={(e) =>
                      setDraftDay({
                        ...draftDay,
                        isRestDay: e.target.checked,
                        workoutTitle: e.target.checked ? 'Rest Day' : draftDay.workoutTitle || 'Upper Body',
                      })
                    }
                    className="w-5 h-5 accent-[#15803D] rounded cursor-pointer"
                  />
                </div>

                {!draftDay.isRestDay && (
                  <>
                    {/* Workout Title Field */}
                    <div className="space-y-1">
                      <label htmlFor="workout-title-input" className="text-xs font-bold text-[#111312]">
                        Workout Title
                      </label>
                      <input
                        id="workout-title-input"
                        type="text"
                        value={draftDay.workoutTitle}
                        onChange={(e) =>
                          setDraftDay({ ...draftDay, workoutTitle: e.target.value })
                        }
                        placeholder="e.g. Upper Body & Core"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECECE9] bg-[#FAFBF9] text-xs font-semibold text-[#111312] focus:outline-none focus:ring-2 focus:ring-[#15803D]/40"
                      />
                    </div>

                    {/* Quick Presets Picker */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-[#525650] uppercase tracking-wider block">
                        Quick Workout Presets
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {workoutPresets.map((preset) => (
                          <button
                            key={preset.title}
                            type="button"
                            onClick={() => handleApplyPreset(preset)}
                            className="px-2.5 py-1 rounded-lg bg-[#F4F5F2] hover:bg-[#E5FBC5] hover:text-[#14532D] text-xs font-semibold text-[#525650] transition"
                          >
                            {preset.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Estimated Duration Field with Stepper Buttons */}
                    <div className="space-y-1.5">
                      <label htmlFor="est-duration-input" className="text-xs font-bold text-[#111312]">
                        Estimated Duration (Minutes)
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setDraftDay({
                              ...draftDay,
                              estimatedDurationMin: Math.max(5, (draftDay.estimatedDurationMin || 30) - 5),
                            })
                          }
                          className="w-9 h-9 rounded-xl bg-[#F4F5F2] hover:bg-[#EEF0EB] text-[#111312] flex items-center justify-center font-bold text-sm"
                          aria-label="Decrease 5 minutes"
                        >
                          -5
                        </button>
                        <input
                          id="est-duration-input"
                          type="number"
                          min="5"
                          max="180"
                          value={draftDay.estimatedDurationMin !== undefined ? draftDay.estimatedDurationMin : ''}
                          onChange={(e) =>
                            setDraftDay({
                              ...draftDay,
                              estimatedDurationMin: e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0),
                            })
                          }
                          className="flex-1 px-3.5 py-2 rounded-xl border border-[#ECECE9] bg-[#FAFBF9] text-xs font-semibold text-[#111312] text-center focus:outline-none focus:ring-2 focus:ring-[#15803D]/40"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setDraftDay({
                              ...draftDay,
                              estimatedDurationMin: Math.min(180, (draftDay.estimatedDurationMin || 30) + 5),
                            })
                          }
                          className="w-9 h-9 rounded-xl bg-[#F4F5F2] hover:bg-[#EEF0EB] text-[#111312] flex items-center justify-center font-bold text-sm"
                          aria-label="Increase 5 minutes"
                        >
                          +5
                        </button>
                      </div>
                    </div>

                    {/* Exercises List */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#111312]">
                          Exercises ({draftDay.exercises.length})
                        </span>
                        <button
                          type="button"
                          onClick={handleAddExercise}
                          className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1"
                        >
                          <Add size={14} />
                          <span>Add Exercise</span>
                        </button>
                      </div>

                      {draftDay.exercises.map((ex, idx) => (
                        <div
                          key={ex.id}
                          className="p-3 rounded-2xl bg-[#F8F8F6] border border-[#ECECE9] space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={ex.name}
                              aria-label={`Exercise ${idx + 1} Name`}
                              onChange={(e) =>
                                handleUpdateExercise(ex.id, { name: e.target.value })
                              }
                              placeholder="Exercise Name"
                              className="flex-1 px-3 py-1.5 rounded-lg border border-[#ECECE9] bg-white text-xs font-bold text-[#111312]"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExercise(ex.id)}
                              className="w-7 h-7 rounded-lg bg-white border border-[#ECECE9] text-[#E11D48] hover:bg-[#FFE4E6] flex items-center justify-center transition"
                              aria-label={`Remove exercise ${idx + 1}`}
                            >
                              <Trash size={14} />
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label htmlFor={`ex-${ex.id}-sets`} className="text-xs text-[#525650] font-semibold block mb-0.5">
                                Sets
                              </label>
                              <input
                                id={`ex-${ex.id}-sets`}
                                type="number"
                                min="1"
                                max="20"
                                value={ex.sets !== undefined ? ex.sets : ''}
                                aria-label={`Sets for exercise ${idx + 1}`}
                                onChange={(e) =>
                                  handleUpdateExercise(ex.id, {
                                    sets: e.target.value === '' ? 1 : Math.max(1, parseInt(e.target.value, 10) || 1),
                                  })
                                }
                                className="w-full px-2 py-1 rounded-lg border border-[#ECECE9] bg-white text-xs font-semibold text-[#111312]"
                              />
                            </div>

                            <div>
                              <label htmlFor={`ex-${ex.id}-type`} className="text-xs text-[#525650] font-semibold block mb-0.5">
                                Target Type
                              </label>
                              <select
                                id={`ex-${ex.id}-type`}
                                value={ex.targetType}
                                aria-label={`Target type for exercise ${idx + 1}`}
                                onChange={(e) =>
                                  handleUpdateExercise(ex.id, {
                                    targetType: e.target.value as ExerciseTargetType,
                                  })
                                }
                                className="w-full px-1.5 py-1 rounded-lg border border-[#ECECE9] bg-white text-xs font-semibold text-[#111312]"
                              >
                                <option value="reps">Reps</option>
                                <option value="duration">Duration</option>
                                <option value="distance">Distance</option>
                              </select>
                            </div>

                            <div>
                              <label htmlFor={`ex-${ex.id}-target`} className="text-xs text-[#525650] font-semibold block mb-0.5">
                                {ex.targetType === 'reps'
                                  ? 'Reps'
                                  : ex.targetType === 'duration'
                                  ? 'Seconds'
                                  : 'Km'}
                              </label>
                              <input
                                id={`ex-${ex.id}-target`}
                                type="number"
                                min="1"
                                aria-label={`${ex.targetType === 'reps' ? 'Reps' : ex.targetType === 'duration' ? 'Seconds' : 'Km'} for exercise ${idx + 1}`}
                                value={
                                  ex.targetType === 'reps'
                                    ? (ex.reps !== undefined ? ex.reps : '')
                                    : ex.targetType === 'duration'
                                    ? (ex.durationSeconds !== undefined ? ex.durationSeconds : '')
                                    : (ex.distanceKm !== undefined ? ex.distanceKm : '')
                                }
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                  if (ex.targetType === 'reps') {
                                    handleUpdateExercise(ex.id, { reps: val });
                                  } else if (ex.targetType === 'duration') {
                                    handleUpdateExercise(ex.id, { durationSeconds: val });
                                  } else {
                                    handleUpdateExercise(ex.id, { distanceKm: val });
                                  }
                                }}
                                className="w-full px-2 py-1 rounded-lg border border-[#ECECE9] bg-white text-xs font-semibold text-[#111312]"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-3.5 mt-3 border-t border-[#F4F5F2] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingDayKey(null);
                    setDraftDay(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#F4F5F2] hover:bg-[#EEF0EB] text-xs font-semibold text-[#525650] transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraftDay}
                  className="px-5 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-xs font-bold text-white transition shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. NEW-WEEK CHOICE DIALOG */}
      <AnimatePresence>
        {showNewWeekDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 480, damping: 28 }}
              className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-[#ECECE9] flex flex-col text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E5FBC5] text-[#15803D] flex items-center justify-center mx-auto mb-3">
                <Calendar2 size={24} />
              </div>

              <h3 className="text-lg font-black text-[#111312] tracking-tight mb-1">
                Ready for a new week?
              </h3>
              <p className="text-xs text-[#525650] mb-5 leading-relaxed">
                How would you like to plan your workouts this week?
              </p>

              <div className="flex flex-col gap-3 text-left mb-5">
                {/* Choice 1: Repeat Last Week's Plan */}
                <button
                  type="button"
                  onClick={repeatPreviousWeekPlan}
                  className="p-4 rounded-2xl border-2 border-[#15803D] bg-[#F2FBF0] hover:bg-[#E5FBC5]/50 transition flex flex-col gap-1 active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#15803D]">
                      Repeat Last Week&apos;s Plan
                    </span>
                    <Repeat size={16} className="text-[#15803D]" />
                  </div>
                  <span className="text-xs text-[#525650]">
                    Keep the same exercises and targets for this week.
                  </span>
                </button>

                {/* Choice 2: Create a New Schedule */}
                <button
                  type="button"
                  onClick={createNewWeeklyPlan}
                  className="p-4 rounded-2xl border border-[#ECECE9] bg-white hover:bg-[#F8F8F6] transition flex flex-col gap-1 active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#111312]">
                      Create a New Schedule
                    </span>
                    <Edit2 size={16} className="text-[#525650]" />
                  </div>
                  <span className="text-xs text-[#525650]">
                    Build a different workout plan for this week.
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowNewWeekDialog(false)}
                className="w-full py-2.5 rounded-xl bg-[#F4F5F2] hover:bg-[#EEF0EB] text-xs font-semibold text-[#525650] transition"
              >
                Close & Keep Current
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
