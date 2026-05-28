"use client";

import { GENRES, type Genre, useRadio } from "@/hooks/useRadio";

function AudioVisualizer({ active }: { active: boolean }) {
  return (
    <div className="flex h-20 items-end justify-center gap-1">
      {Array.from({ length: 20 }).map((_, index) => (
        <span
          key={index}
          className={`visualizer-bar ${active ? "visualizer-bar--active" : ""}`}
          style={{ animationDelay: `${index * 70}ms` }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const {
    audioRef,
    currentItem,
    error,
    handleEnded,
    handleGenreChange,
    isLoading,
    isPlaying,
    queue,
    selectedGenre,
    setIsPlaying,
  } = useRadio();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        <aside className="w-56 border-r border-slate-800 bg-slate-900/50 p-6">
          <h1 className="mb-6 text-xl font-semibold">Cursor Radio</h1>
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">Genres</p>
          <nav className="space-y-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                  selectedGenre === genre
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800/80 hover:bg-slate-700"
                }`}
                onClick={() => handleGenreChange(genre as Genre)}
                type="button"
              >
                {genre}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/30">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Now Playing</p>
            <h2 className="mt-4 text-3xl font-semibold">
              {currentItem?.title ?? (isLoading ? "Loading station..." : "Waiting for stream")}
            </h2>
            <p className="mt-2 text-slate-300">{currentItem?.artist ?? selectedGenre}</p>
            <p className="mt-1 text-sm text-slate-400">
              {currentItem?.kind === "news"
                ? "Hourly News Broadcast"
                : currentItem?.kind === "host"
                  ? "AI Host Segment"
                  : `${selectedGenre} rotation`}
            </p>

            <div className="mt-8">
              <AudioVisualizer active={isPlaying} />
            </div>

            <audio
              ref={audioRef}
              autoPlay
              className="mt-8 w-full"
              controls
              onEnded={handleEnded}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              src={currentItem?.audioUrl}
            />

            <div className="mt-4 text-sm text-slate-400">
              Queue length: <span className="font-medium text-slate-200">{queue.length}</span>
            </div>
            {error && <p className="mt-3 text-sm text-rose-300">Error: {error}</p>}
          </div>
        </main>
      </div>
    </div>
  );
}
