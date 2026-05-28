"use client";
import { AIFeedback } from "@/types";
import { getFocusIcon } from "@/lib/utils";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Props {
  feedback: AIFeedback;
}

export function AIFeedbackCard({ feedback }: Props) {
  const [showExercises, setShowExercises] = useState(true);

  const scoreColor =
    feedback.overallScore >= 80
      ? "text-emerald-600"
      : feedback.overallScore >= 60
      ? "text-amber-600"
      : "text-orange-600";

  const scoreLabel =
    feedback.overallScore >= 80
      ? "Great work!"
      : feedback.overallScore >= 60
      ? "Good progress!"
      : "Keep practicing!";

  return (
    <div className="space-y-3">
      {/* Score card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-neutral-800 text-base">AI Feedback</h3>
          <div className="flex items-center gap-1.5">
            <Star size={14} className={scoreColor} fill="currentColor" />
            <span className={`text-lg font-bold tabular-nums ${scoreColor}`}>
              {feedback.overallScore}
            </span>
            <span className="text-xs text-neutral-400">/100</span>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 mb-3">
          <p className="text-xs font-semibold text-emerald-700 mb-1">
            ✨ {scoreLabel}
          </p>
          <p className="text-sm text-emerald-800 leading-relaxed">{feedback.praise}</p>
        </div>

        {/* Areas to improve */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Focus On
          </p>
          <ul className="space-y-1.5">
            {feedback.areasToImprove.map((area, i) => (
              <li key={i} className="flex gap-2 text-sm text-neutral-700">
                <span className="text-amber-500 font-bold shrink-0 mt-px">→</span>
                <span className="leading-snug">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Micro-exercises */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <button
          onClick={() => setShowExercises((v) => !v)}
          className="w-full flex items-center justify-between p-4 active:bg-neutral-50"
        >
          <div>
            <h3 className="font-bold text-neutral-800 text-base text-left">
              Custom Exercises
            </h3>
            <p className="text-xs text-neutral-400 text-left">
              {feedback.exercises.length} micro-exercises for you
            </p>
          </div>
          {showExercises ? (
            <ChevronUp size={18} className="text-neutral-400" />
          ) : (
            <ChevronDown size={18} className="text-neutral-400" />
          )}
        </button>

        {showExercises && (
          <div className="px-4 pb-4 space-y-3">
            {feedback.exercises.map((exercise, i) => (
              <div
                key={i}
                className="bg-neutral-50 rounded-xl p-3 border border-neutral-100"
              >
                <div className="flex items-start gap-2 mb-1.5">
                  <span className="text-lg leading-none mt-0.5">
                    {getFocusIcon(exercise.focus)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-neutral-800 leading-tight">
                        {exercise.title}
                      </p>
                      <span className="text-xs text-neutral-400 shrink-0 bg-white border border-neutral-200 px-2 py-0.5 rounded-full">
                        {exercise.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed pl-7">
                  {exercise.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
