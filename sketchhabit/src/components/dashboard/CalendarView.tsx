"use client";
import { useAppStore } from "@/store/useAppStore";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay } from "date-fns";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function CalendarView() {
  const completedDates = useAppStore((s) => s.stats.completedDates);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart); // 0 = Sunday

  const completedSet = new Set(completedDates);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-neutral-800">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() =>
              setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1))
            }
            className="p-1.5 rounded-xl hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
          >
            <ChevronLeft size={16} className="text-neutral-500" />
          </button>
          <button
            onClick={() =>
              setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1))
            }
            className="p-1.5 rounded-xl hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
          >
            <ChevronRight size={16} className="text-neutral-500" />
          </button>
        </div>
      </div>

      {/* Day of week labels */}
      <div className="grid grid-cols-7 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-neutral-300 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {/* Empty cells before month start */}
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const completed = completedSet.has(dateStr);
          const today = isToday(day);
          const inMonth = isSameMonth(day, currentMonth);

          return (
            <div key={dateStr} className="flex items-center justify-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                  completed && "bg-amber-500 text-white shadow-sm shadow-amber-200",
                  !completed && today && "ring-2 ring-amber-400 text-amber-600 font-bold",
                  !completed && !today && inMonth && "text-neutral-500",
                  !completed && !today && !inMonth && "text-neutral-200"
                )}
              >
                {completed ? "✓" : format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-neutral-400 mt-3 text-center">
        {completedDates.length} drawing{completedDates.length !== 1 ? "s" : ""} completed
      </p>
    </div>
  );
}
