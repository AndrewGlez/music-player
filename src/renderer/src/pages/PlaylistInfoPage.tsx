import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BACKEND_URL from '@/config';
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Search, Shuffle, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AiOutlineSpotify } from "react-icons/ai";
import { usePlayer } from '@/context/PlayerContext';
import audioPlayer from '@/stream';


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


interface Playlist {
    id: number;
    title: string;
    description: string;
    tracks: Song[];
}

const PlaylistInfoPage: React.FC = () => {
    const { setCurrentSong } = usePlayer()
    const [songs, setSongs] = useState<Song[]>([])

    const [playlist, setPlaylist] = useState<Playlist>();
    const [username, setUsername] = useState<string>();
    useEffect(() => {
        const playlistId = window.location.href.split('=')[1]

        const fetchSongs = async () => {
            try {
                const response = await axios.get(`http://${BACKEND_URL}:8080/api/playlists/${playlistId}`)
                    .then((res) => { setPlaylist(res.data) });
                axios.get(`http://${BACKEND_URL}:8080/api/users/${localStorage.getItem('user_id')}`).then((res) => {
                    setUsername(res.data.username)
                })

            } catch (e) {
                console.log(e)
            }
        };


        fetchSongs();
    }, []);

    const handleSongClick = (song) => {
        console.log(song)
        if (audioPlayer.isPlaying) {
            audioPlayer.stop()
        } else {
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

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-primary to-neutral-950">
            <div className="px-6 py-14">
                <div className="space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white md:text-5xl">{playlist?.title}</h1>
                        <div className="mt-2 flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback><User className='p-1'></User></AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-white">{username}</span>
                            <span className="text-sm text-zinc-400">{playlist?.tracks.length} Songs</span>
                        </div>
                    </div>


                    <div className="relative py-10">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-700/50 text-left text-sm text-zinc-400">
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
                                        className="group hover:bg-white/10 select-none"
                                        onClick={() => handleSongClick(track)}
                                    >
                                        <td className="px-4 py-2 text-zinc-400">{i + 1}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-3">
                                                <AiOutlineSpotify className='text-white text-xl ' />

                                                <div>
                                                    <div className="text-white">{track.title}</div>
                                                    <div className="text-sm text-zinc-400">{track.artist}</div>
                                                </div>
                                            </div>
                                        </td>
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