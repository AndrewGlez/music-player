import axios from 'axios'
import React, { createContext, useState, useContext, useEffect } from 'react'
import jwt from 'jsonwebtoken'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string) => {
    await axios
      .post('http://localhost:8080/api/users/login', {
        email: email,
        password: password
      })
      .then((res) => {
        if (res.status === 200) {
          console.log('Login successful')
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
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
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
