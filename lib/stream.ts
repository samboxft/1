import { GoogleGenAI } from "@google/genai";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { generateTTS } from "@/lib/tts";

export const SUPPORTED_GENRES = ["Lofi", "Jazz", "Electronic"] as const;

export type SupportedGenre = (typeof SUPPORTED_GENRES)[number];

export type StreamQueueItem = {
  kind: "host" | "song" | "news";
  title: string;
  artist: string;
  genre: string;
  audioUrl: string;
  script?: string;
  songId?: number;
};

type SongWithGenre = Prisma.SongGetPayload<{
  include: { genre: true };
}>;

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const HOST_CHANCE = 0.2;

export function resolveGenreName(rawGenre: string | null): SupportedGenre {
  if (!rawGenre) {
    return "Lofi";
  }

  const normalized = rawGenre.trim().toLowerCase();
  const match = SUPPORTED_GENRES.find((genre) => genre.toLowerCase() === normalized);

  return match ?? "Lofi";
}

export function isNewsWindow(now: Date): boolean {
  return now.getMinutes() >= 0 && now.getMinutes() <= 5;
}

function pickRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

async function getNextSongForGenre(genreName: SupportedGenre, now: Date): Promise<SongWithGenre> {
  return prisma.$transaction(async (tx) => {
    const genre = await tx.genre.findUnique({
      where: { name: genreName },
    });

    if (!genre) {
      throw new Error(`Genre "${genreName}" is not seeded in the database.`);
    }

    const twentyFourHoursAgo = new Date(now.getTime() - TWENTY_FOUR_HOURS_MS);

    const eligibleSongs = await tx.song.findMany({
      where: {
        genreId: genre.id,
        OR: [{ lastPlayedAt: null }, { lastPlayedAt: { lt: twentyFourHoursAgo } }],
      },
    });

    const selectedSong =
      eligibleSongs.length > 0
        ? pickRandomItem(eligibleSongs)
        : await tx.song.findFirst({
            where: { genreId: genre.id },
            orderBy: [{ lastPlayedAt: "asc" }, { id: "asc" }],
          });

    if (!selectedSong) {
      throw new Error(`No songs found for "${genreName}".`);
    }

    return tx.song.update({
      where: { id: selectedSong.id },
      data: { lastPlayedAt: now },
      include: { genre: true },
    });
  });
}

function fallbackHostScript(song: SongWithGenre): string {
  return `You're listening to ${song.title} by ${song.artist}. Here's a quick backstory: this track became a fan favorite for its atmosphere and melody. Stay tuned and enjoy the song.`;
}

async function generateHostScript(song: SongWithGenre): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return fallbackHostScript(song);
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are a radio host for a ${song.genre.name} station. Keep it under 20 seconds. Give a short, interesting backstory about the song ${song.title} by ${song.artist}, then introduce it.`;

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
      contents: prompt,
    });

    const generatedScript = response.text?.trim();
    return generatedScript || fallbackHostScript(song);
  } catch {
    return fallbackHostScript(song);
  }
}

async function maybeGetHostIntro(song: SongWithGenre): Promise<StreamQueueItem | null> {
  if (Math.random() > HOST_CHANCE) {
    return null;
  }

  const cachedIntro = await prisma.hostIntro.findUnique({
    where: { songId: song.id },
  });

  if (cachedIntro) {
    return {
      kind: "host",
      title: "AI Host Intro",
      artist: "AI Host",
      genre: song.genre.name,
      audioUrl: cachedIntro.audioUrl,
      script: cachedIntro.script,
      songId: song.id,
    };
  }

  const script = await generateHostScript(song);
  const audioUrl = await generateTTS(script, { cacheKey: `host-intro-${song.id}` });

  await prisma.hostIntro.create({
    data: {
      songId: song.id,
      script,
      audioUrl,
    },
  });

  return {
    kind: "host",
    title: "AI Host Intro",
    artist: "AI Host",
    genre: song.genre.name,
    audioUrl,
    script,
    songId: song.id,
  };
}

export async function getMusicQueue(genreName: SupportedGenre): Promise<StreamQueueItem[]> {
  const song = await getNextSongForGenre(genreName, new Date());
  const queue: StreamQueueItem[] = [];

  const hostIntro = await maybeGetHostIntro(song);
  if (hostIntro) {
    queue.push(hostIntro);
  }

  queue.push({
    kind: "song",
    songId: song.id,
    title: song.title,
    artist: song.artist,
    genre: song.genre.name,
    audioUrl: song.audioUrl,
  });

  return queue;
}
