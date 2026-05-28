import { generateTTS } from "@/lib/tts";

const FALLBACK_HEADLINES = [
  "International climate delegates agree on a new clean-energy financing target.",
  "Major research teams report progress on battery technology with longer storage cycles.",
  "Global markets closed mixed as investors tracked inflation and central bank signals.",
];

type NewsCache = {
  hourBucket: string;
  audioUrl: string;
  script: string;
};

let cachedNews: NewsCache | null = null;

function getHourBucket(date: Date): string {
  return date.toISOString().slice(0, 13);
}

async function fetchTopHeadlines(): Promise<string[]> {
  const newsApiKey = process.env.NEWS_API_KEY;

  if (!newsApiKey) {
    return FALLBACK_HEADLINES;
  }

  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?language=en&pageSize=5&apiKey=${newsApiKey}`,
    { next: { revalidate: 300 } },
  );

  if (!response.ok) {
    return FALLBACK_HEADLINES;
  }

  const payload = (await response.json()) as {
    articles?: Array<{ title?: string }>;
  };

  const headlines =
    payload.articles
      ?.map((article) => article.title?.trim())
      .filter((headline): headline is string => Boolean(headline)) ?? [];

  return headlines.length > 0 ? headlines : FALLBACK_HEADLINES;
}

function createNewsScript(headlines: string[]): string {
  const combinedHeadlines = headlines
    .slice(0, 5)
    .map((headline, index) => `Headline ${index + 1}: ${headline}.`)
    .join(" ");

  return `Welcome to your hourly world news update. ${combinedHeadlines} Now, back to the music.`;
}

export async function generateHourlyNews(): Promise<{ audioUrl: string; script: string }> {
  const now = new Date();
  const currentHourBucket = getHourBucket(now);

  if (cachedNews && cachedNews.hourBucket === currentHourBucket) {
    return { audioUrl: cachedNews.audioUrl, script: cachedNews.script };
  }

  const headlines = await fetchTopHeadlines();
  const script = createNewsScript(headlines);
  const audioUrl = await generateTTS(script, { cacheKey: currentHourBucket });

  cachedNews = {
    hourBucket: currentHourBucket,
    audioUrl,
    script,
  };

  return { audioUrl, script };
}
