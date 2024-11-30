import LoginPage from './pages/LoginPage'
import StartGrid from '@/components/start-grid'
import MusicPlayerNavbar from './components/app-sidebar'
import PlayerInterface from './components/player-interface'
import { Route, Routes } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import { PlayerProvider } from './context/PlayerContext'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import RegisterPage from './pages/RegisterPage'

function App(): JSX.Element {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function AppContent(): JSX.Element {
  const { isAuthenticated } = useAuth()

  return (
    <PlayerProvider>
      <div>
        <div className="flex flex-col h-screen w-full">
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
            </Routes>
          </div>
          {isAuthenticated ? <PlayerInterface /> : null}
        </div>
      </div>
    </PlayerProvider>
  )
}

export default App
