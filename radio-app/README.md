# AuraRadio 📻

An AI-powered, continuous web radio station built with Next.js, Prisma, Google Gemini, and ElevenLabs. Inspired by AccuRadio.

## Features

- **Endless playback** — Automatically queues the next track when a song ends; no gaps, no interruptions.
- **24-hour scheduling** — Each song can only be played once every 24 hours (resets automatically when the pool is exhausted).
- **AI Host intros** — 20% of songs are preceded by a short Gemini-generated backstory voiced by ElevenLabs or Google TTS, then cached to save API costs.
- **Hourly news broadcasts** — Every hour (minutes 00–04) the player switches to a synthesised news bulletin, then returns to music. Generated once per hour and cached.
- **Gapless playback** — The next audio track is pre-loaded while the current one is playing.
- **Audio visualizer** — A real-time frequency bar visualiser powered by the Web Audio API.
- **Three genre stations** — Lofi, Jazz, and Electronic (easily extensible).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Database | Prisma 7 ORM + SQLite (`better-sqlite3`) |
| AI Host | Google Gemini API (`@google/genai`) |
| TTS | ElevenLabs API (primary) · Google Cloud TTS (fallback) |
| News | NewsAPI.org |
| Styling | Tailwind CSS v4 |
| Audio | HTML5 Web Audio API |

## Quick Start

### 1. Install dependencies

```bash
cd radio-app
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your API keys:

```bash
cp .env.local.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | SQLite path, e.g. `file:./dev.db` |
| `GEMINI_API_KEY` | Recommended | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `ELEVENLABS_API_KEY` | Optional | [ElevenLabs](https://elevenlabs.io) — best voice quality |
| `ELEVENLABS_VOICE_ID` | Optional | Defaults to Adam (`pNInz6obpgDQGcFmaJgB`) |
| `GOOGLE_TTS_API_KEY` | Optional | Fallback TTS if ElevenLabs is not set |
| `NEWS_API_KEY` | Optional | [NewsAPI](https://newsapi.org/register) — uses built-in fallback headlines if not set |

### 3. Run migrations & seed the database

```bash
npx prisma db push
npm run db:seed
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click a genre to start listening.

## Adding Real Music

The seed data uses placeholder `/music/*.mp3` paths. To use real tracks:

1. Download royalty-free music from [Pixabay](https://pixabay.com/music/) or [Incompetech](https://incompetech.com/music/).
2. Place the files in `public/music/` (e.g. `public/music/lofi-01.mp3`).
3. Update `prisma/seed.ts` with the correct filenames and artists.
4. Re-run the seed: `npm run db:seed`.

Alternatively, host files on S3 or any CDN and use the full URL in `audioUrl`.

## Project Structure

```
radio-app/
├── app/
│   ├── api/
│   │   ├── genres/route.ts   # Lists all genres
│   │   ├── news/route.ts     # Triggers news generation
│   │   └── stream/route.ts   # Core: scheduling + AI host
│   ├── generated/prisma/     # Auto-generated Prisma client
│   ├── layout.tsx
│   └── page.tsx              # Main radio UI
├── components/
│   ├── AudioVisualizer.tsx   # Canvas-based frequency bars
│   ├── GenreSidebar.tsx      # Station selection sidebar
│   └── PlayerCard.tsx        # Now-playing display + controls
├── hooks/
│   └── useRadio.ts           # Core audio state machine
├── lib/
│   ├── news.ts               # Hourly news generation + caching
│   ├── prisma.ts             # Prisma singleton
│   └── tts.ts                # ElevenLabs / Google TTS adapter
├── prisma/
│   ├── schema.prisma         # Data models
│   └── seed.ts               # Demo data
└── public/
    └── music/                # Place your .mp3 files here
```

## API Reference

### `GET /api/stream?genre=<name>`

Returns an array of `AudioItem` objects to play in sequence.

**Response shape:**
```json
[
  {
    "type": "host-intro",
    "audioUrl": "data:audio/mpeg;base64,...",
    "script": "Tonight on the Lofi station..."
  },
  {
    "type": "song",
    "audioUrl": "/music/lofi-01.mp3",
    "title": "Midnight Cafe",
    "artist": "Chillhop Music",
    "genre": "Lofi"
  }
]
```

**Special cases:**
- If `minute < 5` → returns a `news` item instead
- If all songs in genre were played in the last 24 h → resets the oldest played song

### `GET /api/genres`

Returns all genres with song counts.

### `GET /api/news`

Forces generation (or returns cached) of the hourly news broadcast.

## Cost Management

- **TTS** — AI host scripts and audio are cached per-song in the database (`hostScript`, `hostAudioUrl`). A song's intro is only generated once.
- **News** — Generated at most once per hour (`NewsCache` table).
- **Gemini** — Called at most once per song per lifetime.

## Deployment

The app can be deployed to Vercel with minimal configuration. Switch `DATABASE_URL` to a PostgreSQL connection string (e.g. Neon, Supabase) and swap the Prisma adapter from `@prisma/adapter-better-sqlite3` to `@prisma/adapter-pg`.
