'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { Tables } from '@/types_db';

export type PlayerContextType = {
  activeSong: Tables<'songs'> | null;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  setActiveSong: (song: Tables<'songs'> | null) => void;
  // Add more control functions here if needed (e.g., play, pause, next)
};

const PlayerContext = createContext<PlayerContextType | null>(null);

interface PlayerProviderProps {
  children: React.ReactNode;
}

const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [activeSong, setActiveSong] = useState<Tables<'songs'> | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const value = useMemo(() => ({
    activeSong,
    isPlaying,
    setIsPlaying,
    setActiveSong
  }), [activeSong, isPlaying]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === null) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};