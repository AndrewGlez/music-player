import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BACKEND_URL from '@/config';
import { Trash2Icon, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AiOutlineSpotify } from "react-icons/ai";
import { usePlayer } from '@/context/PlayerContext';
import audioPlayer from '@/stream';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { ToastContainer } from 'react-toastify';




interface Song {
    title: string
    thumbnail: {
        url
    }
    url: string
    id: string
    artist: string
    duration: string
}


interface Playlist {
    id: number;
    title: string;
    description: string;
    tracks: Song[];
}

const PlaylistInfoPage: React.FC = () => {
    const { setCurrentSong } = usePlayer()

    const [playlist, setPlaylist] = useState<Playlist>();
    const [username, setUsername] = useState<string>();

    const fetchSongs = async () => {
        const playlistId = window.location.href.split('=')[1]

        try {
            await axios.get(`http://${BACKEND_URL}:8080/api/playlists/${playlistId}`)
                .then((res) => { setPlaylist(res.data) });
            axios.get(`http://${BACKEND_URL}:8080/api/users/${localStorage.getItem('user_id')}`).then((res) => {
                setUsername(res.data.username)
            })

        } catch (e) {
            console.log(e)
        }
    };
    useEffect(() => {
        fetchSongs();
    }, []);

    const handleSongClick = (song) => {
        if (audioPlayer.isPlaying) {
            audioPlayer.stop()
        } else {
            console.log(song.thumbnailUrl)
            setCurrentSong({
                title: song.title,
                artist: song.artist ?? "Unknown artist",
                thumbnail: song.thumbnailUrl,
                url: song.url,
                id: song.id,
                durationFormatted: song.durationFormatted
            })
            audioPlayer.enqueue(song.url)

        }
    }
    const handleDeleteSong = (playlistId: number, songId: string) => {
        axios.delete(`http://${BACKEND_URL}:8080/api/playlists/${playlistId}/deleteSong/${songId}`).then(async (res) => {
            console.log(res.data)
            await fetchSongs()
        })
    }

    return (

        <div className="w-full min-h-screen bg-gradient-to-b from-primary to-neutral-950">
            <ToastContainer />

            <div className="px-6 py-14">
                <div className="space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold font-[LexendPeta] text-white md:text-5xl">{playlist?.title}</h1>
                        <span className="text-sm font-thin text-zinc-400">{playlist?.description}</span>

                        <div className="mt-2 flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback><User className='p-1'></User></AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-white">{username}</span>
                            <span className="text-sm text-zinc-400">{playlist?.tracks.length} Songs</span>
                        </div>
                    </div>


                    <div className="relative py-10">
                        <table className="w-full select-none">
                            <thead >
                                <tr className="border-b border-white/15 text-left text-sm text-zinc-400">
                                    <th className="pb-3 pl-4">#</th>
                                    <th className="pb-3 pl-4">Title</th>
                                    <th className="pb-3 pl-4">Artist</th>
                                    <th className="pb-3 pl-4 text-right">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm" >
                                {playlist?.tracks.map((track, i) => (
                                    <tr
                                        key={i}
                                        className="group hover:bg-white/10 select-none rounded"

                                    >
                                        <td className="px-4 py-2 text-zinc-400">{i + 1}</td>

                                        <ContextMenu>
                                            <ContextMenuTrigger>
                                                <td className="px-4 py-2">
                                                    <div className="flex text-neutral-400 hover:text-white items-center gap-3">
                                                        <AiOutlineSpotify className=' text-xl ' />

                                                        <div>
                                                            <div onClick={() => handleSongClick(track)}
                                                            >{track.title}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                            </ContextMenuTrigger>
                                            <ContextMenuContent>
                                                <ContextMenuItem onClick={() => handleDeleteSong(playlist.id, track.id)} className='flex gap-3'>
                                                    <Trash2Icon className='w-4 h-4 text-red-500' />

                                                    Remove

                                                </ContextMenuItem>

                                            </ContextMenuContent>
                                        </ContextMenu>
                                        <td className="px-4 py-2 text-zinc-400">{track.artist ?? "Unknown artist"}</td>
                                        <td className="px-4 py-2 text-right text-zinc-400">{track.duration ?? "Unknown duration"}</td>

                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default PlaylistInfoPage;