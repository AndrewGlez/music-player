import { useState, React } from 'react'
import { Music, Mic2, Radio, Headphones, Guitar, Drum, Piano, Disc3, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const genres = [
  { name: 'Pop', icon: Music, gradient: 'from-pink-500 to-rose-500', query: 'pop music' },
  { name: 'Rock', icon: Guitar, gradient: 'from-purple-500 to-indigo-500', query: 'rock music' },
  {
    name: 'Hip Hop',
    icon: Mic2,
    gradient: 'from-yellow-400 to-orange-500',
    query: 'hip hop music'
  },
  {
    name: 'Electronic',
    icon: Headphones,
    gradient: 'from-cyan-400 to-blue-500',
    query: 'electronic music'
  },
  { name: 'Jazz', icon: Piano, gradient: 'from-amber-400 to-yellow-500', query: 'jazz music' },
  {
    name: 'Classical',
    icon: Radio,
    gradient: 'from-emerald-400 to-teal-500',
    query: 'classical music'
  },
  { name: 'R&B', icon: Disc3, gradient: 'from-red-400 to-pink-500', query: 'r&b music' },
  { name: 'Reggae', icon: Drum, gradient: 'from-lime-400 to-green-500', query: 'reggae music' }
]

export default function StartGrid() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/search?q=${searchQuery}`)
  }

  return (
    <div className="select-none dark:bg-black container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Music Player</h2>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="text-white mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for a song..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow font-semibold "
          />
          <Button type="submit" variant="default" onClick={handleSearch}>
            <Search className=" mr-2" />
            Search
          </Button>
        </div>
      </form>

      {/* Genre Grid */}
      <h3 className="text-2xl font-semibold mb-4">Browse Genres</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <div
            onClick={(e) => {
              e.preventDefault()
              navigate(`/search?q=${genre.query}`)
            }}
            key={genre.name}
            className={`p-6 rounded-lg shadow-lg bg-gradient-to-br ${genre.gradient} transition-transform duration-300 ease-in-out transform hover:scale-105`}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <genre.icon className="w-12 h-12 mb-4 text-white" />
              <h3 className="text-xl font-semibold text-white text-center">{genre.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
