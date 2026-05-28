"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { AIFeedbackCard } from "@/components/draw/AIFeedbackCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getTodayPrompt } from "@/lib/prompts/dailyPrompts";
import { fileToBase64, generateId, getDifficultyColor } from "@/lib/utils";
import { analyzeDrawing } from "@/lib/openai/analyze";
import { Drawing } from "@/types";
import { format } from "date-fns";
import {
  Camera,
  Upload,
  Lightbulb,
  RotateCcw,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type Step = "prompt" | "upload" | "analyzing" | "feedback";

export default function DrawPage() {
  const { stats, addDrawing, updateDrawing } = useAppStore();
  const today = format(new Date(), "yyyy-MM-dd");
  const prompt = getTodayPrompt(stats.currentStreak, today);

  const [step, setStep] = useState<Step>("prompt");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Drawing["feedback"] | null>(null);
  const [drawingId] = useState(() => generateId());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }

    const url = URL.createObjectURL(file);
    const b64 = await fileToBase64(file);
    setPreviewUrl(url);
    setBase64(b64);
    setStep("upload");
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!base64) return;
    setStep("analyzing");

    try {
      const result = await analyzeDrawing(base64, prompt.text);
      setFeedback(result);

      const drawing: Drawing = {
        id: drawingId,
        userId: "local",
        promptId: prompt.id,
        promptText: prompt.text,
        imageUrl: previewUrl!,
        createdAt: new Date().toISOString(),
        feedback: result,
        difficulty: prompt.difficulty,
      };
      addDrawing(drawing);
      setStep("feedback");
    } catch (error) {
      console.error(error);
      toast.error("Analysis failed. Please try again.");
      setStep("upload");
    }
  }, [base64, prompt, previewUrl, drawingId, addDrawing]);

  const handleReset = () => {
    setStep("prompt");
    setPreviewUrl(null);
    setBase64(null);
    setFeedback(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="px-4 pt-12 pb-4">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
          Daily Challenge
        </p>
        <h1 className="text-2xl font-bold text-neutral-900">Draw &amp; Improve</h1>
      </div>

      {/* Step: Prompt */}
      {step === "prompt" && (
        <div className="space-y-4">
          {/* Prompt card */}
          <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                Today&apos;s prompt
              </p>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${getDifficultyColor(prompt.difficulty)}`}
              >
                {prompt.difficulty}
              </span>
            </div>
            <p className="text-2xl font-bold mb-3">&ldquo;{prompt.text}&rdquo;</p>
            {prompt.hint && (
              <div className="flex gap-2 bg-white/10 rounded-xl p-3">
                <Lightbulb size={14} className="text-amber-300 shrink-0 mt-0.5" />
                <p className="text-xs text-stone-300 leading-relaxed">{prompt.hint}</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <p className="text-sm font-semibold text-blue-800 mb-2">How it works</p>
            <ol className="space-y-1.5">
              {[
                "Grab a pencil and paper",
                "Draw the prompt above",
                "Take a photo of your drawing",
                "Get personalized AI feedback",
              ].map((step, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-blue-700">
                  <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Upload buttons */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          <button
            onClick={() => cameraInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-semibold text-base py-4 rounded-2xl transition-colors shadow-md shadow-amber-100"
          >
            <Camera size={20} />
            Take a Photo
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-neutral-200 hover:border-neutral-300 active:bg-neutral-50 text-neutral-700 font-semibold text-base py-4 rounded-2xl transition-colors"
          >
            <Upload size={20} />
            Upload from Gallery
          </button>
        </div>
      )}

      {/* Step: Preview */}
      {step === "upload" && previewUrl && (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-neutral-100 aspect-[4/3]">
            <Image
              src={previewUrl}
              alt="Your drawing"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <p className="text-sm text-center text-neutral-500">
            Prompt: <span className="font-medium text-neutral-700">{prompt.text}</span>
          </p>

          <button
            onClick={handleAnalyze}
            className="w-full flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-semibold text-base py-4 rounded-2xl transition-colors shadow-md shadow-amber-100"
          >
            <Sparkles size={20} />
            Analyze with AI
          </button>

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 text-neutral-500 hover:text-neutral-700 py-3 text-sm font-medium"
          >
            <RotateCcw size={15} />
            Retake photo
          </button>
        </div>
      )}

      {/* Step: Analyzing */}
      {step === "analyzing" && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
              <Sparkles size={32} className="text-amber-500" />
            </div>
            <div className="absolute -inset-2 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
          </div>
          <div className="text-center">
            <p className="font-bold text-neutral-800 text-lg">Analyzing your drawing…</p>
            <p className="text-sm text-neutral-500 mt-1">
              Looking at lines, shading, and composition
            </p>
          </div>
          <div className="space-y-2 w-full max-w-xs">
            {["Detecting shapes & proportions", "Evaluating line quality", "Generating custom exercises"].map(
              (label, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-neutral-500">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin",
                      i === 1 && "animation-delay-200",
                      i === 2 && "animation-delay-400"
                    )}
                  />
                  {label}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Step: Feedback */}
      {step === "feedback" && feedback && previewUrl && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-2xl p-3 border border-emerald-100">
            <CheckCircle size={18} />
            <p className="text-sm font-semibold">
              Drawing saved! Streak updated 🔥
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-neutral-100 aspect-[4/3]">
            <Image
              src={previewUrl}
              alt="Your drawing"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <AIFeedbackCard feedback={feedback} />

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-white font-semibold text-base py-4 rounded-2xl transition-colors"
          >
            <RotateCcw size={18} />
            Draw Another
          </button>
        </div>
      )}
    </div>
  );
}
