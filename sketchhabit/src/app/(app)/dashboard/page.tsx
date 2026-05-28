"use client";
import { useEffect } from "react";
import { StreakCounter } from "@/components/dashboard/StreakCounter";
import { CalendarView } from "@/components/dashboard/CalendarView";
import { DailyPromptCard } from "@/components/dashboard/DailyPromptCard";
import { InspirationCard } from "@/components/dashboard/InspirationCard";
import { useAppStore } from "@/store/useAppStore";
import { format } from "date-fns";

export default function DashboardPage() {
  const computeStreak = useAppStore((s) => s.computeStreak);

  useEffect(() => {
    computeStreak();
  }, [computeStreak]);

  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <div className="px-4 pt-12 pb-4 space-y-4">
      {/* Header */}
      <div className="mb-2">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          {today}
        </p>
        <h1 className="text-2xl font-bold text-neutral-900 leading-tight">
          Good day, Artist! ✏️
        </h1>
      </div>

      {/* Streak */}
      <StreakCounter />

      {/* Daily Prompt */}
      <DailyPromptCard />

      {/* Inspiration */}
      <section>
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">
          Daily Inspiration
        </h2>
        <InspirationCard />
      </section>

      {/* Calendar */}
      <section>
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">
          Your Practice Calendar
        </h2>
        <CalendarView />
      </section>
    </div>
  );
}
