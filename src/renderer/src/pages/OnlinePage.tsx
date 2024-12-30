'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Music, Clock, Headphones } from 'lucide-react'
import '../assets/background.css'
import WaveDots from '@/components/waves'
import wsclient from '@/wsclient'

interface User {
    id: string
    username: string
    currentSong?: string
    lastPlayedAt?: Date
}

export default function FindUsersOnline() {

    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        const user_id = localStorage.getItem("user_id")
        wsclient.connect(user_id)
        setTimeout(() => {
            wsclient.suscribeTo("/topic/online")
            wsclient.sendTo("/app/end1", "Hellow")
        }, 1000);


        // Simulating fetching users data
        const fetchUsers = async () => {
            // In a real app, this would be an API call
            const mockUsers: User[] = [
                { id: '1', username: 'melody_master', currentSong: 'Bohemian Rhapsody' },
                { id: '2', username: 'rock_n_roller', lastPlayedAt: new Date(Date.now() - 15 * 60000) },
                { id: '3', username: 'jazz_cat', currentSong: 'Take Five' },
                { id: '4', username: 'pop_princess', lastPlayedAt: new Date(Date.now() - 45 * 60000) },
                { id: '5', username: 'classical_virtuoso', currentSong: 'Moonlight Sonata' },
                { id: '6', username: 'classical_virtuoso', currentSong: 'Moonlight Sonata' },

            ]
            setUsers(mockUsers)
        }

        fetchUsers()
    }, [])

    return (
        <ScrollArea className=" container overflow-auto gradient-body p-10 font-[Ubuntu] mx-auto">
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
    return (
        <Card className="bg-zinc-800 group2 relative group border-primary text-white mb-4">
            <CardContent className="flex items-center p-4">
                <div className="w-10 h-10 mr-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {user.username[0].toUpperCase()}
                </div>
                <div className="flex-grow">
                    <h2 className="text-lg font-semibold">{user.username}</h2>
                    {user.currentSong ? (
                        <div className="flex items-center">
                            <Music className="w-4 h-4 mr-2 text-green-500" />
                            <p className="text-green-500 font-bold">
                                {user.currentSong}
                                <span className="ml-2 inline-block">
                                    <WaveDots />
                                </span>
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center text-muted-foreground">
                            <Clock className="w-4 h-4 mr-2" />
                            <p>Last played {formatTimeSince(user.lastPlayedAt)} ago</p>
                        </div>
                    )}
                </div>
            </CardContent>
            {user.currentSong && (
                <div
                    className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`Listen along with ${user.username} to ${user.currentSong}`}
                >
                    <div className="flex items-center text-white">
                        <Headphones className="w-6 h-6 mr-2" />
                        <p className="text-lg font-semibold">Listen Along</p>
                    </div>
                </div>
            )}
        </Card>
    )
}


function formatTimeSince(date?: Date): string {
    if (!date) return 'unknown time'
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds} seconds`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minutes`
    const hours = Math.floor(minutes / 60)
    return `${hours} hours`
}

