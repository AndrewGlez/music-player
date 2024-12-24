'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { MdMusicNote } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { randomInt } from 'crypto'
import BACKEND_URL from '@/config'

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' }
]

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(false)
  const [country, setCountry] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)
    await axios
      .post(`http://${BACKEND_URL}:8080/api/users/create`, {
        id: randomInt(1, 10),
        username: username,
        email: email,
        password: password,
        country: country
      })
      .then((res) => {
        if (res.status === 200) {
          console.log('Registration successful')
          navigate('/login')
        }
      })
      .catch((err) => {
        console.error('Registration failed:', err)
        setError(true)
      })
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 max-w-md">
        <div className="flex items-center justify-center mb-8">
          <MdMusicNote className="text-4xl text-indigo-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">MusicStream</h1>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">Create an Account</h2>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Registration failed. Please check your credentials.</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="cooluser123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
            Sign Up
          </Button>
        </form>
        <div className="mt-6">
          <Separator className="my-4" />
          {/* <div className="flex flex-col space-y-2">
            <Button variant="outline" className="w-full">
              <FaGoogle className="mr-2" />
              Sign up with Google
            </Button>
            <Button variant="outline" className="w-full">
              <FaApple className="mr-2" />
              Sign up with Apple
            </Button>
          </div> */}
        </div>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}
