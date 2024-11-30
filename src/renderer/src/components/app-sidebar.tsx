declare global {
  interface Window {
    electronAPI: {
      openFile: () => Promise<string | undefined>
      readFile: (filePath: string) => Promise<string>
    }
  }
}

import React, { useEffect, useRef, useState } from 'react'
import { Heart, Library, LogOut, Plus, Search, Settings, Upload, User, X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { toast, useToast } from '@/hooks/use-toast'
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
import { dialog, ipcRenderer } from 'electron'

interface Playlist {
  name: string
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

export default function MusicPlayerNavbar() {
  const [isSearching, setIsSearching] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { toast } = useToast()
  const [image, setImage] = useState<File | null>(null)
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { logout } = useAuth()
  const playlists1 = [
    { name: 'Liked Songs', count: '2,459 songs', icon: 'heart' },
    {
      name: 'Sonic Frontiers: Cyber Space...',
      artist: 'Andrew González',
      cover: '/placeholder.svg?height=40&width=40'
    },
    {
      name: 'rolitas locas 2',
      artist: 'Andrew González',
      cover: '/placeholder.svg?height=40&width=40'
    },
    {
      name: 'lofi beats',
      artist: 'Spotify',
      cover: '/placeholder.svg?height=40&width=40'
    },
    {
      name: 'stalled',
      artist: 'Andrew González',
      cover: '/placeholder.svg?height=40&width=40'
    },
    {
      name: '【Future Funk】',
      artist: 'Andrew González',
      cover: '/placeholder.svg?height=40&width=40'
    },
    {
      name: 'This Is Crystal Castles',
      artist: 'Spotify',
      cover: '/placeholder.svg?height=40&width=40'
    }
  ]

  useEffect(() => {
    const user_id = localStorage.getItem('user_id')
    axios.get(`http://localhost:8080/api/users/${user_id}`).then((res) => {
      setUser(res.data)
      setPlaylists(res.data.playlists)
    })
  }, [])

  const handleImageUpload = async () => {
    console.log('asdad')
    const filePath = await ipcRenderer.invoke('dialog:openFile')
  }

  const removeImage = () => {
    setImagePath(null)
    setImagePreview(null)
  }

  const filteredPlaylists = playlists.filter(
    (playlist) =>
      playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePlaylistClick = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() === '') {
      toast({
        title: 'Error',
        description: 'Playlist name is required',
        variant: 'destructive'
      })
      return
    }
    // Here you would typically send the data to your backend
    console.log('Creating playlist:', { name, description, imagePath })
    toast({
      title: 'Success',
      description: 'Playlist created successfully!'
    })
    setOpen(false)
    setName('')
    setDescription('')
    setImagePath(null)
    setImagePreview(null)
  }

  return (
    <div className="select-none flex flex-col h-screen w-[350px] bg-[#121212] text-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.username}</span>
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
            <Button
              onClick={handlePlaylistClick}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#232323]"
            >
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-[#232323]">
                    <Plus className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className=" sm:max-w-[425px]">
                  <form onSubmit={handlePlaylistClick}>
                    <DialogHeader>
                      <DialogTitle>Create New Playlist</DialogTitle>
                      <DialogDescription>
                        Enter the details for your new playlist here. Click save when you're done.
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
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image" className="text-right">
                          Image
                        </Label>
                        <div className="col-span-3">
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="image"
                              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">Click to upload</span> or drag and
                                  drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                                </p>
                              </div>
                              <Button id="image" onClick={handleImageUpload} />
                            </label>
                          </div>
                          {imagePreview && (
                            <div className="mt-4 relative">
                              <img
                                src={imagePreview}
                                alt="Playlist cover"
                                width={200}
                                height={200}
                                style={{ objectFit: 'cover' }}
                                className="rounded-md"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 rounded-full"
                                onClick={removeImage}
                                aria-label="Remove image"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Playlist</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#232323]"
              onClick={() => (window.location.href = `/`)}
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
              className="text-[#b3b3b3] hover:text-white"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          {!isSearching && (
            <Button variant="ghost" className="text-sm text-[#b3b3b3] hover:text-white">
              Recents
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <div className="px-2">
          {filteredPlaylists.map((playlist, index) => (
            <React.Fragment key={playlist.name}>
              <div className="flex items-center space-x-3 py-2 px-4 hover:bg-[#232323] rounded-md cursor-pointer">
                {playlist.icon === 'heart' ? (
                  <div className="w-10 h-10 bg-gradient-to-br from-[#65f1da] to-[#ee306f] flex items-center justify-center rounded">
                    <Heart />
                  </div>
                ) : (
                  <img src={playlist.cover} alt={playlist.name} className="w-10 h-10 rounded" />
                )}
                <div>
                  <div className="font-medium">{playlist.name}</div>
                  <div className="text-sm text-[#b3b3b3]">{playlist.count || playlist.artist}</div>
                </div>
              </div>
              {index < filteredPlaylists.length - 1 && <Separator className="my-2 bg-[#282828]" />}
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
