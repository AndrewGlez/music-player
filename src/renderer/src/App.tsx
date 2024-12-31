import LoginPage from './pages/LoginPage'
import StartGrid from '@/components/start-grid'
import MusicPlayerNavbar from './components/app-sidebar'
import SearchPage from './pages/SearchPage'
import { PlayerProvider } from './context/PlayerContext'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import RegisterPage from './pages/RegisterPage'
import { Route, Routes } from 'react-router-dom'
import PlaylistInfoPage from './pages/PlaylistInfoPage'
import FindUsersOnline from './pages/OnlinePage'
import audioPlayer from './stream'
import { useEffect, useState } from 'react'
import Mousetrap from 'mousetrap'
function App(): JSX.Element {
  Mousetrap.bind(['command+r', 'ctrl+r', 'f5'], function () {
    return false
  })
  return (
    <PlayerProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </PlayerProvider>
  )
}

function AppContent(): JSX.Element {
  const [connected, setConnected] = useState(false)
  useEffect(() => {
    if (!connected) {
      setConnected(true)
      audioPlayer.connectWithIpc()
    }
    window.onload = () => {
      setConnected(true)
      audioPlayer.connectWithIpc()
    }
  }, [])
  return (
    <div>
      <div className="pointer-events-auto flex flex-col h-screen w-full">
        <div className="flex flex-1 overflow-hidden w-full">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>
                    <MusicPlayerNavbar />
                    <StartGrid />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="search"
              element={
                <ProtectedRoute>
                  <>
                    <MusicPlayerNavbar />
                    <SearchPage />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/playlist/:playlistId"
              element={
                <ProtectedRoute>
                  <>
                    <MusicPlayerNavbar />
                    <PlaylistInfoPage />
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/online-users"
              element={
                <ProtectedRoute>
                  <>
                    <MusicPlayerNavbar />
                    <FindUsersOnline />
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
