"use client";
import { useAppStore } from "@/store/useAppStore";
import { Flame, Zap } from "lucide-react";

export function StreakCounter() {
  const stats = useAppStore((s) => s.stats);

  return (
    <div className="flex gap-3">
      {/* Current Streak */}
      <div className="flex-1 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 text-white shadow-md shadow-amber-100">
        <div className="flex items-center gap-1.5 mb-1">
          <Flame size={16} className="text-orange-200" />
          <span className="text-xs font-medium text-orange-100 uppercase tracking-wider">Streak</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tabular-nums">{stats.currentStreak}</span>
          <span className="text-orange-200 text-sm font-medium">days</span>
        </div>
        <p className="text-xs text-orange-100 mt-1">
          {stats.currentStreak === 0
            ? "Start your streak today!"
            : stats.currentStreak < 7
            ? "Keep it up! 🔥"
            : stats.currentStreak < 30
            ? "You're on fire! 🚀"
            : "Legend status! 👑"}
        </p>
      </div>

      {/* Best / Total stats */}
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex-1 bg-white rounded-2xl p-3 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-1 mb-0.5">
            <Zap size={14} className="text-violet-500" />
            <span className="text-xs text-neutral-400 font-medium">Best</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-neutral-800 tabular-nums">
              {stats.longestStreak}
            </span>
            <span className="text-xs text-neutral-400">days</span>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-2xl p-3 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-xs">✏️</span>
            <span className="text-xs text-neutral-400 font-medium">Total</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-neutral-800 tabular-nums">
              {stats.totalDrawings}
            </span>
            <span className="text-xs text-neutral-400">drawings</span>
          </div>
        </div>
      </div>
    </div>
  );
}
