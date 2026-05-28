/**
 * Text-to-Speech utility.
 * Supports ElevenLabs and Google Cloud TTS.
 * Falls back to a placeholder URL when no API key is configured.
 */

export interface TTSResult {
  audioUrl: string;
  provider: "elevenlabs" | "google" | "placeholder";
}

/**
 * Generate TTS audio from text.
 * Priority: ElevenLabs > Google Cloud TTS > placeholder.
 */
export async function generateTTS(text: string): Promise<TTSResult> {
  if (process.env.ELEVENLABS_API_KEY) {
    return generateElevenLabsTTS(text);
  }
  if (process.env.GOOGLE_TTS_API_KEY) {
    return generateGoogleTTS(text);
  }
  // Placeholder — returns a silent/demo audio stub
  console.warn("[TTS] No TTS API key configured. Using placeholder.");
  return {
    audioUrl: "/audio/placeholder-tts.mp3",
    provider: "placeholder",
  };
}

async function generateElevenLabsTTS(text: string): Promise<TTSResult> {
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "pNInz6obpgDQGcFmaJgB"; // Adam

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs TTS failed: ${response.statusText}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(audioBuffer).toString("base64");
  const audioUrl = `data:audio/mpeg;base64,${base64}`;

  return { audioUrl, provider: "elevenlabs" };
}

async function generateGoogleTTS(text: string): Promise<TTSResult> {
  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: "en-US", ssmlGender: "MALE" },
        audioConfig: { audioEncoding: "MP3" },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Google TTS failed: ${response.statusText}`);
  }

  const data = (await response.json()) as { audioContent: string };
  const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;

  return { audioUrl, provider: "google" };
}
