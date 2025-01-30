'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Music, Clock, Headphones, UserIcon } from 'lucide-react'
import '../assets/background.css'
import { config } from '@/config'
import { client } from '@/App'
import axios from 'axios'

interface Song {
    id: string
    title: string
    artist: string
    thumbnail: {
        url: string
        width: number
        height: number
    }
    url: string
    durationFormatted: number
}

interface User {
    id: string
    username: string
    currentSong?: Song
    lastPlayedAt?: number
}


export default function FindUsersOnline() {
    const [users, setUsers] = useState<User[]>([])



    useEffect(() => {
        client.on("message", async (topic, message) => {
            if (topic === "/topic/online") {
                const data = JSON.parse(message.toString());
                await axios.get(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/api/users/${data.id}`).then((res) => {
                    data.username = res.data.username;
                });
                setUsers((users) => {
                    const filteredUsers = users.filter((user) => user.id !== data.id);
                    return [...filteredUsers, data];
                });
                console.log(users);
            }
        });
    }, []);




    return (
        <ScrollArea className="container overflow-auto gradient-body p-10 font-[Ubuntu] mx-auto">
            <h1 className="z-0 text-2xl font-bold mb-4 uppercase text-white">Find Users Online</h1>

            <div className="h-lvh">
                {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>

        </ScrollArea>
    )
}

function UserCard({ user }: { user: User }) {
    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000)
        const seconds = ((ms % 60000) / 1000).toFixed(0)
        return `${minutes}:${seconds.padStart(2, '0')}`
    }

    return (
        <Card className="bg-zinc-800/80 m-2 backdrop-blur-sm group relative border-primary text-white hover:bg-zinc-800 transition-colors">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <div className="relative">
                        {user.currentSong ? (
                            <img
                                src={user.currentSong.thumbnail.url}
                                alt={user.currentSong.title}
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center">
                                <UserIcon className="w-8 h-8 text-primary-foreground" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h2 className="text-lg font-semibold truncate">{user.username}</h2>
                        <h2>is listening:</h2>

                        {user.currentSong ? (
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Music className="w-4 h-4 text-green-500" />
                                    <p className="text-green-500 font-medium truncate">
                                        {user.currentSong.title}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{user.currentSong.artist}</span>
                                    <span>•</span>
                                    <span>{formatDuration(user.currentSong.durationFormatted)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <p>Last played {user.lastPlayedAt} ago</p>
                            </div>
                        )}
                    </div>
                </div>

                {user.currentSong && (
                    <a
                        href={user.currentSong.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg cursor-pointer"
                    >
                        <div className="flex items-center text-white">
                            <Headphones className="w-6 h-6 mr-2" />
                            <span className="font-medium">Listen Along</span>
                        </div>
                    </a>
                )}
            </CardContent>
        </Card>
    )
}


