/**
 * Hourly news broadcast generator.
 * Fetches top headlines from NewsAPI, generates a script, and caches the TTS audio.
 */

import { prisma } from "./prisma";
import { generateTTS } from "./tts";

const ONE_HOUR_MS = 60 * 60 * 1000;

export interface NewsResult {
  audioUrl: string;
  script: string;
  cached: boolean;
}

export async function generateHourlyNews(): Promise<NewsResult> {
  // Check cache — reuse if generated within the last hour
  const cached = await prisma.newsCache.findFirst({
    orderBy: { generatedAt: "desc" },
  });

  if (cached && Date.now() - cached.generatedAt.getTime() < ONE_HOUR_MS) {
    return { audioUrl: cached.audioUrl, script: cached.script, cached: true };
  }

  const headlines = await fetchHeadlines();
  const script = buildNewsScript(headlines);
  const { audioUrl } = await generateTTS(script);

  await prisma.newsCache.create({
    data: { audioUrl, script },
  });

  return { audioUrl, script, cached: false };
}

async function fetchHeadlines(): Promise<string[]> {
  if (!process.env.NEWS_API_KEY) {
    return fallbackHeadlines();
  }

  try {
    const url = new URL("https://newsapi.org/v2/top-headlines");
    url.searchParams.set("language", "en");
    url.searchParams.set("pageSize", "5");
    url.searchParams.set("apiKey", process.env.NEWS_API_KEY);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`NewsAPI returned ${response.status}`);
    }

    const data = (await response.json()) as {
      articles: { title: string }[];
    };

    return data.articles
      .map((a) => a.title)
      .filter(Boolean)
      .slice(0, 5);
  } catch (err) {
    console.warn("[News] Failed to fetch headlines, using fallback:", err);
    return fallbackHeadlines();
  }
}

function buildNewsScript(headlines: string[]): string {
  const lines = headlines.map((h, i) => `Story ${i + 1}: ${h}`).join(". ");
  return `Welcome to your hourly world news update. ${lines}. That's all for this hour's top stories. Now, back to the music.`;
}

function fallbackHeadlines(): string[] {
  return [
    "Global leaders meet to discuss climate change initiatives",
    "Tech companies announce new AI safety standards",
    "Markets close higher on strong economic data",
    "Scientists discover new species in the Amazon rainforest",
    "Local communities celebrate cultural heritage festival",
  ];
}
