import { GoogleGenAI } from "@google/genai";

type HostScriptInput = {
  genre: string;
  title: string;
  artist: string;
};

export async function generateHostScript({
  genre,
  title,
  artist,
}: HostScriptInput) {
  const fallback = `You are tuned to our ${genre} station. Here is ${title} by ${artist}.`;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return fallback;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a radio host for a ${genre} station. Keep it under 20 seconds. Give a short, interesting backstory about the song ${title} by ${artist}, then introduce it.`,
    });

    return response.text?.trim() || fallback;
  } catch (error) {
    console.error("Gemini host script generation failed", error);
    return fallback;
  }
}
