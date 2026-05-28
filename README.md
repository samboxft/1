# AI Radio Station

Next.js App Router MVP for an AI-hosted, genre-based radio station. It includes:

- Prisma + SQLite models for genres, songs, 24-hour play rotation, and generated audio cache data.
- `/api/stream` scheduling with an hourly news window, AI host intro chance, and oldest-song fallback.
- Gemini integration with a local fallback when `GEMINI_API_KEY` is not configured.
- Placeholder TTS utilities and generated local WAV files for development playback.
- A Tailwind UI with genre selection, queue playback, and an animated visualizer.

## Setup

```bash
npm install
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

Optional environment variables can be copied from `.env.example`:

- `DATABASE_URL` defaults to `file:./dev.db`.
- `GEMINI_API_KEY` enables live AI host script generation.
- `NEWS_API_KEY` enables live headline fetching; otherwise the news utility uses fallback headlines.
