export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Drawing {
  id: string;
  userId: string;
  promptId: string;
  promptText: string;
  imageUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
  feedback?: AIFeedback;
  difficulty: DifficultyLevel;
}

export interface AIFeedback {
  overallScore: number;
  praise: string;
  areasToImprove: string[];
  exercises: MicroExercise[];
  detectedElements: string[];
}

export interface MicroExercise {
  title: string;
  description: string;
  duration: string;
  focus: "shading" | "proportion" | "perspective" | "line_quality" | "composition" | "texture";
}

export interface DrawingPrompt {
  id: string;
  text: string;
  difficulty: DifficultyLevel;
  category: PromptCategory;
  hint?: string;
  unlockAtStreak: number;
}

export type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type PromptCategory =
  | "still_life"
  | "nature"
  | "architecture"
  | "figure"
  | "perspective"
  | "imagination";

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalDrawings: number;
  lastDrawingDate: string | null;
  joinedDate: string;
  completedDates: string[];
}

export interface DailyInspiration {
  quote: string;
  author: string;
  artworkTitle: string;
  artworkArtist: string;
  artworkUrl: string;
  tip: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
  level: DifficultyLevel;
  topics: string[];
  thumbnail: string;
}
