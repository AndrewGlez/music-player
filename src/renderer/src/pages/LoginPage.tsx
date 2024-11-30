'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { MdMusicNote } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      console.error('Login failed:', err)
      setError(true)
    }
  }
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 max-w-md">
        <div className="flex items-center justify-center mb-8">
          <MdMusicNote className="text-4xl text-purple-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">MusicStream</h1>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Login failed. Please check your credentials.</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
            Log In
          </Button>
        </form>
        <div className="mt-6">
          <Separator className="my-4" />
          {/* <div className="flex flex-col space-y-2">
            <Button variant="outline" className="w-full">
              <FaGoogle className="mr-2" />
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full">
              <FaApple className="mr-2" />
              Continue with Apple
            </Button>
          </div> */}
        </div>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <a href="/register" className="text-purple-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
