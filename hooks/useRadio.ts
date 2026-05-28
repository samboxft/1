"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const GENRES = ["Lofi", "Jazz", "Electronic"] as const;

export type Genre = (typeof GENRES)[number];

export type QueueItem = {
  kind: "host" | "song" | "news";
  title: string;
  artist: string;
  genre: string;
  audioUrl: string;
  script?: string;
  songId?: number;
};

type StreamResponse = {
  type?: "music" | "news";
  queue?: QueueItem[];
};

function normalizeQueue(payload: StreamResponse | QueueItem[] | QueueItem): QueueItem[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if ("queue" in payload && Array.isArray(payload.queue)) {
    return payload.queue;
  }

  if ("audioUrl" in payload) {
    return [payload];
  }

  return [];
}

export function useRadio(initialGenre: Genre = "Lofi") {
  const [selectedGenre, setSelectedGenre] = useState<Genre>(initialGenre);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const preloaderRef = useRef<HTMLAudioElement | null>(null);
  const requestInFlightRef = useRef(false);

  const fetchChunk = useCallback(async (genre: Genre): Promise<QueueItem[]> => {
    const response = await fetch(`/api/stream?genre=${encodeURIComponent(genre)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Stream request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as StreamResponse | QueueItem[] | QueueItem;
    return normalizeQueue(payload);
  }, []);

  const replaceQueueForGenre = useCallback(
    async (genre: Genre) => {
      setIsLoading(true);
      setError(null);
      setQueue([]);

      try {
        const chunk = await fetchChunk(genre);
        setQueue(chunk);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load stream.");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchChunk],
  );

  const enqueueChunk = useCallback(async () => {
    if (requestInFlightRef.current) {
      return;
    }

    requestInFlightRef.current = true;
    try {
      const chunk = await fetchChunk(selectedGenre);
      if (chunk.length > 0) {
        setQueue((previousQueue) => [...previousQueue, ...chunk]);
      }
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to continue playback.");
    } finally {
      requestInFlightRef.current = false;
    }
  }, [fetchChunk, selectedGenre]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void replaceQueueForGenre(selectedGenre);
  }, [replaceQueueForGenre, selectedGenre]);

  useEffect(() => {
    if (isLoading || queue.length > 1) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    void enqueueChunk();
  }, [enqueueChunk, isLoading, queue.length]);

  useEffect(() => {
    const nextItem = queue[1];
    if (!nextItem) {
      preloaderRef.current = null;
      return;
    }

    const preloadedAudio = new Audio(nextItem.audioUrl);
    preloadedAudio.preload = "auto";
    preloaderRef.current = preloadedAudio;
  }, [queue]);

  const handleEnded = useCallback(() => {
    setQueue((previousQueue) => previousQueue.slice(1));
  }, []);

  const handleGenreChange = useCallback((genre: Genre) => {
    setSelectedGenre(genre);
  }, []);

  const currentItem = queue[0] ?? null;

  return {
    audioRef,
    currentItem,
    error,
    handleEnded,
    handleGenreChange,
    isLoading,
    isPlaying,
    queue,
    selectedGenre,
    setIsPlaying,
  };
}
