"use client";

import { useEffect, useRef } from "react";

interface Props {
  analyserNode: AnalyserNode | null;
  isPlaying: boolean;
  accentColor?: string;
}

export default function AudioVisualizer({
  analyserNode,
  isPlaying,
  accentColor = "#8b5cf6",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const BAR_COUNT = 48;
    const dataArray = new Uint8Array(analyserNode?.frequencyBinCount ?? BAR_COUNT);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      if (analyserNode && isPlaying) {
        analyserNode.getByteFrequencyData(dataArray);
      } else {
        // Idle animation — gentle sine wave
        const t = Date.now() / 1000;
        for (let i = 0; i < BAR_COUNT; i++) {
          dataArray[i] = Math.sin(t * 1.5 + i * 0.4) * 20 + 25;
        }
      }

      const barW = (W / BAR_COUNT) * 0.7;
      const gap = (W / BAR_COUNT) * 0.3;

      for (let i = 0; i < BAR_COUNT; i++) {
        const value = dataArray[i] ?? 0;
        const barH = (value / 255) * H * 0.9;
        const x = i * (barW + gap);
        const y = H - barH;

        // Gradient per bar
        const grad = ctx.createLinearGradient(0, y, 0, H);
        grad.addColorStop(0, accentColor);
        grad.addColorStop(1, accentColor + "44");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, [3, 3, 0, 0]);
        ctx.fill();
      }
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [analyserNode, isPlaying, accentColor]);

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
