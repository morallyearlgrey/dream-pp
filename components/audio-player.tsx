"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
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

type StoredAudioState = {
  currentIndex?: number;
  currentTime?: number;
  isPlaying?: boolean;
};

type AudioPlayerContextValue = {
  currentTrack: AudioTrack | undefined;
  hasTracks: boolean;
  isPlaying: boolean;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  trackNumber: number;
  totalTracks: number;
  togglePlayback: () => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);
const audioStorageKey = "kai-portfolio-audio-state";
function readStoredAudioState(): StoredAudioState | null {
  try {
    const value = window.localStorage.getItem(audioStorageKey);

    return value ? (JSON.parse(value) as StoredAudioState) : null;
  } catch {
    return null;
  }
}

function writeStoredAudioState(state: StoredAudioState) {
  try {
    window.localStorage.setItem(audioStorageKey, JSON.stringify(state));
  } catch {
    // Local storage is optional; route-level persistence still works without it.
  }
}

export function PersistentAudioProvider({
  children,
  tracks,
}: {
  children: ReactNode;
  tracks: AudioTrack[];
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const restoredRef = useRef(false);
  const pendingSeekRef = useRef<number | null>(null);
  const lastPersistedAtRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const safeCurrentIndex = tracks.length ? Math.min(currentIndex, tracks.length - 1) : 0;
  const currentTrack = tracks[safeCurrentIndex];
  const currentSrc = currentTrack?.src;

  useEffect(() => {
    if (restoredRef.current || !tracks.length) {
      return;
    }

    const stored = readStoredAudioState();

    if (stored) {
      if (typeof stored.currentTime === "number") {
        pendingSeekRef.current = Math.max(0, stored.currentTime);
      }

      window.requestAnimationFrame(() => {
        if (typeof stored.currentIndex === "number") {
          setCurrentIndex(Math.max(0, Math.min(stored.currentIndex, tracks.length - 1)));
        }

        if (stored.isPlaying) {
          setIsPlaying(true);
        }
      });
    }

    restoredRef.current = true;
  }, [tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || pendingSeekRef.current === null) {
      return;
    }

    const seekToStoredTime = () => {
      if (pendingSeekRef.current !== null) {
        audio.currentTime = pendingSeekRef.current;
        pendingSeekRef.current = null;
      }
    };

    if (audio.readyState >= 1) {
      seekToStoredTime();
      return;
    }

    audio.addEventListener("loadedmetadata", seekToStoredTime, { once: true });

    return () => audio.removeEventListener("loadedmetadata", seekToStoredTime);
  }, [currentSrc]);

  useEffect(() => {
    writeStoredAudioState({
      currentIndex: safeCurrentIndex,
      currentTime: audioRef.current?.currentTime ?? 0,
      isPlaying,
    });
  }, [isPlaying, safeCurrentIndex]);

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

  const persistCurrentTime = useCallback(() => {
    const now = Date.now();

    if (now - lastPersistedAtRef.current < 1500) {
      return;
    }

    lastPersistedAtRef.current = now;
    writeStoredAudioState({
      currentIndex: safeCurrentIndex,
      currentTime: audioRef.current?.currentTime ?? 0,
      isPlaying,
    });
  }, [isPlaying, safeCurrentIndex]);

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

  const playNextTrack = useCallback(() => {
    if (!tracks.length) {
      return;
    }

    if (tracks.length === 1) {
      const audio = audioRef.current;

      if (audio) {
        audio.currentTime = 0;
      }

      return;
    }

    pendingSeekRef.current = 0;
    setCurrentIndex((index) => (index + 1) % tracks.length);
  }, [tracks.length]);

  const playPreviousTrack = useCallback(() => {
    if (!tracks.length) {
      return;
    }

    if (tracks.length === 1) {
      const audio = audioRef.current;

      if (audio) {
        audio.currentTime = 0;
      }

      return;
    }

    pendingSeekRef.current = 0;
    setCurrentIndex((index) => (index - 1 + tracks.length) % tracks.length);
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
      playNextTrack,
      playPreviousTrack,
      trackNumber: tracks.length ? safeCurrentIndex + 1 : 0,
      totalTracks: tracks.length,
      togglePlayback,
    }),
    [
      currentTrack,
      isPlaying,
      playNextTrack,
      playPreviousTrack,
      safeCurrentIndex,
      togglePlayback,
      tracks.length,
    ],
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      <audio
        onEnded={handleEnded}
        onTimeUpdate={persistCurrentTime}
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
  const {
    currentTrack,
    hasTracks,
    isPlaying,
    playNextTrack,
    playPreviousTrack,
    togglePlayback,
    trackNumber,
    totalTracks,
  } = useAudioPlayer();
  const title = currentTrack?.title ?? "No MP3s in /audio";
  const status = hasTracks ? (isPlaying ? "Playing" : "Paused") : "Add tracks";
  const Icon = isPlaying ? Pause : Play;

  return (
    <div aria-live="polite" className="grid gap-1.5 sm:gap-2">
      <div className="flex items-center gap-2 text-[9px] leading-none">
        <span className="text-[#8f2b35]">Now playing</span>
        <span className="h-px flex-1 bg-[var(--color-text)]/24" />
        <span>{hasTracks ? `${trackNumber}/${totalTracks}` : "0/0"}</span>
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <button
          aria-label="Previous track"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center border border-[var(--color-text)]/20 bg-[var(--color-deep)]/72 text-[var(--color-text)]/70 transition hover:border-[#8f2b35] hover:text-[#8f2b35] disabled:cursor-not-allowed disabled:opacity-35 sm:h-8 sm:w-8"
          disabled={!hasTracks}
          onClick={playPreviousTrack}
          type="button"
        >
          <SkipBack aria-hidden="true" size={13} strokeWidth={2} />
        </button>
        <button
          aria-label={isPlaying ? "Pause track" : "Play track"}
          aria-pressed={isPlaying}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center border border-[var(--color-text)]/28 bg-[var(--color-deep)]/72 text-[var(--color-text)] transition hover:border-[#8f2b35] hover:text-[#8f2b35] disabled:cursor-not-allowed disabled:opacity-35 sm:h-8 sm:w-8"
          disabled={!hasTracks}
          onClick={togglePlayback}
          type="button"
        >
          <Icon aria-hidden="true" size={14} strokeWidth={2} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[9px] font-bold uppercase leading-none text-[var(--color-text)] sm:text-[10px]">
            {title}
          </p>
          <p className="mt-1 text-[8px] font-bold uppercase leading-none text-[var(--color-text)]/44">
            {status}
          </p>
        </div>
        <button
          aria-label="Next track"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center border border-[var(--color-text)]/20 bg-[var(--color-deep)]/72 text-[var(--color-text)]/70 transition hover:border-[#8f2b35] hover:text-[#8f2b35] disabled:cursor-not-allowed disabled:opacity-35 sm:h-8 sm:w-8"
          disabled={!hasTracks}
          onClick={playNextTrack}
          type="button"
        >
          <SkipForward aria-hidden="true" size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export function GlobalAudioDock() {
  return (
    <aside className="fixed bottom-4 left-4 z-[70] w-[min(360px,calc(100vw-2rem))] border border-[var(--color-text)]/24 bg-[var(--color-card-surface)]/92 p-3 text-[var(--color-text)] shadow-[0_10px_28px_rgba(0,0,0,0.22)] backdrop-blur-md">
      <NowPlayingModule />
    </aside>
  );
}
