import React, { createContext, useState, useContext } from 'react'

interface SongInfo {
  title: string
  artist: string
  url: string
  id: string
  thumbnail: string
  durationFormatted: string
}

interface PlayerContextType {
  currentSong: SongInfo | null
  setCurrentSong: (song: SongInfo | null) => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<SongInfo | null>(null)



  return (
    <PlayerContext.Provider value={{ currentSong, setCurrentSong }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}
