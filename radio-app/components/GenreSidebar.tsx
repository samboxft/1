"use client";

interface Genre {
  id: number;
  name: string;
  _count: { songs: number };
}

interface Props {
  genres: Genre[];
  currentGenre: string | null;
  onSelect: (genre: string) => void;
  disabled?: boolean;
}

const GENRE_META: Record<string, { emoji: string; color: string; accent: string }> = {
  Lofi: { emoji: "🎵", color: "from-blue-900 to-indigo-800", accent: "bg-blue-500" },
  Jazz: { emoji: "🎷", color: "from-amber-900 to-yellow-800", accent: "bg-amber-500" },
  Electronic: { emoji: "⚡", color: "from-purple-900 to-violet-800", accent: "bg-violet-500" },
};

const DEFAULT_META = { emoji: "🎶", color: "from-gray-900 to-gray-800", accent: "bg-gray-500" };

export default function GenreSidebar({ genres, currentGenre, onSelect, disabled }: Props) {
  return (
    <aside className="w-64 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📻</span>
          <span className="text-white font-bold text-lg tracking-tight">AuraRadio</span>
        </div>
        <p className="text-gray-500 text-xs mt-1">AI-powered endless radio</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="px-3 mb-3 text-gray-500 text-xs font-semibold uppercase tracking-wider">
          Stations
        </p>
        <ul className="space-y-1">
          {genres.map((genre) => {
            const meta = GENRE_META[genre.name] ?? DEFAULT_META;
            const isActive = currentGenre === genre.name;
            return (
              <li key={genre.id}>
                <button
                  onClick={() => !disabled && onSelect(genre.name)}
                  disabled={disabled}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                    ${isActive
                      ? "bg-white/10 text-white shadow-inner"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span
                    className={`w-8 h-8 rounded-md bg-gradient-to-br ${meta.color}
                      flex items-center justify-center text-base shrink-0`}
                  >
                    {meta.emoji}
                  </span>
                  <div className="text-left">
                    <div className="font-medium">{genre.name}</div>
                    <div className="text-xs text-gray-500">{genre._count.songs} tracks</div>
                  </div>
                  {isActive && (
                    <span className="ml-auto flex gap-0.5 items-end h-4">
                      {[3, 5, 4].map((h, i) => (
                        <span
                          key={i}
                          className={`w-1 rounded-full ${meta.accent} animate-pulse`}
                          style={{ height: `${h * 3}px`, animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <p className="text-gray-600 text-xs text-center">
          Powered by Gemini AI · ElevenLabs
        </p>
      </div>
    </aside>
  );
}
