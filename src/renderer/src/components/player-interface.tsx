import {
  Heart,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Mic2,
  Laptop2,
  Volume2
} from 'lucide-react'
import { useState, useEffect } from 'react'
import audioPlayer from '../stream.js'
import { usePlayer } from '@/context/PlayerContext'

export default function PlayerInterface() {
  const { currentSong } = usePlayer()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(75)

  useEffect(() => {
    // Add listener for audio player state changes
    const unsubscribe = audioPlayer.addListener(({ isPlaying, currentTime }) => {
      if (currentTime) {
        setCurrentTime(currentTime.current)
        setDuration(currentTime.total)
      }
      setIsPlaying(isPlaying)
    })

    // Initial state
    setIsPlaying(audioPlayer.isPlaying)
    const timeInfo = audioPlayer.getCurrentTime()
    if (timeInfo) {
      setCurrentTime(timeInfo.current)
      setDuration(timeInfo.total)
    }

    return () => {
      unsubscribe()
    }
  }, [])

  const handlePlayPause = () => {
    if (isPlaying) {
      audioPlayer.pause()
    } else {
      audioPlayer.resume()
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value)
    const normalizedVolume = newVolume / 100 // Convert to 0-1 range
    audioPlayer.setVolume(normalizedVolume)
    setVolume(newVolume)
  }

  const formatTime = (seconds) => {
    if (!seconds) return '0:00'
    return audioPlayer.formatTime(seconds)
  }

  return (
    <div className="bg-black text-white w-full fixed bottom-0 left-0 right-0">
      <div className="max-w-[1200px] mx-auto py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 w-1/4">
            <img
              src={currentSong?.thumbnail.url || '/placeholder.svg?height=56&width=56'}
              alt="Album cover"
              className="w-14 h-14 object-cover"
            />
            <div>
              <h2 className="text-sm font-semibold">{currentSong?.title || 'No track playing'}</h2>
              <p className="text-xs text-gray-400">{currentSong?.artist || 'Unknown artist'}</p>
            </div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`focus:outline-none ${isFavorite ? 'text-green-500' : 'text-gray-400'}`}
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center w-1/2">
            <div className="flex items-center space-x-6 mb-2">
              <button className="focus:outline-none text-gray-400">
                <Shuffle className="w-5 h-5" />
              </button>
              <button className="focus:outline-none text-gray-400">
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={handlePlayPause}
                className="focus:outline-none bg-white text-black rounded-full p-2"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>
              <button className="focus:outline-none text-gray-400">
                <SkipForward className="w-5 h-5" />
              </button>
              <button className="focus:outline-none text-gray-400">
                <Repeat className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full">
              <div className="relative">
                <div className="bg-gray-600 h-1 w-full rounded-full">
                  <div
                    className="bg-white h-1 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 w-1/4 justify-end">
            <button className="focus:outline-none text-gray-400">
              <Mic2 className="w-5 h-5" />
            </button>
            <button className="focus:outline-none text-gray-400">
              <Laptop2 className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
