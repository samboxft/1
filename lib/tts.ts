type TTSKind = "host" | "news";

const PLACEHOLDER_AUDIO: Record<TTSKind, string> = {
  host: "/audio/host-placeholder.wav",
  news: "/audio/news-placeholder.wav",
};

export async function generateTTS(text: string, kind: TTSKind = "host") {
  void text;

  // Hook ElevenLabs or Google Cloud TTS in here. Returning local generated tones
  // keeps the app usable without paid credentials during local development.
  return PLACEHOLDER_AUDIO[kind];
}
