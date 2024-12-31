'use client'
import SearchBar from '@/components/search-bar'
import { useEffect, useState } from 'react'
import { Play, PlusCircle } from 'lucide-react'
import query from '@/finder'
import audioPlayer from '@/stream.js'
import { usePlayer } from '@/context/PlayerContext'
import { Spinner } from '@/components/ui/spinner'
import axios from 'axios'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { toast, ToastContainer } from 'react-toastify'
import { config } from '@/config'
import { useParams } from 'react-router-dom'

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

interface Song {
  title: string
  thumbnail: {
    url
  }
  url: string
  id: string
  channel: {
    name
  }
  durationFormatted: string
}

interface SavedSong {
  title: string
  thumbnail: {
    url
  }
  url: string
  ytId: string
  id: string
  artist: string
  durationFormatted: string
}
interface Playlist {
  id: string
  title: string
  description: string
  tracks: Song[]
}

export default function SearchPage() {
  const { setCurrentSong } = usePlayer()
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [playlists, setPlaylists] = useState<Playlist[]>()
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>()
  const [savedSong, setSavedSong] = useState<SavedSong | null>(null)
  const { searchQuery } = useParams();

  const getPlaylists = async () => {
    const user_id = localStorage.getItem('user_id')

    axios
      .get(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/api/users/${user_id}`)
      .then((res) => {
        setPlaylists(res.data.playlists)
      })
  }
  useEffect(() => {

    console.log(searchQuery)

    setLoading(true)
    query(searchQuery).then((data) => {
      setSongs(data as any)
      setLoading(false)
    })
  }, [searchQuery])


  const handleSongClick = (song) => {
    if (audioPlayer.isPlaying) {
      audioPlayer.stop()
      audioPlayer.enqueue(song.url)
      setCurrentSong({
        title: song.title,
        artist: song.artist ?? 'Unknown artist',
        thumbnail: song.thumbnail,
        url: song.url,
        id: song.id,
        durationFormatted: song.duration
      })
    } else {
      setCurrentSong({
        title: song.title,
        artist: song.channel.name,
        thumbnail: song.thumbnail,
        url: song.url,
        id: song.id,
        durationFormatted: song.duration
      })
      audioPlayer.enqueue(song.url)
      axios
        .post(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/api/songs/add`, {
          ytId: song.id,
          title: song.title,
          artist: song.channel.name,
          url: song.url,
          thumbnailUrl: song.thumbnail.url,
          duration: song.durationFormatted
        })
        .then((r) => {
          if (r.status != 200) return
        })
    }
  }

  const handlePlaylistDialog = async (song: Song) => {
    console.log(song)
    axios
      .post(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/api/songs/add`, {
        ytId: song.id,
        title: song.title,
        artist: song.channel.name,
        url: song.url,
        thumbnailUrl: song.thumbnail.url,
        duration: song.durationFormatted
      })
      .then((r) => {
        setSavedSong({
          id: r.data.id,
          ytId: r.data.ytId,
          title: r.data.title,
          artist: r.data.artist,
          url: r.data.url,
          thumbnail: r.data.thumbnail,
          durationFormatted: r.data.durationFormatted
        })
        console.log('Saved song: ', r.data)
        return
      })

    setIsDialogOpen(true)
    await getPlaylists()
  }

  const handleAddSong = async (playlistId: string) => {
    console.log(playlistId)
    axios
      .post(
        `http://${config.BACKEND_URL}:${config.BACKEND_PORT}/api/playlists/${playlistId}/addSong/${savedSong?.id}`
      )
      .then((r) => {
        if (r.status == 200) {
          toast.success('Song saved successfully')
        } else toast.error('An error occurred saving song')
      })
  }

  return (
    <ScrollArea className=" w-full overflow-auto bg-black text-white p-4">
      <SearchBar />
      <ToastContainer />
      {loading ? (
        <div className="justify-center items-center gap-3">
          <Spinner className="items-center justify-center" size="large" />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Songs</h2>
            <div className="h-[1080px] space-y-2">
              {songs.map((song, index) => (
                <div
                  key={index}
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
                    <ContextMenu>
                      <ContextMenuTrigger>
                        <div
                          onClick={() => handleSongClick(song)}
                          className="select-none font-medium group-hover:text-primary"
                        >
                          {song.title}
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem onClick={() => handlePlaylistDialog(song)}>
                          <PlusCircle className="text-blue-600 font-bold w-4 h-4 mr-2" />
                          Add to playlist
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                    <Dialog
                      open={isDialogOpen}
                      onOpenChange={() => {
                        setIsDialogOpen(!isDialogOpen)
                      }}
                    >
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Select a playlist</DialogTitle>
                          <DialogDescription>Select a playlist to add the song.</DialogDescription>
                        </DialogHeader>
                        <Select
                          onValueChange={(value) =>
                            setSelectedPlaylist(
                              playlists?.find((playlist) => playlist.id === value)
                            )
                          }
                          value={selectedPlaylist?.id}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a playlist" />
                          </SelectTrigger>
                          <SelectContent>
                            {playlists?.map((playlist) => (
                              <SelectItem key={playlist.id} value={playlist.id}>
                                {playlist.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild>
                            <Button
                              onClick={() =>
                                selectedPlaylist?.id && handleAddSong(selectedPlaylist.id)
                              }
                              type="button"
                              variant="default"
                            >
                              OK
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <div className="select-none text-sm text-zinc-400">{song.artist}</div>
                  </div>
                  <div className="select-none text-sm text-zinc-400">{song.durationFormatted}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ScrollArea>
  )
}
