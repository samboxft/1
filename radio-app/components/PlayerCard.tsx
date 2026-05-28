"use client";

import { useEffect, useRef } from "react";
import AudioVisualizer from "./AudioVisualizer";
import type { NowPlaying, PlayerStatus } from "@/hooks/useRadio";

interface Props {
  status: PlayerStatus;
  nowPlaying: NowPlaying | null;
  currentGenre: string | null;
  volume: number;
  analyserNode: AnalyserNode | null;
  onTogglePlay: () => void;
  onVolumeChange: (v: number) => void;
  onSelectGenre: (genre: string) => void;
}

const GENRE_ACCENTS: Record<string, string> = {
  Lofi: "#3b82f6",
  Jazz: "#f59e0b",
  Electronic: "#8b5cf6",
};

const TYPE_LABELS: Record<string, string> = {
  song: "Now Playing",
  "host-intro": "AI Host",
  news: "Hourly News",
};

export default function PlayerCard({
  status,
  nowPlaying,
  currentGenre,
  volume,
  analyserNode,
  onTogglePlay,
  onVolumeChange,
}: Props) {
  const accentColor = GENRE_ACCENTS[currentGenre ?? ""] ?? "#8b5cf6";
  const isPlaying = status === "playing";
  const isLoading = status === "loading";

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-950 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${accentColor}88, transparent 70%)`,
          transition: "background 1s ease",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl flex flex-col gap-8">
        {/* Genre badge */}
        {currentGenre && (
          <div className="flex justify-center">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{ background: accentColor + "22", color: accentColor }}
            >
              {currentGenre} Station
            </span>
          </div>
        )}

        {/* Visualizer */}
        <div className="h-28 w-full rounded-2xl overflow-hidden bg-gray-900/60 border border-white/5">
          <AudioVisualizer
            analyserNode={analyserNode}
            isPlaying={isPlaying}
            accentColor={accentColor}
          />
        </div>

        {/* Track info */}
        <div className="text-center space-y-1">
          {nowPlaying ? (
            <>
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: accentColor }}
              >
                {TYPE_LABELS[nowPlaying.type] ?? "Now Playing"}
              </p>
              <h1 className="text-3xl font-bold text-white truncate">
                {nowPlaying.title}
              </h1>
              <p className="text-gray-400 text-lg">{nowPlaying.artist}</p>
              {nowPlaying.script && nowPlaying.type === "host-intro" && (
                <p className="text-gray-500 text-sm mt-3 italic max-w-md mx-auto leading-relaxed">
                  &ldquo;{nowPlaying.script}&rdquo;
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-gray-600 text-sm uppercase tracking-widest">
                {isLoading ? "Loading station…" : "Select a station to begin"}
              </p>
              <h1 className="text-3xl font-bold text-white">
                {isLoading ? "Tuning in…" : "AuraRadio"}
              </h1>
              <p className="text-gray-500">AI-powered endless music</p>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-5">
          <button
            onClick={onTogglePlay}
            disabled={status === "idle" || isLoading}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all
              border-2 shadow-lg
              ${status === "idle" || isLoading
                ? "opacity-30 cursor-not-allowed border-gray-700"
                : "hover:scale-105 active:scale-95"}`}
            style={
              status !== "idle" && !isLoading
                ? { borderColor: accentColor, boxShadow: `0 0 20px ${accentColor}55` }
                : {}
            }
          >
            {isLoading ? (
              <svg
                className="w-7 h-7 text-gray-400 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : isPlaying ? (
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Volume slider */}
          <div className="flex items-center gap-3 w-64">
            <svg className="w-4 h-4 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor }}
            />
            <svg className="w-4 h-4 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </div>
        </div>

        {/* Status pill */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800">
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying
                  ? "bg-green-400 animate-pulse"
                  : isLoading
                  ? "bg-yellow-400 animate-pulse"
                  : "bg-gray-600"
              }`}
            />
            <span className="text-gray-400 text-xs">
              {isPlaying
                ? "Live"
                : isLoading
                ? "Connecting…"
                : status === "paused"
                ? "Paused"
                : status === "error"
                ? "Error — try another station"
                : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
