'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Flame,
  Dumbbell,
  Trophy,
  Search,
  Download,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  Activity,
  Calendar,
  Zap,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface AdminStats {
  totalAthletes: number;
  proAthletes: number;
  freeAthletes: number;
  totalWorkouts: number;
  totalCalories: number;
  activeToday: number;
  proRate: number;
}

interface AthleteItem {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  membership: 'Free' | 'Pro';
  level: number;
  xp: number;
  streakDays: number;
  weightKg: number;
  avatarUrl?: string;
  calorieTarget: number;
  waterTargetMl: number;
  exerciseTargetMin: number;
  totalWorkouts: number;
  totalCaloriesBurned: number;
  lastActiveAt?: string;
}

interface RecentWorkout {
  id: string;
  userId: string;
  title: string;
  durationMin: number;
  calories: number;
  category: string;
  createdAt: string;
  userName: string;
  userEmail: string;
}

interface AthleteDossier {
  athlete: AthleteItem;
  workouts: {
    id: string;
    title: string;
    durationMin: number;
    calories: number;
    category: string;
    createdAt: string;
  }[];
  metrics: {
    date: string;
    caloriesBurned: number;
    waterIntakeMl: number;
    exerciseMinutes: number;
    sleepHours: number;
    steps: number;
  }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<RecentWorkout[]>([]);
  const [athletes, setAthletes] = useState<AthleteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMembership, setFilterMembership] = useState<'All' | 'Pro' | 'Free'>('All');
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteDossier | null>(null);
  const [loadingDossier, setLoadingDossier] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setRefreshing(true);
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch(`/api/admin/users?search=${encodeURIComponent(searchQuery)}&membership=${filterMembership}`),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.stats);
          setRecentWorkouts(statsData.recentWorkouts || []);
        }
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        if (usersData.success) {
          setAthletes(usersData.athletes || []);
        }
      }
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, filterMembership]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const inspectAthlete = async (userId: string) => {
    try {
      setLoadingDossier(true);
      const res = await fetch(`/api/admin/user-detail?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSelectedAthlete(data);
        }
      }
    } catch (err) {
      console.error('Failed to load dossier:', err);
    } finally {
      setLoadingDossier(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F0E] text-[#F3F4F6] font-sans antialiased pb-20 selection:bg-[#B8F45A] selection:text-black">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#111312]/90 backdrop-blur-md border-b border-[#222725] px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition flex items-center gap-1.5 text-xs font-medium"
              title="Return to App"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">FitFlow App</span>
            </Link>
            <div className="h-4 w-px bg-neutral-800" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#B8F45A] flex items-center justify-center font-black text-black text-sm">
                FF
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  FitFlow Command Center
                  <span className="bg-[#B8F45A]/15 text-[#B8F45A] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#B8F45A]/30">
                    Live Telemetry
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchDashboardData()}
              disabled={refreshing}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-[#B8F45A] hover:border-[#B8F45A]/40 transition disabled:opacity-50"
              title="Refresh Live DB Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#B8F45A]' : ''}`} />
            </button>
            <a
              href="/api/admin/export"
              download
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-[#B8F45A] text-black hover:bg-[#a6e246] transition shadow-md shadow-[#B8F45A]/10 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        {/* KPI Summary Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5 lg:gap-4">
          {/* Card 1: Total Athletes */}
          <div className="bg-[#151817] border border-[#232926] rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-[#B8F45A]/30 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Total Athletes</span>
              <div className="p-2 rounded-xl bg-neutral-800/80 text-[#B8F45A]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {loading ? '...' : stats?.totalAthletes ?? 0}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                <span className="text-[#B8F45A] font-semibold">{stats?.proAthletes ?? 0} Pro</span>
                <span>• {stats?.freeAthletes ?? 0} Free</span>
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#B8F45A]/5 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Card 2: Active Today */}
          <div className="bg-[#151817] border border-[#232926] rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-[#B8F45A]/30 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Active Today</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                {loading ? '...' : stats?.activeToday ?? 0}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1">Live Database Pulse</div>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Card 3: Total Workouts Logged */}
          <div className="bg-[#151817] border border-[#232926] rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-[#B8F45A]/30 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Workouts Logged</span>
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                <Dumbbell className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {loading ? '...' : stats?.totalWorkouts ?? 0}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">Community sessions</div>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Card 4: Total Calories Burned */}
          <div className="bg-[#151817] border border-[#232926] rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-[#B8F45A]/30 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Calories Burned</span>
              <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {loading ? '...' : (stats?.totalCalories ?? 0).toLocaleString()} <span className="text-xs text-neutral-400 font-normal">kcal</span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">Cumulative volume</div>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
          </div>
        </section>

        {/* Live Community Activity Bar */}
        {recentWorkouts.length > 0 && (
          <section className="bg-[#151817] border border-[#232926] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#B8F45A]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Live Activity Stream (Latest Workouts)
                </h2>
              </div>
              <span className="text-[11px] text-neutral-500">Auto-synced from Postgres</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {recentWorkouts.map((w) => (
                <div
                  key={w.id}
                  className="flex-shrink-0 bg-[#1A1E1C] border border-[#2B332F] rounded-xl px-3.5 py-2.5 min-w-[210px] hover:border-[#B8F45A]/40 transition cursor-pointer"
                  onClick={() => inspectAthlete(w.userId)}
                >
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="font-semibold text-white truncate max-w-[120px]">{w.userName}</span>
                    <span className="text-[10px] text-neutral-500">{new Date(w.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="text-xs font-bold text-[#B8F45A] mt-1 truncate">{w.title}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-2">
                    <span>{w.durationMin}m</span>
                    <span>•</span>
                    <span className="text-red-400">{w.calories} kcal</span>
                    <span>•</span>
                    <span className="text-neutral-500">{w.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Athletes Directory Section */}
        <section className="bg-[#151817] border border-[#232926] rounded-2xl overflow-hidden shadow-xl">
          {/* Filter and Search Bar */}
          <div className="p-4 sm:p-5 border-b border-[#232926] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search athlete by name, email, or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1A1E1C] border border-[#2B332F] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#B8F45A] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 hidden lg:inline">Tier:</span>
              {(['All', 'Pro', 'Free'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFilterMembership(tier)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition ${
                    filterMembership === tier
                      ? 'bg-[#B8F45A] text-black border-[#B8F45A] font-bold'
                      : 'bg-[#1A1E1C] text-neutral-400 border-[#2B332F] hover:text-white'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111312] border-b border-[#232926] text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Athlete</th>
                  <th className="py-3 px-4">Membership</th>
                  <th className="py-3 px-4">Level / XP</th>
                  <th className="py-3 px-4">Streak</th>
                  <th className="py-3 px-4">Workouts</th>
                  <th className="py-3 px-4">Total Cals</th>
                  <th className="py-3 px-4">Daily Goal</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232926] text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-500">
                      Loading athletes roster...
                    </td>
                  </tr>
                ) : athletes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-500">
                      No athletes found matching your search.
                    </td>
                  </tr>
                ) : (
                  athletes.map((a) => (
                    <tr key={a.id} className="hover:bg-[#1A1E1C]/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-800 border border-[#2B332F] flex items-center justify-center font-bold text-white text-xs">
                            {a.name ? a.name.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{a.name || 'Athlete'}</div>
                            <div className="text-[11px] text-neutral-400 font-mono">{a.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            a.membership === 'Pro'
                              ? 'bg-[#B8F45A]/15 text-[#B8F45A] border-[#B8F45A]/30'
                              : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                          }`}
                        >
                          {a.membership}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        <div className="text-white">Level {a.level}</div>
                        <div className="text-[10px] text-neutral-400">{a.xp} XP</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-orange-400 font-semibold flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" />
                          {a.streakDays}d
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {a.totalWorkouts}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-red-400">
                        {a.totalCaloriesBurned.toLocaleString()} kcal
                      </td>
                      <td className="py-3.5 px-4 text-neutral-300">
                        {a.calorieTarget} kcal / {a.exerciseTargetMin}m
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => inspectAthlete(a.id)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-[#B8F45A] hover:text-black text-neutral-300 text-xs font-semibold transition"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Athlete Dossier Inspection Modal */}
      {selectedAthlete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151817] border border-[#2B332F] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-[#232926] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#B8F45A] text-black font-black text-xl flex items-center justify-center">
                  {selectedAthlete.athlete.name ? selectedAthlete.athlete.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {selectedAthlete.athlete.name}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B8F45A]/15 text-[#B8F45A] border border-[#B8F45A]/30">
                      {selectedAthlete.athlete.membership}
                    </span>
                  </h3>
                  <div className="text-xs text-neutral-400 font-mono mt-0.5">{selectedAthlete.athlete.email}</div>
                  <div className="text-[10px] text-neutral-500 font-mono">ID: {selectedAthlete.athlete.id}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedAthlete(null)}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#1A1E1C] border border-[#2B332F] rounded-xl p-3 text-center">
                <div className="text-[11px] text-neutral-400">Current Level</div>
                <div className="text-lg font-bold text-white mt-0.5">Level {selectedAthlete.athlete.level}</div>
                <div className="text-[10px] text-neutral-500">{selectedAthlete.athlete.xp} XP</div>
              </div>
              <div className="bg-[#1A1E1C] border border-[#2B332F] rounded-xl p-3 text-center">
                <div className="text-[11px] text-neutral-400">Active Streak</div>
                <div className="text-lg font-bold text-orange-400 mt-0.5">{selectedAthlete.athlete.streakDays} Days</div>
                <div className="text-[10px] text-neutral-500">Unbroken</div>
              </div>
              <div className="bg-[#1A1E1C] border border-[#2B332F] rounded-xl p-3 text-center">
                <div className="text-[11px] text-neutral-400">Daily Target</div>
                <div className="text-lg font-bold text-white mt-0.5">{selectedAthlete.athlete.calorieTarget} kcal</div>
                <div className="text-[10px] text-neutral-500">{selectedAthlete.athlete.waterTargetMl}ml water</div>
              </div>
              <div className="bg-[#1A1E1C] border border-[#2B332F] rounded-xl p-3 text-center">
                <div className="text-[11px] text-neutral-400">Body Weight</div>
                <div className="text-lg font-bold text-white mt-0.5">{selectedAthlete.athlete.weightKg} kg</div>
                <div className="text-[10px] text-neutral-500">Recorded</div>
              </div>
            </div>

            {/* Workout History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3 flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-[#B8F45A]" />
                Workout Logs ({selectedAthlete.workouts.length})
              </h4>
              {selectedAthlete.workouts.length === 0 ? (
                <div className="text-xs text-neutral-500 bg-[#1A1E1C] p-4 rounded-xl text-center">
                  No workouts recorded yet for this athlete.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedAthlete.workouts.map((w) => (
                    <div
                      key={w.id}
                      className="flex items-center justify-between p-3 bg-[#1A1E1C] border border-[#2B332F] rounded-xl text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{w.title}</div>
                        <div className="text-[11px] text-neutral-400">
                          {w.category} • {w.durationMin} mins • {new Date(w.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-red-400">{w.calories} kcal</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#232926] pt-4 flex justify-end">
              <button
                onClick={() => setSelectedAthlete(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-700 transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
