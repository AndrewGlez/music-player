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

function App(): JSX.Element {
  return (
    <PlayerProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </PlayerProvider>
  )
}

function AppContent(): JSX.Element {
  return (
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
            <Route path="/playlist" element={
              <ProtectedRoute>
                <>
                  <MusicPlayerNavbar />
                  <PlaylistInfoPage />
                </>
              </ProtectedRoute>} />

          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
