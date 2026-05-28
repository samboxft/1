"use client";
import { TUTORIALS } from "@/lib/prompts/tutorials";
import { getDifficultyColor } from "@/lib/utils";
import { Play, Clock, Tag, X } from "lucide-react";
import { useState } from "react";
import { Tutorial } from "@/types";
import Image from "next/image";

export default function TutorialsPage() {
  const [activeVideo, setActiveVideo] = useState<Tutorial | null>(null);

  return (
    <div className="px-4 pt-12 pb-4">
      <div className="mb-5">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
          Skill Building
        </p>
        <h1 className="text-2xl font-bold text-neutral-900">Tutorials</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Hand-picked lessons for pencil drawing fundamentals
        </p>
      </div>

      {/* Video cards */}
      <div className="space-y-4">
        {TUTORIALS.map((tutorial) => (
          <div
            key={tutorial.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-neutral-200">
              <Image
                src={tutorial.thumbnail}
                alt={tutorial.title}
                fill
                className="object-cover"
                unoptimized
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Play button */}
              <button
                onClick={() => setActiveVideo(tutorial)}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="w-16 h-16 rounded-full bg-white/90 group-active:bg-white flex items-center justify-center shadow-lg transition-transform group-active:scale-95">
                  <Play size={24} className="text-amber-600 ml-1" fill="currentColor" />
                </div>
              </button>

              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                {tutorial.duration}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-neutral-900 text-sm leading-snug flex-1">
                  {tutorial.title}
                </h3>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${getDifficultyColor(tutorial.level)}`}
                >
                  {tutorial.level}
                </span>
              </div>

              <p className="text-sm text-neutral-500 leading-relaxed mb-3">
                {tutorial.description}
              </p>

              {/* Topics */}
              <div className="flex flex-wrap gap-1.5">
                {tutorial.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setActiveVideo(tutorial)}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                <Play size={15} fill="currentColor" />
                Watch Lesson
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Video modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          {/* Modal header */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/90">
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-white font-semibold text-sm truncate">{activeVideo.title}</p>
            </div>
            <button
              onClick={() => setActiveVideo(null)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 active:bg-white/30 transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {/* YouTube embed */}
          <div className="flex-1 bg-black flex items-center">
            <div className="w-full aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Bottom info */}
          <div className="bg-black/90 px-4 py-3">
            <p className="text-white/70 text-sm leading-relaxed">{activeVideo.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {activeVideo.topics.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
