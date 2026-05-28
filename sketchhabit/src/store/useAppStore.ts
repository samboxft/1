"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Drawing, UserStats } from "@/types";
import { format, isToday, isYesterday, parseISO } from "date-fns";

interface AppState {
  // User stats
  stats: UserStats;
  // Drawings
  drawings: Drawing[];
  // UI
  isUploading: boolean;
  isAnalyzing: boolean;

  // Actions
  addDrawing: (drawing: Drawing) => void;
  removeDrawing: (id: string) => void;
  updateDrawing: (id: string, updates: Partial<Drawing>) => void;
  markTodayComplete: () => void;
  setUploading: (v: boolean) => void;
  setAnalyzing: (v: boolean) => void;
  computeStreak: () => void;
}

const defaultStats: UserStats = {
  currentStreak: 0,
  longestStreak: 0,
  totalDrawings: 0,
  lastDrawingDate: null,
  joinedDate: new Date().toISOString(),
  completedDates: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      stats: defaultStats,
      drawings: [],
      isUploading: false,
      isAnalyzing: false,

      addDrawing: (drawing) => {
        set((state) => ({
          drawings: [drawing, ...state.drawings],
        }));
        get().markTodayComplete();
      },

      removeDrawing: (id) =>
        set((state) => ({
          drawings: state.drawings.filter((d) => d.id !== id),
        })),

      updateDrawing: (id, updates) =>
        set((state) => ({
          drawings: state.drawings.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        })),

      markTodayComplete: () => {
        const today = format(new Date(), "yyyy-MM-dd");
        set((state) => {
          const { completedDates, lastDrawingDate } = state.stats;
          if (completedDates.includes(today)) return state;

          const newCompleted = [...completedDates, today].sort();

          // Compute streak
          let streak = 0;
          const sortedDesc = [...newCompleted].sort().reverse();
          for (let i = 0; i < sortedDesc.length; i++) {
            const date = parseISO(sortedDesc[i]);
            const expected = new Date();
            expected.setDate(expected.getDate() - i);
            if (format(date, "yyyy-MM-dd") === format(expected, "yyyy-MM-dd")) {
              streak++;
            } else {
              break;
            }
          }

          const newStats: UserStats = {
            ...state.stats,
            completedDates: newCompleted,
            lastDrawingDate: today,
            currentStreak: streak,
            longestStreak: Math.max(streak, state.stats.longestStreak),
            totalDrawings: state.drawings.length + 1,
          };
          return { stats: newStats };
        });
      },

      setUploading: (v) => set({ isUploading: v }),
      setAnalyzing: (v) => set({ isAnalyzing: v }),

      computeStreak: () => {
        set((state) => {
          const { completedDates, lastDrawingDate } = state.stats;
          if (!lastDrawingDate) return state;

          const last = parseISO(lastDrawingDate);
          if (!isToday(last) && !isYesterday(last)) {
            return {
              stats: { ...state.stats, currentStreak: 0 },
            };
          }
          return state;
        });
      },
    }),
    {
      name: "sketchhabit-store",
    }
  )
);
