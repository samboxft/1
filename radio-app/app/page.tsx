"use client";

import { useEffect, useState } from "react";
import { useRadio } from "@/hooks/useRadio";
import GenreSidebar from "@/components/GenreSidebar";
import PlayerCard from "@/components/PlayerCard";

interface Genre {
  id: number;
  name: string;
  _count: { songs: number };
}

export default function RadioPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const {
    status,
    nowPlaying,
    currentGenre,
    volume,
    selectGenre,
    togglePlayPause,
    setVolume,
    analyserNode,
  } = useRadio();

  useEffect(() => {
    fetch("/api/genres")
      .then((r) => r.json())
      .then(setGenres)
      .catch(console.error);
  }, []);

  return (
    <div className="h-screen flex bg-gray-950 text-white overflow-hidden">
      <GenreSidebar
        genres={genres}
        currentGenre={currentGenre}
        onSelect={selectGenre}
        disabled={status === "loading"}
      />
      <PlayerCard
        status={status}
        nowPlaying={nowPlaying}
        currentGenre={currentGenre}
        volume={volume}
        analyserNode={analyserNode}
        onTogglePlay={togglePlayPause}
        onVolumeChange={setVolume}
        onSelectGenre={selectGenre}
      />
    </div>
  );
}
