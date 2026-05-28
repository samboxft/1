"use client";
import Link from "next/link";
import { ArrowRight, Flame, Sparkles, BookOpen, Camera } from "lucide-react";

const FEATURES = [
  {
    icon: Flame,
    title: "Daily Streaks",
    description: "Build a consistent drawing habit with streak tracking and a visual calendar.",
    color: "bg-orange-50 text-orange-500",
  },
  {
    icon: Camera,
    title: "Snap & Upload",
    description: "Take a photo of your pencil drawing right from your phone.",
    color: "bg-blue-50 text-blue-500",
  },
  {
    icon: Sparkles,
    title: "AI Feedback",
    description: "Get personalized critiques and custom micro-exercises from an AI art teacher.",
    color: "bg-violet-50 text-violet-500",
  },
  {
    icon: BookOpen,
    title: "Video Tutorials",
    description: "Learn shading, perspective, and proportion from curated video lessons.",
    color: "bg-emerald-50 text-emerald-500",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        {/* Logo mark */}
        <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-amber-200">
          <span className="text-4xl">✏️</span>
        </div>

        <h1 className="text-4xl font-black text-neutral-900 leading-tight mb-2">
          SketchHabit
        </h1>
        <p className="text-lg font-medium text-neutral-500 mb-1">
          Daily drawing. Real improvement.
        </p>
        <p className="text-sm text-neutral-400 max-w-xs leading-relaxed mb-8">
          Build the habit of pencil drawing, get AI-powered feedback on your sketches, and watch your skills grow—one day at a time.
        </p>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-md shadow-amber-100 transition-all active:scale-95"
        >
          Start Drawing Today
          <ArrowRight size={18} />
        </Link>

        <p className="text-xs text-neutral-400 mt-3">Free · No account required</p>
      </div>

      {/* Feature list */}
      <div className="px-5 pb-10 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider text-center mb-4">
          Everything you need
        </p>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 ${color}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-neutral-800 text-sm mb-1">{title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
