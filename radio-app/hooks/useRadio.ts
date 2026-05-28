"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AudioItem } from "@/app/api/stream/route";

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";

export interface NowPlaying {
  title: string;
  artist: string;
  genre: string;
  type: AudioItem["type"];
  script?: string;
}

export interface UseRadioReturn {
  status: PlayerStatus;
  nowPlaying: NowPlaying | null;
  currentGenre: string | null;
  volume: number;
  selectGenre: (genre: string) => void;
  togglePlayPause: () => void;
  setVolume: (v: number) => void;
  analyserNode: AnalyserNode | null;
}

export function useRadio(): UseRadioReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const queueRef = useRef<AudioItem[]>([]);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null); // pre-load buffer

  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [currentGenre, setCurrentGenre] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(0.8);

  // Initialize / resume AudioContext
  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  }, []);

  // Connects a given <audio> element to the Web Audio graph
  const connectAudioElement = useCallback(
    (el: HTMLAudioElement) => {
      if (!audioCtxRef.current || !analyserRef.current) return;
      // Disconnect previous source if it exists
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch {}
      }
      const src = audioCtxRef.current.createMediaElementSource(el);
      src.connect(analyserRef.current);
      sourceRef.current = src;
    },
    []
  );

  const fetchQueue = useCallback(async (genre: string) => {
    const res = await fetch(`/api/stream?genre=${encodeURIComponent(genre)}`);
    if (!res.ok) throw new Error("Stream API error");
    const items: AudioItem[] = await res.json();
    return items;
  }, []);

  // Pre-fetch next song to minimise gap between tracks
  const prefetchNext = useCallback(
    (genre: string) => {
      fetchQueue(genre)
        .then((items) => {
          queueRef.current = items;
          // Pre-load first audio
          if (items[0]) {
            const next = new Audio(items[0].audioUrl);
            next.preload = "auto";
            next.volume = volume;
            nextAudioRef.current = next;
          }
        })
        .catch(() => {
          /* silently ignore prefetch errors */
        });
    },
    [fetchQueue, volume]
  );

  const playNext = useCallback(
    async (genre: string) => {
      // Use pre-fetched queue if available, otherwise fetch fresh
      let queue = queueRef.current;
      if (queue.length === 0) {
        setStatus("loading");
        try {
          queue = await fetchQueue(genre);
        } catch {
          setStatus("error");
          return;
        }
      }

      queueRef.current = []; // consumed

      const playSequence = async (items: AudioItem[]) => {
        for (const item of items) {
          await playItem(item, genre);
        }
        // After sequence ends, start prefetching and play next
        prefetchNext(genre);
        playNext(genre);
      };

      playSequence(queue);
    },
    [fetchQueue, prefetchNext]
  );

  const playItem = useCallback(
    (item: AudioItem, genre: string): Promise<void> => {
      return new Promise((resolve) => {
        ensureAudioContext();

        // Reuse pre-loaded audio if URLs match
        let el: HTMLAudioElement;
        if (
          nextAudioRef.current &&
          nextAudioRef.current.src.endsWith(item.audioUrl)
        ) {
          el = nextAudioRef.current;
          nextAudioRef.current = null;
        } else {
          el = new Audio(item.audioUrl);
          el.preload = "auto";
        }

        el.volume = volume;
        audioRef.current = el;
        connectAudioElement(el);

        setNowPlaying({
          title: item.title || (item.type === "news" ? "News Broadcast" : "DJ Intro"),
          artist: item.artist || (item.type === "news" ? "World Radio" : "AI Host"),
          genre,
          type: item.type,
          script: item.script,
        });
        setStatus("playing");

        el.onended = () => resolve();
        el.onerror = () => resolve(); // skip on error
        el.play().catch(() => resolve());
      });
    },
    [ensureAudioContext, connectAudioElement, volume]
  );

  const selectGenre = useCallback(
    (genre: string) => {
      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      queueRef.current = [];
      nextAudioRef.current = null;
      setCurrentGenre(genre);
      setStatus("loading");
      ensureAudioContext();
      playNext(genre);
    },
    [ensureAudioContext, playNext]
  );

  const togglePlayPause = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setStatus("playing");
    } else {
      el.pause();
      setStatus("paused");
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (nextAudioRef.current) nextAudioRef.current.volume = v;
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioCtxRef.current?.close();
    };
  }, []);

  // Re-wire volume when it changes without restart
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  return {
    status,
    nowPlaying,
    currentGenre,
    volume,
    selectGenre,
    togglePlayPause,
    setVolume,
    analyserNode: analyserRef.current,
  };
}
