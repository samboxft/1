import { NextRequest, NextResponse } from "next/server";
import { getMockFeedback } from "@/lib/openai/analyze";

export async function POST(req: NextRequest) {
  try {
    const { base64Image, promptText } = await req.json();

    if (!base64Image || !promptText) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // If no API key, return mock feedback for demo
    if (!apiKey) {
      await new Promise((r) => setTimeout(r, 2000)); // Simulate processing time
      return NextResponse.json(getMockFeedback(promptText));
    }

    // Real OpenAI Vision API call
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 1000,
        messages: [
          {
            role: "system",
            content: `You are a gentle, encouraging drawing teacher analyzing a student's pencil sketch. 
            Provide constructive, specific feedback. Always be warm and supportive.
            Respond in JSON with this exact structure:
            {
              "overallScore": <number 1-100>,
              "praise": "<2-3 sentences of genuine praise>",
              "areasToImprove": ["<specific area 1>", "<specific area 2>", "<specific area 3>"],
              "exercises": [
                {
                  "title": "<exercise name>",
                  "description": "<clear instructions>",
                  "duration": "<time estimate>",
                  "focus": "<one of: shading|proportion|perspective|line_quality|composition|texture>"
                }
              ],
              "detectedElements": ["<element1>", "<element2>", ...]
            }
            Provide exactly 2-3 exercises targeted to the specific weaknesses you see.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please analyze this pencil drawing. The student was asked to: "${promptText}". Provide gentle, specific, actionable feedback.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "high",
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      // Fallback to mock on API error
      return NextResponse.json(getMockFeedback(promptText));
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(getMockFeedback(promptText));
    }

    const feedback = JSON.parse(jsonMatch[0]);
    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Analysis error:", error);
    // Always fallback gracefully
    return NextResponse.json(getMockFeedback("your drawing"));
  }
}
