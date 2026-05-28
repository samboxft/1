"use client";
import { useAppStore } from "@/store/useAppStore";
import { Drawing } from "@/types";
import { getDifficultyColor } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Star, PenLine, ChevronRight, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AIFeedbackCard } from "@/components/draw/AIFeedbackCard";

export default function HistoryPage() {
  const { drawings, removeDrawing } = useAppStore();
  const [selected, setSelected] = useState<Drawing | null>(null);

  if (drawings.length === 0) {
    return (
      <div className="px-4 pt-12 pb-4">
        <div className="mb-5">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            Archive
          </p>
          <h1 className="text-2xl font-bold text-neutral-900">History</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <PenLine size={32} className="text-neutral-300" />
          </div>
          <h3 className="font-bold text-neutral-700 text-lg mb-1">No drawings yet</h3>
          <p className="text-sm text-neutral-400 max-w-xs">
            Complete your first daily prompt and your drawings will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-12 pb-4">
      <div className="mb-5">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
          Archive
        </p>
        <h1 className="text-2xl font-bold text-neutral-900">History</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {drawings.length} drawing{drawings.length !== 1 ? "s" : ""} completed
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {drawings.map((drawing) => (
          <button
            key={drawing.id}
            onClick={() => setSelected(drawing)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 text-left active:scale-98 transition-transform"
          >
            <div className="relative aspect-[4/3] bg-neutral-100">
              <Image
                src={drawing.imageUrl}
                alt={drawing.promptText}
                fill
                className="object-cover"
                unoptimized
              />
              {drawing.feedback && (
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Star size={10} className="text-amber-500" fill="currentColor" />
                  <span className="text-xs font-bold text-neutral-800">
                    {drawing.feedback.overallScore}
                  </span>
                </div>
              )}
            </div>
            <div className="p-2.5">
              <p className="text-xs font-semibold text-neutral-700 leading-snug line-clamp-2 mb-1">
                {drawing.promptText}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400">
                  {format(parseISO(drawing.createdAt), "MMM d")}
                </span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${getDifficultyColor(drawing.difficulty)}`}
                >
                  {drawing.difficulty.slice(0, 3)}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-neutral-50 overflow-y-auto">
          <div className="max-w-lg mx-auto pb-8">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-100">
              <h2 className="font-bold text-neutral-900 text-base">Drawing Detail</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm("Delete this drawing?")) {
                      removeDrawing(selected.id);
                      setSelected(null);
                    }
                  }}
                  className="p-2 rounded-xl hover:bg-red-50 active:bg-red-100 transition-colors"
                >
                  <Trash2 size={18} className="text-red-400" />
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-xl hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
                >
                  <X size={18} className="text-neutral-500" />
                </button>
              </div>
            </div>

            <div className="px-4 pt-4 space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100">
                <Image
                  src={selected.imageUrl}
                  alt={selected.promptText}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div>
                <p className="text-xs text-neutral-400 mb-0.5">
                  {format(parseISO(selected.createdAt), "EEEE, MMMM d, yyyy")}
                </p>
                <h3 className="font-bold text-neutral-900 text-base">
                  &ldquo;{selected.promptText}&rdquo;
                </h3>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize inline-block mt-1 ${getDifficultyColor(selected.difficulty)}`}
                >
                  {selected.difficulty}
                </span>
              </div>

              {selected.feedback ? (
                <AIFeedbackCard feedback={selected.feedback} />
              ) : (
                <div className="bg-neutral-100 rounded-2xl p-4 text-center">
                  <p className="text-sm text-neutral-500">No AI feedback available for this drawing.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
