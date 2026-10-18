import React from 'react';

interface SkeletonProps {
  className?: string;
  rounded?: 'rounded-md' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
}

export function Skeleton({ className = '', rounded = 'rounded-xl' }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading..."
      className={`animate-pulse bg-[#E6E8E2] dark:bg-[#252824] ${rounded} ${className}`}
    />
  );
}

export function TextSkeleton({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3.5 ${
            i === lines - 1 ? 'w-3/5' : i === 0 ? 'w-4/5' : 'w-full'
          }`}
          rounded="rounded-md"
        />
      ))}
    </div>
  );
}

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-full bg-white rounded-2xl p-5 border border-[#ECECE9] shadow-2xs flex flex-col gap-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" rounded="rounded-md" />
        <Skeleton className="h-6 w-14" rounded="rounded-full" />
      </div>
      <Skeleton className="h-10 w-36 my-1" rounded="rounded-md" />
      <Skeleton className="h-2 w-full" rounded="rounded-full" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full p-4 animate-in fade-in duration-300">
      {/* Top Bar Skeleton */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10" rounded="rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-20" rounded="rounded-md" />
            <Skeleton className="h-4 w-32" rounded="rounded-md" />
          </div>
        </div>
        <Skeleton className="w-9 h-9" rounded="rounded-full" />
      </div>

      {/* Streak Hero Card */}
      <div className="w-full bg-white rounded-2xl p-5 border border-[#ECECE9] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-24" rounded="rounded-md" />
          <Skeleton className="h-5 w-16" rounded="rounded-full" />
        </div>
        <Skeleton className="h-9 w-28" rounded="rounded-md" />
        <Skeleton className="h-2 w-full" rounded="rounded-full" />
      </div>

      {/* Metric Cards Bento Grid */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Workout Card Skeleton */}
      <div className="w-full bg-white rounded-2xl p-5 border border-[#ECECE9] flex flex-col gap-3">
        <Skeleton className="h-4 w-36" rounded="rounded-md" />
        <Skeleton className="h-14 w-full" rounded="rounded-xl" />
        <Skeleton className="h-11 w-full" rounded="rounded-xl" />
      </div>
    </div>
  );
}

export function PlannerSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full p-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between py-2">
        <Skeleton className="h-6 w-36" rounded="rounded-md" />
        <Skeleton className="h-8 w-24" rounded="rounded-xl" />
      </div>

      {/* 7-day pill bar */}
      <div className="grid grid-cols-7 gap-1.5 w-full bg-white p-3 rounded-2xl border border-[#ECECE9]">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-18 w-full" rounded="rounded-xl" />
        ))}
      </div>

      {/* Day detail card */}
      <div className="w-full bg-white rounded-2xl p-5 border border-[#ECECE9] flex flex-col gap-3">
        <Skeleton className="h-5 w-40" rounded="rounded-md" />
        <Skeleton className="h-12 w-full" rounded="rounded-xl" />
        <Skeleton className="h-12 w-full" rounded="rounded-xl" />
        <Skeleton className="h-11 w-full" rounded="rounded-xl" />
      </div>
    </div>
  );
}
