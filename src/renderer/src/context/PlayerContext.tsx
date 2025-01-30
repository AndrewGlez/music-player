import { client } from '@/App'
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
  const user_id = localStorage.getItem('user_id')
  const date = new Date(Date.now())
  const lastPlayedAt = date.toLocaleString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const onlineStatus = JSON.stringify({
    id: user_id,
    currentSong,
    lastPlayedAt,
  })

  // Send the current song to mqtt
  client.publish(`/topic/online`,
    onlineStatus
  )
  console.log('Published current song to mqtt', onlineStatus)



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
