"use client";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function LoadingSpinner({ size = "md", className, label }: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-full border-neutral-200 border-t-amber-500 animate-spin",
          sizes[size]
        )}
        style={{ borderWidth: size === "md" ? 3 : undefined }}
      />
      {label && <p className="text-sm text-neutral-500">{label}</p>}
    </div>
  );
}
