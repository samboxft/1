import { DrawingPrompt } from "@/types";

export const DRAWING_PROMPTS: DrawingPrompt[] = [
  // Beginner - unlock at streak 0
  {
    id: "b1",
    text: "Draw a coffee mug",
    difficulty: "beginner",
    category: "still_life",
    hint: "Focus on the basic cylinder shape and handle. Don't worry about perspective yet.",
    unlockAtStreak: 0,
  },
  {
    id: "b2",
    text: "Draw an apple",
    difficulty: "beginner",
    category: "still_life",
    hint: "Start with a circle, then add the stem and leaf. Notice the subtle dimple at the top.",
    unlockAtStreak: 0,
  },
  {
    id: "b3",
    text: "Draw a simple house",
    difficulty: "beginner",
    category: "architecture",
    hint: "Begin with a rectangle for the walls and a triangle for the roof. Add a door and two windows.",
    unlockAtStreak: 0,
  },
  {
    id: "b4",
    text: "Draw a single flower",
    difficulty: "beginner",
    category: "nature",
    hint: "Start with the center circle, then add petals radiating outward. Keep petals slightly uneven for a natural look.",
    unlockAtStreak: 0,
  },
  {
    id: "b5",
    text: "Draw a book lying flat",
    difficulty: "beginner",
    category: "still_life",
    hint: "Draw a rectangle, then add slightly curved lines on one side for the pages.",
    unlockAtStreak: 0,
  },
  {
    id: "b6",
    text: "Draw a pair of sneakers",
    difficulty: "beginner",
    category: "still_life",
    hint: "Start with the basic oval silhouette, then add the sole and details.",
    unlockAtStreak: 0,
  },
  {
    id: "b7",
    text: "Draw a simple tree",
    difficulty: "beginner",
    category: "nature",
    hint: "Use a lollipop shape as your base: a circle on top of a rectangle.",
    unlockAtStreak: 0,
  },
  // Intermediate - unlock at streak 5
  {
    id: "i1",
    text: "Draw a glass of water with ice cubes",
    difficulty: "intermediate",
    category: "still_life",
    hint: "Pay attention to how light refracts through the glass. Use light lines for the transparent areas.",
    unlockAtStreak: 5,
  },
  {
    id: "i2",
    text: "Draw a stack of books at an angle",
    difficulty: "intermediate",
    category: "still_life",
    hint: "Practice basic one-point perspective to show depth. Each book should get slightly smaller.",
    unlockAtStreak: 5,
  },
  {
    id: "i3",
    text: "Draw a hand holding a pencil",
    difficulty: "intermediate",
    category: "figure",
    hint: "Use your own hand as reference! Sketch the basic shapes first, then refine the fingers.",
    unlockAtStreak: 5,
  },
  {
    id: "i4",
    text: "Draw a bicycle",
    difficulty: "intermediate",
    category: "still_life",
    hint: "Start with the two circles for wheels, then build the frame geometry around them.",
    unlockAtStreak: 5,
  },
  {
    id: "i5",
    text: "Draw a city street from eye level",
    difficulty: "intermediate",
    category: "architecture",
    hint: "Use one-point perspective with a single vanishing point on your horizon line.",
    unlockAtStreak: 5,
  },
  {
    id: "i6",
    text: "Draw a crumpled piece of paper",
    difficulty: "intermediate",
    category: "still_life",
    hint: "Focus on the shadows and light to convey the texture. Don't outline the wrinkles; shade them.",
    unlockAtStreak: 5,
  },
  // Advanced - unlock at streak 14
  {
    id: "a1",
    text: "Draw a portrait of an elderly person from imagination",
    difficulty: "advanced",
    category: "figure",
    hint: "Focus on the wrinkles around the eyes and mouth. Use cross-hatching for shadow areas.",
    unlockAtStreak: 14,
  },
  {
    id: "a2",
    text: "Draw a forest path with depth",
    difficulty: "advanced",
    category: "nature",
    hint: "Use atmospheric perspective — objects get lighter and less detailed as they recede.",
    unlockAtStreak: 14,
  },
  {
    id: "a3",
    text: "Draw an interior room using two-point perspective",
    difficulty: "advanced",
    category: "architecture",
    hint: "Set two vanishing points on your horizon line. All horizontal edges should converge to one of them.",
    unlockAtStreak: 14,
  },
  {
    id: "a4",
    text: "Draw a still life: a draped cloth with three objects",
    difficulty: "advanced",
    category: "still_life",
    hint: "The cloth is the hardest part — observe real cloth and focus on the major shadow shapes.",
    unlockAtStreak: 14,
  },
  // Expert - unlock at streak 30
  {
    id: "e1",
    text: "Draw a futuristic city using two-point perspective",
    difficulty: "expert",
    category: "imagination",
    hint: "Plan your horizon line and two vanishing points first. Add flying vehicles and unique architecture.",
    unlockAtStreak: 30,
  },
  {
    id: "e2",
    text: "Draw a realistic human eye with full shading",
    difficulty: "expert",
    category: "figure",
    hint: "The key to a realistic eye is the wet, reflective look of the pupil — leave a small white highlight dot.",
    unlockAtStreak: 30,
  },
  {
    id: "e3",
    text: "Draw an imaginative creature that's half-plant, half-animal",
    difficulty: "expert",
    category: "imagination",
    hint: "Sketch loose thumbnails first to find the best silhouette before committing to details.",
    unlockAtStreak: 30,
  },
];

export function getPromptForStreak(streak: number): DrawingPrompt {
  const available = DRAWING_PROMPTS.filter((p) => p.unlockAtStreak <= streak);
  const index = streak % available.length;
  return available[index];
}

export function getTodayPrompt(streak: number, dateStr?: string): DrawingPrompt {
  const available = DRAWING_PROMPTS.filter((p) => p.unlockAtStreak <= streak);
  const seed = dateStr
    ? new Date(dateStr).getTime()
    : new Date().setHours(0, 0, 0, 0);
  const index = Math.abs(seed) % available.length;
  return available[index];
}
