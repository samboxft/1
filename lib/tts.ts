const DEFAULT_TTS_PLACEHOLDER_URL =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3";

type GenerateTTSOptions = {
  cacheKey?: string;
};

/**
 * Placeholder TTS generator. Replace with ElevenLabs or Google Cloud TTS.
 */
export async function generateTTS(
  text: string,
  options?: GenerateTTSOptions,
): Promise<string> {
  void text;
  void options;
  return process.env.TTS_PLACEHOLDER_URL ?? DEFAULT_TTS_PLACEHOLDER_URL;
}
