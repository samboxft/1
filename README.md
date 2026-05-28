# Cursor Radio (Next.js + Prisma)

An AccuRadio-style web player that continuously streams:

- genre-based songs (`Lofi`, `Jazz`, `Electronic`)
- an hourly news segment (minutes `00-05`)
- optional AI host intros (20% chance before a song)

## Tech Stack

- **Frontend**: Next.js App Router + React + TypeScript + Tailwind CSS
- **Backend/API**: Next.js route handlers (`app/api/stream/route.ts`)
- **Database**: Prisma ORM + SQLite
- **AI Host Script**: Google Gemini (`@google/genai`)
- **TTS**: placeholder `generateTTS(text)` function (ready to swap for ElevenLabs/Google TTS)
- **News Source**: NewsAPI (with fallback headlines if no key is configured)

## Prisma Models

- `Genre` (1:N with songs)
- `Song` (`lastPlayedAt` enforces the 24-hour replay rule)
- `HostIntro` (cached host script/audio by `songId` for cost control)

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Run migration + seed:

   ```bash
   npm run prisma:migrate -- --name init_radio_schema
   npm run prisma:seed
   ```

4. Start development server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`.

## API Contract

`GET /api/stream?genre=Lofi`

- During news window (minute 00–05): returns `type: "news"` with a single news audio item.
- Otherwise: returns `type: "music"` with either:
  - `[song]`, or
  - `[hostIntro, song]` when AI host chance hits.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | yes | SQLite path, e.g. `file:./dev.db` |
| `GEMINI_API_KEY` | optional | Enables Gemini-generated host scripts |
| `GEMINI_MODEL` | optional | Defaults to `gemini-2.5-flash` |
| `NEWS_API_KEY` | optional | Enables live top headlines from NewsAPI |
| `TTS_PLACEHOLDER_URL` | optional | Placeholder MP3 returned by `generateTTS` |

## Notes

- `generateTTS(text)` currently returns a placeholder URL by design.
- News audio is cached in-memory once per hour.
- Host intro audio/script is cached in the database per song.
