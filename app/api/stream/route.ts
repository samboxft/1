import { NextRequest, NextResponse } from "next/server";
import { generateHostScript } from "@/lib/gemini";
import { generateHourlyNews } from "@/lib/news";
import { prisma } from "@/lib/prisma";
import type { RadioItem, StreamResponse } from "@/lib/radio-types";
import { generateTTS } from "@/lib/tts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT_GENRE = "Lofi";
const HOST_INTRO_CHANCE = 0.2;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

function isNewsWindow(date = new Date()) {
  return date.getMinutes() >= 0 && date.getMinutes() <= 5;
}

async function findGenre(requestedGenre: string) {
  const genres = await prisma.genre.findMany({
    orderBy: { name: "asc" },
  });

  return (
    genres.find(
      (genre) => genre.name.toLowerCase() === requestedGenre.toLowerCase(),
    ) ??
    genres.find((genre) => genre.name === DEFAULT_GENRE) ??
    genres[0]
  );
}

async function selectSongForGenre(genreId: number, now: Date) {
  const cutoff = new Date(now.getTime() - TWENTY_FOUR_HOURS_MS);
  const eligibleSongs = await prisma.song.findMany({
    where: {
      genreId,
      OR: [{ lastPlayedAt: null }, { lastPlayedAt: { lt: cutoff } }],
    },
    include: { genre: true },
  });

  if (eligibleSongs.length > 0) {
    const selected =
      eligibleSongs[Math.floor(Math.random() * eligibleSongs.length)];

    return prisma.song.update({
      where: { id: selected.id },
      data: { lastPlayedAt: now },
      include: { genre: true },
    });
  }

  const oldestSong = await prisma.song.findFirst({
    where: { genreId },
    orderBy: [{ lastPlayedAt: "asc" }, { id: "asc" }],
    include: { genre: true },
  });

  if (!oldestSong) {
    return null;
  }

  return prisma.song.update({
    where: { id: oldestSong.id },
    data: { lastPlayedAt: now },
    include: { genre: true },
  });
}

async function maybeCreateHostIntro(
  song: NonNullable<Awaited<ReturnType<typeof selectSongForGenre>>>,
) {
  if (Math.random() >= HOST_INTRO_CHANCE) {
    return null;
  }

  if (song.hostAudioUrl && song.hostScript) {
    return {
      type: "host",
      title: "AI Host Intro",
      genre: song.genre.name,
      audioUrl: song.hostAudioUrl,
      script: song.hostScript,
      songId: song.id,
    } satisfies RadioItem;
  }

  const script = await generateHostScript({
    genre: song.genre.name,
    title: song.title,
    artist: song.artist,
  });
  const audioUrl = await generateTTS(script, "host");

  await prisma.song.update({
    where: { id: song.id },
    data: {
      hostScript: script,
      hostAudioUrl: audioUrl,
      hostGeneratedAt: new Date(),
    },
  });

  return {
    type: "host",
    title: "AI Host Intro",
    genre: song.genre.name,
    audioUrl,
    script,
    songId: song.id,
  } satisfies RadioItem;
}

export async function GET(request: NextRequest) {
  const now = new Date();
  const requestedGenre =
    request.nextUrl.searchParams.get("genre")?.trim() || DEFAULT_GENRE;

  if (isNewsWindow(now)) {
    const news = await generateHourlyNews(now);
    const response: StreamResponse = {
      station: requestedGenre,
      fetchedAt: now.toISOString(),
      reason: "news-window",
      items: [
        {
          type: "news",
          title: "News Broadcast",
          audioUrl: news.audioUrl,
          script: news.script,
        },
      ],
    };

    return NextResponse.json(response);
  }

  const genre = await findGenre(requestedGenre);

  if (!genre) {
    return NextResponse.json(
      { error: "No genres have been seeded yet." },
      { status: 404 },
    );
  }

  const song = await selectSongForGenre(genre.id, now);

  if (!song) {
    return NextResponse.json(
      { error: `No songs found for genre ${genre.name}.` },
      { status: 404 },
    );
  }

  const hostIntro = await maybeCreateHostIntro(song);
  const songItem: RadioItem = {
    type: "song",
    title: song.title,
    artist: song.artist,
    genre: song.genre.name,
    audioUrl: song.audioUrl,
    songId: song.id,
  };

  const response: StreamResponse = {
    station: song.genre.name,
    fetchedAt: now.toISOString(),
    items: hostIntro ? [hostIntro, songItem] : [songItem],
  };

  return NextResponse.json(response);
}
