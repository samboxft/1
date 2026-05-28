"use client";

import { useRadio } from "@/hooks/useRadio";

const GENRES = ["Lofi", "Jazz", "Electronic"];
const VISUALIZER_BARS = Array.from({ length: 36 }, (_, index) => index);

export default function Home() {
  const {
    audioRef,
    currentItem,
    error,
    handleEnded,
    playGenre,
    queue,
    selectedGenre,
    status,
    togglePlayback,
  } = useRadio();

  const isPlaying = status === "playing" || status === "loading";

  return (
    <main className="min-h-screen px-4 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-2xl shadow-sky-950/40 backdrop-blur lg:grid-cols-[18rem_1fr]">
        <aside className="border-b border-white/10 bg-white/[0.03] p-6 lg:border-b-0 lg:border-r">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            AI Radio
          </p>
          <h1 className="mt-4 text-3xl font-black leading-tight text-white">
            Endless stations with hourly news.
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Pick a genre and the station will keep pulling the next scheduled
            track, AI host intro, or news broadcast.
          </p>

          <div className="mt-8 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
              Genres
            </p>
            {GENRES.map((genre) => {
              const active = selectedGenre === genre;

              return (
                <button
                  key={genre}
                  className={`w-full rounded-2xl border px-4 py-3 text-left font-semibold transition ${
                    active
                      ? "border-sky-300 bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/20"
                      : "border-white/10 bg-white/5 text-slate-200 hover:border-sky-300/60 hover:bg-white/10"
                  }`}
                  type="button"
                  onClick={() => void playGenre(genre)}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex flex-col p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
                {selectedGenre} Station
              </p>
              <h2 className="mt-2 text-4xl font-black text-white sm:text-5xl">
                {currentItem?.title ?? "Choose a station"}
              </h2>
              <p className="mt-3 text-lg text-slate-300">
                {currentItem?.artist ??
                  (currentItem?.type === "news"
                    ? "Hourly World News"
                    : "Ready when you are")}
              </p>
            </div>

            <button
              className="rounded-full border border-white/10 bg-white px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={!currentItem}
              onClick={togglePlayback}
            >
              {status === "paused" ? "Resume" : "Pause"}
            </button>
          </div>

          <div className="mt-10 flex flex-1 flex-col justify-center rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-6">
            <div className="flex h-64 items-end justify-center gap-2 sm:gap-3">
              {VISUALIZER_BARS.map((bar) => (
                <span
                  key={bar}
                  className={`visualizer-bar h-44 w-2 rounded-full bg-gradient-to-t from-sky-500 to-fuchsia-300 sm:w-3 ${
                    isPlaying ? "" : "[animation-play-state:paused]"
                  }`}
                  style={{ animationDelay: `${bar * 0.045}s` }}
                />
              ))}
            </div>

            <div className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-300 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Status
                </p>
                <p className="mt-2 font-semibold capitalize text-white">
                  {status}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Now Playing
                </p>
                <p className="mt-2 font-semibold text-white">
                  {currentItem?.type ?? "None"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Queue
                </p>
                <p className="mt-2 font-semibold text-white">
                  {queue.length} item{queue.length === 1 ? "" : "s"} buffered
                </p>
              </div>
            </div>

            {currentItem?.script ? (
              <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                {currentItem.script}
              </p>
            ) : null}

            {error ? (
              <p className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
                {error}
              </p>
            ) : null}
          </div>

          <audio ref={audioRef} onEnded={handleEnded} preload="auto" />
        </section>
      </div>
    </main>
  );
}
