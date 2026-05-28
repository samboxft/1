"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RadioItem, StreamResponse } from "@/lib/radio-types";

type PlaybackStatus = "idle" | "loading" | "playing" | "paused" | "error";

const DEFAULT_GENRE = "Lofi";

export function useRadio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const selectedGenreRef = useRef(DEFAULT_GENRE);
  const currentItemRef = useRef<RadioItem | null>(null);
  const [selectedGenre, setSelectedGenre] = useState(DEFAULT_GENRE);
  const [currentItem, setCurrentItem] = useState<RadioItem | null>(null);
  const [queue, setQueue] = useState<RadioItem[]>([]);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    selectedGenreRef.current = selectedGenre;
  }, [selectedGenre]);

  useEffect(() => {
    currentItemRef.current = currentItem;
  }, [currentItem]);

  const requestNext = useCallback(async (genre: string, replace = false) => {
    setStatus((currentStatus) =>
      currentStatus === "playing" && !replace ? currentStatus : "loading",
    );
    setError(null);

    try {
      const response = await fetch(
        `/api/stream?genre=${encodeURIComponent(genre)}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`Stream request failed with status ${response.status}`);
      }

      const stream = (await response.json()) as StreamResponse;

      if (stream.items.length === 0) {
        throw new Error("The stream did not return any audio items.");
      }

      if (replace || !currentItemRef.current) {
        setCurrentItem(stream.items[0]);
        setQueue(stream.items.slice(1));
      } else {
        setQueue((existingQueue) => [...existingQueue, ...stream.items]);
      }

      setStatus("playing");
    } catch (streamError) {
      setError(
        streamError instanceof Error
          ? streamError.message
          : "Unable to load the next radio item.",
      );
      setStatus("error");
    }
  }, []);

  const playGenre = useCallback(
    async (genre: string) => {
      selectedGenreRef.current = genre;
      setSelectedGenre(genre);
      setQueue([]);
      setCurrentItem(null);
      await requestNext(genre, true);
    },
    [requestNext],
  );

  const handleEnded = useCallback(() => {
    if (queue.length > 0) {
      const [nextItem, ...remainingQueue] = queue;
      setCurrentItem(nextItem);
      setQueue(remainingQueue);
      return;
    }

    void requestNext(selectedGenreRef.current, true);
  }, [queue, requestNext]);

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      void audio.play();
      setStatus("playing");
    } else {
      audio.pause();
      setStatus("paused");
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentItem) {
      return;
    }

    audio.src = currentItem.audioUrl;
    audio.load();
    const playPromise = audio.play();

    if (playPromise) {
      playPromise
        .then(() => setStatus("playing"))
        .catch((playError) => {
          setError(
            playError instanceof Error
              ? playError.message
              : "Browser blocked audio playback.",
          );
          setStatus("error");
        });
    }
  }, [currentItem]);

  useEffect(() => {
    if (queue[0]?.audioUrl) {
      const preload = new Audio(queue[0].audioUrl);
      preload.preload = "auto";
      preload.load();
    }
  }, [queue]);

  return {
    audioRef,
    currentItem,
    error,
    handleEnded,
    playGenre,
    queue,
    selectedGenre,
    status,
    togglePlayback,
  };
}
