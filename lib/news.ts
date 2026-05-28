import { prisma } from "@/lib/prisma";
import { generateTTS } from "@/lib/tts";

type NewsApiArticle = {
  title?: string;
};

type NewsApiResponse = {
  articles?: NewsApiArticle[];
};

function getCurrentHourKey(date = new Date()) {
  return date.toISOString().slice(0, 13);
}

function getNextHour(date = new Date()) {
  const nextHour = new Date(date);
  nextHour.setUTCMinutes(0, 0, 0);
  nextHour.setUTCHours(nextHour.getUTCHours() + 1);
  return nextHour;
}

async function fetchTopHeadlines() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return [
      "Global markets opened cautiously as investors watched central bank signals.",
      "Scientists announced new climate data from ocean temperature monitoring.",
      "International sports leagues released updates from overnight matches.",
      "Technology leaders continued discussing safeguards for generative AI tools.",
    ];
  }

  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?language=en&pageSize=5&apiKey=${apiKey}`,
    { next: { revalidate: 900 } },
  );

  if (!response.ok) {
    throw new Error(`News API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as NewsApiResponse;
  const headlines =
    payload.articles
      ?.map((article) => article.title?.trim())
      .filter((title): title is string => Boolean(title))
      .slice(0, 5) ?? [];

  if (headlines.length === 0) {
    throw new Error("News API returned no headlines");
  }

  return headlines;
}

export async function generateHourlyNews(date = new Date()) {
  const hourKey = getCurrentHourKey(date);
  const cacheId = `news:${hourKey}`;
  const cached = await prisma.generatedAudioCache.findFirst({
    where: {
      id: cacheId,
      kind: "news",
      OR: [{ expiresAt: null }, { expiresAt: { gt: date } }],
    },
  });

  if (cached) {
    return {
      audioUrl: cached.audioUrl,
      script: cached.script,
    };
  }

  let headlines: string[];

  try {
    headlines = await fetchTopHeadlines();
  } catch (error) {
    console.error("News headline fetch failed", error);
    headlines = [
      "World news is temporarily unavailable.",
      "Our newsroom will keep monitoring updates throughout the hour.",
    ];
  }

  const script = [
    "Welcome to your hourly world news update.",
    ...headlines.map((headline) => `Headline: ${headline}.`),
    "Now, back to the music.",
  ].join(" ");

  const audioUrl = await generateTTS(script, "news");
  const cache = await prisma.generatedAudioCache.upsert({
    where: { id: cacheId },
    update: {
      script,
      audioUrl,
      generatedAt: date,
      expiresAt: getNextHour(date),
    },
    create: {
      id: cacheId,
      kind: "news",
      script,
      audioUrl,
      generatedAt: date,
      expiresAt: getNextHour(date),
    },
  });

  return {
    audioUrl: cache.audioUrl,
    script: cache.script,
  };
}
