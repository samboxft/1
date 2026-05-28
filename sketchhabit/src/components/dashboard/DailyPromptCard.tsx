"use client";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { getTodayPrompt } from "@/lib/prompts/dailyPrompts";
import { getDifficultyColor } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowRight, Lightbulb, Lock } from "lucide-react";

export function DailyPromptCard() {
  const stats = useAppStore((s) => s.stats);
  const today = format(new Date(), "yyyy-MM-dd");
  const alreadyDone = stats.completedDates.includes(today);
  const prompt = getTodayPrompt(stats.currentStreak, today);

  const UNLOCK_THRESHOLDS = [
    { streak: 5, label: "Intermediate prompts" },
    { streak: 14, label: "Advanced prompts" },
    { streak: 30, label: "Expert prompts" },
  ];

  const nextUnlock = UNLOCK_THRESHOLDS.find((t) => stats.currentStreak < t.streak);

  return (
    <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl p-5 text-white shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Today&apos;s Prompt
          </p>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${getDifficultyColor(prompt.difficulty)}`}
          >
            {prompt.difficulty}
          </span>
        </div>
        {alreadyDone && (
          <div className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <span>✓</span>
            <span>Done!</span>
          </div>
        )}
      </div>

      <p className="text-xl font-bold text-white leading-snug mb-3">
        &ldquo;{prompt.text}&rdquo;
      </p>

      {prompt.hint && (
        <div className="flex gap-2 bg-white/10 rounded-xl p-3 mb-4">
          <Lightbulb size={14} className="text-amber-300 shrink-0 mt-0.5" />
          <p className="text-xs text-stone-300 leading-relaxed">{prompt.hint}</p>
        </div>
      )}

      {nextUnlock && (
        <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-3">
          <Lock size={11} />
          <span>
            {nextUnlock.streak - stats.currentStreak} days to unlock{" "}
            {nextUnlock.label}
          </span>
        </div>
      )}

      <Link
        href="/draw"
        className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
      >
        <span>{alreadyDone ? "Draw Again" : "Start Drawing"}</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
