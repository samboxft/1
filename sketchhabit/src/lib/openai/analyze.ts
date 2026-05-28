import { AIFeedback, MicroExercise } from "@/types";

export async function analyzeDrawing(
  base64Image: string,
  promptText: string
): Promise<AIFeedback> {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image, promptText }),
    });

    if (response.ok) {
      return response.json();
    }
    // Non-OK response (including 404 on static export) → use mock
    throw new Error("API unavailable");
  } catch {
    // Fallback for static deployments or network errors
    await new Promise((r) => setTimeout(r, 2500));
    return getMockFeedback(promptText);
  }
}

// Fallback mock feedback for demo mode (when no API key is set)
export function getMockFeedback(promptText: string): AIFeedback {
  const exercises: MicroExercise[] = [
    {
      title: "Contour Line Confidence",
      description:
        "Draw the same object 5 times in a row without lifting your pen. Focus on drawing from your shoulder, not your wrist. Each line should be deliberate and confident.",
      duration: "10 minutes",
      focus: "line_quality",
    },
    {
      title: "Shadow Shape Study",
      description:
        "Find a single light source and draw just the shadow shapes on your object. Treat each shadow as a flat, filled shape rather than trying to shade gradually.",
      duration: "8 minutes",
      focus: "shading",
    },
    {
      title: "Proportion Check",
      description:
        "Hold your pencil at arm's length to measure your subject. Compare the height to the width. Try redrawing with accurate proportions before adding any detail.",
      duration: "12 minutes",
      focus: "proportion",
    },
  ];

  return {
    overallScore: Math.floor(Math.random() * 25) + 65,
    praise: `Great effort on "${promptText}"! Your composition shows a good instinct for placement on the page. The basic shapes are well-established and I can clearly see what you were going for. Your line confidence is building nicely.`,
    areasToImprove: [
      "Line weight variation — try pressing harder for darker edges and lighter for soft transitions",
      "Shadow shapes — the dark areas could be more defined to create stronger contrast",
      "Proportions — the overall form is there, but small proportion adjustments would make it more convincing",
    ],
    exercises: exercises.slice(0, 2 + Math.floor(Math.random() * 2)),
    detectedElements: [
      "basic form",
      "outline",
      "some shading",
      "pencil texture",
    ],
  };
}
