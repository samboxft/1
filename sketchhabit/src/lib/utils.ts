import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data:image/...;base64, prefix
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
  });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "beginner":
      return "text-emerald-600 bg-emerald-50";
    case "intermediate":
      return "text-blue-600 bg-blue-50";
    case "advanced":
      return "text-orange-600 bg-orange-50";
    case "expert":
      return "text-red-600 bg-red-50";
    default:
      return "text-neutral-600 bg-neutral-100";
  }
}

export function getFocusIcon(focus: string): string {
  switch (focus) {
    case "shading":
      return "🌑";
    case "proportion":
      return "📐";
    case "perspective":
      return "🏛️";
    case "line_quality":
      return "✏️";
    case "composition":
      return "🖼️";
    case "texture":
      return "🪵";
    default:
      return "🎨";
  }
}
