import { NextRequest, NextResponse } from "next/server";

import { generateHourlyNews } from "@/lib/news";
import { getMusicQueue, isNewsWindow, resolveGenreName } from "@/lib/stream";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const requestedGenre = request.nextUrl.searchParams.get("genre");
    const genreName = resolveGenreName(requestedGenre);
    const now = new Date();

    if (isNewsWindow(now)) {
      const news = await generateHourlyNews();

      return NextResponse.json({
        type: "news",
        queue: [
          {
            kind: "news",
            title: "News Broadcast",
            artist: "World Desk",
            genre: "Global",
            audioUrl: news.audioUrl,
            script: news.script,
          },
        ],
      });
    }

    const queue = await getMusicQueue(genreName);

    return NextResponse.json({
      type: "music",
      queue,
    });
  } catch (error) {
    console.error("Failed to build stream payload", error);
    return NextResponse.json(
      { error: "Failed to build stream payload. Make sure your database is seeded." },
      { status: 500 },
    );
  }
}
