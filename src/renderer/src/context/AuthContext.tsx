import axios from 'axios'
import React, { createContext, useState, useContext, useEffect } from 'react'
import jwt from 'jsonwebtoken'
import PlayerInterface from '@/components/player-interface'
import { config } from '@/config'

import { Spinner } from '@/components/ui/spinner'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      setIsAuthenticated(true)
    }
    axios.get(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/actuator/health`).then((res) => {
      if (res.data.status == "UP") {
        setLoading(false)
      }
    })
  }, [])

  const login = async (email: string, password: string) => {
    await axios
      .post(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/api/users/login`, {
        email: email,
        password: password
      })
      .then((res) => {
        if (res.status === 200) {
          const webToken = jwt.sign({ email: email }, 'secret', { expiresIn: '1h' })
          localStorage.setItem('auth_token', webToken)
          localStorage.setItem('user_id', res.data.id)
          setIsAuthenticated(true)
        }
      })
      .catch((err) => {
        throw err
      })
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_id')
    setIsAuthenticated(false)
  }

  if (loading) {
    return <div className='flex w-screen h-screen bg-black text-purple-700 text-center justify-center items-center p-4'>
      <Spinner size={'large'} />
    </div>
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
      {isAuthenticated ? <PlayerInterface /> : null}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
