'use client'
import SearchBar from '@/components/search-bar'
import React, { useEffect, useState } from 'react'
import { Play } from 'lucide-react'
import query from '@/finder'
import audioPlayer from '@/stream.js'
import { usePlayer } from '@/context/PlayerContext'
import { Spinner } from '@/components/ui/spinner'
import axios from 'axios'
import BACKEND_URL from '@/config'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Song {
  title: string
  thumbnail: {
    url
  }
  url: string
  id: string
  artist: string
  durationFormatted: string
}

export default function SearchPage() {
  const { setCurrentSong } = usePlayer()
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const search = window.location.href.split('=')[1].replaceAll('%20', ' ')
    setLoading(true)
    query(search).then((data) => {
      setSongs(data)
      setLoading(false)
    })
  }, [])

  const handleSongClick = (song) => {
    if (audioPlayer.isPlaying) {
      audioPlayer.stop()
    } else {
      setCurrentSong({
        title: song.title,
        artist: song.channel.name,
        thumbnail: song.thumbnail,
        url: song.url,
        id: song.id,
        durationFormatted: song.durationFormatted
      })
      audioPlayer.enqueue(song.url)
      axios.post(`http://${BACKEND_URL}:8080/api/songs/add`, {
        ytId: song.id,
        title: song.title,
        artist: song.artist,
        url: song.url,
        thumbnailUrl: song.thumbnail.url,
        duration: song.durationFormatted
      }).then((r) => {
        if (r.status != 200) return
      })
    }
  }

  return (
    <div className=" w-full bg-black text-white p-4">
      <SearchBar />
      {loading ? (
        <div className="justify-center items-center gap-3">
          <Spinner className="items-center justify-center" size="large" />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Songs</h2>
            <ScrollArea className="space-y-2">
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
                    <div className="select-none font-medium group-hover:text-white">
                      {song.title}
                    </div>
                    <div className="select-none text-sm text-zinc-400">{song.artist}</div>
                  </div>
                  <div className="select-none text-sm text-zinc-400">{song.durationFormatted}</div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  )
}