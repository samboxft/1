"use client";
import { getTodayInspiration } from "@/lib/prompts/inspirations";
import { Quote } from "lucide-react";
import Image from "next/image";

export function InspirationCard() {
  const inspiration = getTodayInspiration();

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
      {/* Artwork */}
      <div className="relative h-36 w-full bg-neutral-100">
        <Image
          src={inspiration.artworkUrl}
          alt={inspiration.artworkTitle}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-white text-xs font-medium truncate">
            <span className="font-semibold">{inspiration.artworkTitle}</span>
            {" · "}
            <span className="text-white/75">{inspiration.artworkArtist}</span>
          </p>
        </div>
      </div>

      {/* Quote */}
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          <Quote size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-neutral-700 italic leading-relaxed font-medium">
            {inspiration.quote}
          </p>
        </div>
        <p className="text-xs text-neutral-400 ml-6">— {inspiration.author}</p>

        <div className="mt-3 bg-amber-50 rounded-xl p-3 border border-amber-100">
          <p className="text-xs font-semibold text-amber-700 mb-0.5">💡 Daily Tip</p>
          <p className="text-xs text-amber-800 leading-relaxed">{inspiration.tip}</p>
        </div>
      </div>
    </div>
  );
}
