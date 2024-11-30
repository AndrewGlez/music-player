'use client'
import SearchBar from '@/components/search-bar'
import React, { useEffect, useState } from 'react'
import { Play } from 'lucide-react'
import query from '@/finder'
import streamAudio from '@/stream.js'
import audioPlayer from '@/stream.js'
import { usePlayer } from '@/context/PlayerContext'

export default function SearchPage() {
  const { setCurrentSong } = usePlayer()
  const [songs, setSongs] = useState([])
  useEffect(() => {
    const search = window.location.href.split('=')[1].replaceAll('%20', ' ')
    query(search).then((data) => {
      setSongs(data)
      console.log(data)
    })
  }, [])

  const handleSongClick = (song) => {
    if (audioPlayer.isPlaying) {
      audioPlayer.stop()
    } else {
      setCurrentSong({
        title: song.title,
        artist: song.channel.name,
        thumbnail: song.thumbnail
      })
      audioPlayer.enqueue(song.url)
    }
  }

  return (
    <div className="min-h-screen w-full bg-black text-white p-4">
      <SearchBar />
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Songs</h2>
          <div className="space-y-2">
            {songs.map((song, index) => (
              <div
                key={index}
                onClick={() => handleSongClick(song)}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-zinc-800 transition-colors group"
              >
                <Play className="opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4 mr-2" />
                <img
                  src={song.thumbnail.url}
                  alt="Song thumbnail"
                  className="select-none w-10 h-10 rounded object-cover"
                  width={40}
                  height={40}
                />

                <div className="flex-1">
                  <div className="select-none font-medium group-hover:text-white">{song.title}</div>
                  <div className="select-none text-sm text-zinc-400">{song.artist}</div>
                </div>
                <div className="select-none text-sm text-zinc-400">{song.durationFormatted}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
