import { NextRequest, NextResponse } from "next/server";

/**
 * Audio proxy — fetches an external audio URL and re-serves it from our domain.
 * This allows the Web Audio API (AnalyserNode / createMediaElementSource) to work
 * with tracks hosted externally, since the browser enforces same-origin CORS for
 * those APIs.
 *
 * Usage: GET /api/proxy?url=https://...
 */

const ALLOWED_HOSTS = [
  "www.soundhelix.com",
  "soundhelix.com",
  "archive.org",
  "ia800.us.archive.org",
  "ia600.us.archive.org",
  "incompetech.com",
  "freemusicarchive.org",
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return new NextResponse("Missing ?url= parameter", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return new NextResponse(`Host not allowed: ${parsed.hostname}`, { status: 403 });
  }

  try {
    const upstream = await fetch(rawUrl, {
      headers: { "User-Agent": "AuraRadio/1.0" },
    });

    if (!upstream.ok) {
      return new NextResponse(`Upstream error: ${upstream.status}`, {
        status: 502,
      });
    }

    const contentType = upstream.headers.get("content-type") ?? "audio/mpeg";
    const contentLength = upstream.headers.get("content-length");

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    };
    if (contentLength) headers["Content-Length"] = contentLength;

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch (err) {
    console.error("[Proxy] Fetch failed:", err);
    return new NextResponse("Failed to fetch audio", { status: 502 });
  }
}
