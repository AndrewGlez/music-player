import React, { useEffect, useState } from 'react'
import { useToast } from '../hooks/use-toast'
import { History, Library, LogOut, Plus, Search, Settings, Trash2Icon, User } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Home } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { useNavigate } from 'react-router-dom'
import BACKEND_URL from '@/config'
import PlaylistIcon from './PlaylistIcon' // Import the new SVG component

interface Playlist {
  id: number
  title: string
  artist?: string
  cover?: string
  count?: string
  icon?: string
}

interface User {
  username: string
  email: string
  password: string
  country: string
  playlists: Playlist[]
}

interface Song {
  id: string
  playlistId: string
  title: string
  artist: string
  url: string
  thumb: string
}

export default function MusicPlayerNavbar() {
  const [songs, setSongs] = useState<Song[]>([])
  const [isSearching, setIsSearching] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { toast } = useToast()
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const user_id = localStorage.getItem('user_id')
    // GET Songs
    axios.get(`http://${BACKEND_URL}:8080/api/songs`).then((res) => {
      setSongs(res.data)
    })
    // GET User data and playlists
    axios.get(`http://${BACKEND_URL}:8080/api/users/${user_id}`).then((res) => {
      setUser(res.data)
      setPlaylists(res.data.playlists)
    })
  }, [])

  const filteredPlaylists = playlists.filter(
    (playlist) =>
      playlist.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePlaylistClick = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() === '' || description.trim() === '') {
      toast({
        title: 'Error',
        description: 'Playlist name is required',
        variant: 'destructive'
      })
      return
    }
    // Here you would typically send the data to your backend
    axios.post(`http://${BACKEND_URL}:8080/api/playlists/create`, {
      title: name,
      description: description,
      userid: localStorage.getItem('user_id')
    })
    console.log('Creating playlist:', { name, description })
    toast({
      title: 'Success',
      description: 'Playlist created successfully!'
    })
    setOpen(false)
    setName('')
    setDescription('')
  }

  return (
    <div className="select-none flex flex-col h-screen w-[350px] bg-[#121212] text-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start p-0 w-24 h-10 hover:bg-primary hover:text-white">
                <Avatar className="text-black w-8 h-8 mr-2">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-['BebasNeue'] mt-1 text-xl hover:text-primary">{user?.username.toLocaleUpperCase()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#282828] text-white border-[#3e3e3e]">
              <DropdownMenuItem className="focus:bg-[#3e3e3e] focus:text-white">
                <Settings className="mr-2 h-4 w-4" />
                <span>Options</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#3e3e3e]" />
              <DropdownMenuItem onClick={logout} className="focus:bg-[#3e3e3e] focus:text-white">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Library className="h-6 w-6" />
            <span className="font-semibold">Your Library</span>
          </div>
          <div className="flex items-center space-x-2">

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-primary hover:text-white">
                  <Plus className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className=" sm:max-w-[425px]">
                <form>
                  <DialogHeader>
                    <DialogTitle>Create New Playlist</DialogTitle>
                    <DialogDescription>
                      {` Enter the details for your new playlist here. Click save when you're done. `}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handlePlaylistClick} type="submit">
                      Save Playlist
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white hover:bg-primary"
              onClick={() => navigate('/', { replace: true })}
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          {isSearching ? (
            <Input
              type="text"
              placeholder="Search in Your Library"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#232323] border-none text-white placeholder-[#b3b3b3]"
            />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearching(true)}
              className="text-[#b3b3b3] hover:text-white hover:bg-primary"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

        </div>
      </div>
      <ScrollArea className="flex-grow">
        <div className="px-2">
          <div className="flex items-center space-x-3 py-2 px-4 hover:bg-[#232323] rounded-md cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-700 flex items-center justify-center rounded">
              <History />
            </div>
            <div>
              <div className="font-medium">History</div>
              <div className="text-sm text-[#b3b3b3]">{songs.length} songs</div>
            </div>
          </div>
          <Separator className='bg-zinc-800 my-5' />

          {filteredPlaylists.map((playlist, index) => (
            <React.Fragment key={playlist.title}>
              <a href={`/playlist?p=${playlist.id}`} className="flex items-center py-2 px-4 hover:bg-[#232323] rounded-md cursor-pointer">
                <PlaylistIcon />
                <div>
                  <div className="ml-3 font-medium">{playlist.title}</div>
                  <div className="text-sm text-[#b3b3b3]">{playlist.count || playlist.artist}</div>
                </div>
                <Trash2Icon className="h-4 w-4 ml-auto hover:text-red-600" />

              </a>

              {index < filteredPlaylists.length - 1 && <Separator className="my-2 bg-[#282828]" />}
            </React.Fragment>
          ))}
        </div>

      </ScrollArea>
    </div>
  )
}