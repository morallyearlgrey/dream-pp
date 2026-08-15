"use client";

import { Pause, Play } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type AudioTrack = {
  src: string;
  title: string;
};

type AudioPlayerContextValue = {
  currentTrack: AudioTrack | undefined;
  hasTracks: boolean;
  isPlaying: boolean;
  trackNumber: number;
  totalTracks: number;
  togglePlayback: () => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function PersistentAudioProvider({
  children,
  tracks,
}: {
  children: ReactNode;
  tracks: AudioTrack[];
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const safeCurrentIndex = tracks.length ? Math.min(currentIndex, tracks.length - 1) : 0;
  const currentTrack = tracks[safeCurrentIndex];
  const currentSrc = currentTrack?.src;

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentSrc) {
      return;
    }

    if (!isPlaying) {
      audio.pause();
      return;
    }

    void audio.play().catch(() => setIsPlaying(false));
  }, [currentSrc, isPlaying]);

  const handleEnded = useCallback(() => {
    if (!tracks.length) {
      setIsPlaying(false);
      return;
    }

    if (tracks.length === 1) {
      const audio = audioRef.current;

      if (audio) {
        audio.currentTime = 0;
        void audio.play().catch(() => setIsPlaying(false));
      }

      return;
    }

    setCurrentIndex((index) => (index + 1) % tracks.length);
    setIsPlaying(true);
  }, [tracks.length]);

  const togglePlayback = useCallback(() => {
    if (!tracks.length) {
      return;
    }

    setIsPlaying((playing) => !playing);
  }, [tracks.length]);

  const value = useMemo<AudioPlayerContextValue>(
    () => ({
      currentTrack,
      hasTracks: tracks.length > 0,
      isPlaying,
      trackNumber: tracks.length ? safeCurrentIndex + 1 : 0,
      totalTracks: tracks.length,
      togglePlayback,
    }),
    [currentTrack, isPlaying, safeCurrentIndex, togglePlayback, tracks.length],
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      <audio
        onEnded={handleEnded}
        preload="metadata"
        ref={audioRef}
        src={currentSrc}
      />
    </AudioPlayerContext.Provider>
  );
}

function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);

  if (!context) {
    throw new Error("useAudioPlayer must be used inside PersistentAudioProvider");
  }

  return context;
}

export function NowPlayingModule() {
  const { currentTrack, hasTracks, isPlaying, togglePlayback, trackNumber, totalTracks } =
    useAudioPlayer();
  const title = currentTrack?.title ?? "No MP3s in /audio";
  const status = hasTracks ? (isPlaying ? "Playing" : "Paused") : "Add tracks";
  const Icon = isPlaying ? Pause : Play;

  return (
    <div aria-live="polite" className="grid gap-1.5 sm:gap-2">
      <div className="flex items-center gap-2 text-[9px] leading-none">
        <span className="text-[#8f2b35]">Now playing</span>
        <span className="h-px flex-1 bg-[#f2e5c6]/24" />
        <span>{hasTracks ? `${trackNumber}/${totalTracks}` : "0/0"}</span>
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <button
          aria-label={isPlaying ? "Pause track" : "Play track"}
          aria-pressed={isPlaying}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center border border-[#f2e5c6]/28 bg-[#080807]/72 text-[#f2e5c6] transition hover:border-[#8f2b35] hover:text-[#8f2b35] disabled:cursor-not-allowed disabled:opacity-35 sm:h-8 sm:w-8"
          disabled={!hasTracks}
          onClick={togglePlayback}
          type="button"
        >
          <Icon aria-hidden="true" size={14} strokeWidth={2} />
        </button>
        <div className="min-w-0">
          <p className="truncate text-[9px] font-bold uppercase leading-none text-[#f2e5c6] sm:text-[10px]">
            {title}
          </p>
          <p className="mt-1 text-[8px] font-bold uppercase leading-none text-[#f2e5c6]/44">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}
