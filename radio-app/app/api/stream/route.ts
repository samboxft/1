import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { generateTTS } from "@/lib/tts";
import { generateHourlyNews } from "@/lib/news";

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const HOST_CHANCE = 0.2; // 20% probability

export interface AudioItem {
  type: "song" | "host-intro" | "news";
  audioUrl: string;
  title?: string;
  artist?: string;
  genre?: string;
  script?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get("genre") || "Lofi";

  try {
    // Every hour at minutes 00–04: play the news broadcast
    const now = new Date();
    if (now.getMinutes() < 5) {
      const news = await generateHourlyNews();
      const item: AudioItem = {
        type: "news",
        audioUrl: news.audioUrl,
        script: news.script,
      };
      return NextResponse.json([item]);
    }

    // Get the next song for the requested genre
    const song = await getNextSong(genre);
    if (!song) {
      return NextResponse.json(
        { error: `No songs found for genre: ${genre}` },
        { status: 404 }
      );
    }

    const queue: AudioItem[] = [];

    // 20% chance to include an AI host intro
    if (Math.random() < HOST_CHANCE) {
      const intro = await getHostIntro(song.id, song.title, song.artist, genre);
      if (intro) {
        queue.push(intro);
      }
    }

    queue.push({
      type: "song",
      audioUrl: song.audioUrl,
      title: song.title,
      artist: song.artist,
      genre,
    });

    return NextResponse.json(queue);
  } catch (error) {
    console.error("[Stream API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getNextSong(genreName: string) {
  const cutoff = new Date(Date.now() - TWENTY_FOUR_HOURS_MS);

  // First try: find a song not played in the last 24 hours
  const genre = await prisma.genre.findUnique({ where: { name: genreName } });
  if (!genre) return null;

  let song = await prisma.song.findFirst({
    where: {
      genreId: genre.id,
      OR: [{ lastPlayedAt: null }, { lastPlayedAt: { lt: cutoff } }],
    },
    orderBy: { lastPlayedAt: { sort: "asc", nulls: "first" } },
  });

  // Edge case: all songs played in the last 24h — pick the oldest played song
  if (!song) {
    song = await prisma.song.findFirst({
      where: { genreId: genre.id },
      orderBy: { lastPlayedAt: "asc" },
    });
  }

  if (!song) return null;

  await prisma.song.update({
    where: { id: song.id },
    data: { lastPlayedAt: new Date() },
  });

  return song;
}

async function getHostIntro(
  songId: number,
  title: string,
  artist: string,
  genre: string
): Promise<AudioItem | null> {
  try {
    // Check for a cached host audio for this song
    const existing = await prisma.song.findUnique({
      where: { id: songId },
      select: { hostScript: true, hostAudioUrl: true },
    });

    if (existing?.hostScript && existing?.hostAudioUrl) {
      return {
        type: "host-intro",
        audioUrl: existing.hostAudioUrl,
        script: existing.hostScript,
      };
    }

    const script = await generateHostScript(title, artist, genre);
    if (!script) return null;

    const { audioUrl } = await generateTTS(script);

    // Cache the generated script and audio against the song
    await prisma.song.update({
      where: { id: songId },
      data: { hostScript: script, hostAudioUrl: audioUrl },
    });

    return { type: "host-intro", audioUrl, script };
  } catch (err) {
    console.warn("[Stream API] Host intro generation failed:", err);
    return null;
  }
}

async function generateHostScript(
  title: string,
  artist: string,
  genre: string
): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("[Stream API] GEMINI_API_KEY not set — skipping host intro");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt =
    `You are an enthusiastic radio host for a ${genre} station. ` +
    `Keep your response under 20 seconds when spoken aloud (roughly 50 words). ` +
    `Give a short, interesting backstory about the song "${title}" by ${artist}, then introduce it. ` +
    `Speak naturally, warmly, and avoid filler words.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  return response.text ?? null;
}
