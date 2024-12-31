import { Howl } from 'howler'
import { exec, spawnSync, execSync, spawn } from 'child_process'
import { tmpdir } from 'os'
import { join } from 'path'
import { promisify } from 'util'
import { statSync } from 'node:fs'
import { toast } from 'react-toastify'
import mpv from 'node-mpv'
import EventEmitter from 'node:events'

class AudioPlayer extends EventEmitter {
  constructor() {
    super()
    this.sound = null
    this.queue = []
    this.isPlaying = false
    this.volume = 0.02
    this.tempFiles = new Set()
    this.listeners = new Set()
    this.time = null
    this.connected = false
  }

  addListener(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  async connectWithIpc() {
    if (this.isPlaying) return
    if (this.connected) return
    let socket = '/tmp/mpvsocket'

    if (process.platform === 'win32') {
      socket = '\\\\.\\pipe\\mpv-pipe'
    }

    try {
      this.sound = new mpv({
        audio_only: true,
        debug: false,
        socket: socket, // Windows
        time_update: 1,
        verbose: false
      })
        .on('started', () => {
          this.isPlaying = true
          this.emit('started')
          console.log('Started playing audio', this.isPlaying)
        })
        .on('stopped', () => {
          this.isPlaying = false
          this.playNext()
        })
        .on('statuschange', () => {
          this.getCurrentTime()
          this.getDuration()
          this.connected = true
        })
    } catch (error) {
      console.error('Error connecting with ipc:', error)
      throw error
    }
  }

  async play(url) {
    try {
      console.log('is playing: ', this.isPlaying)

      let socket = '/tmp/mpvsocket'

      if (process.platform === 'win32') {
        socket = '\\\\.\\pipe\\mpv-pipe'
      }

      // Create a promise that resolves when the audio starts
      const playPromise = new Promise((resolve, reject) => {
        this.sound = new mpv({
          audio_only: true,
          debug: false,
          socket: socket, // Windows
          time_update: 1,
          verbose: false
        })
          .on('started', () => {
            this.isPlaying = true
            this.emit('started')
            console.log('Started playing audio', this.isPlaying)
            resolve() // Resolve the promise here
          })
          .on('stopped', () => {
            this.isPlaying = false
            this.playNext()
          })
          .on('statuschange', () => {
            this.getCurrentTime()
            this.getDuration()
          })
      })
      toast.promise(
        playPromise,
        {
          pending: 'Connecting with mpv...',
          success: 'Connected',
          error: 'An error ocurred when connecting'
        },
        { pauseOnHover: false, theme: 'dark' }
      )

      let command = {
        command: ['loadfile', url]
      }

      this.sound.commandJSON(command)
      this.currentUrl = url

      return playPromise // Return the promise
    } catch (error) {
      console.error('Error playing audio:', error)
      throw error
    }
  }

  async setVolume(value) {
    if (this.isPlaying) {
      console.log('Setting volume to', value)
      this.sound.setProperty('volume', value)
    }
  }

  async pause() {
    if (this.sound) {
      this.sound.pause()
      this.isPlaying = false
    }
  }

  async resume() {
    if (this.sound) {
      this.sound.play()
      this.isPlaying = true
    }
  }

  stop() {
    if (this.isPlaying) {
      this.sound.stop()
    }
    this.isPlaying = false
    this.queue = []
  }

  enqueue(url) {
    this.queue.push(url)
    if (!this.isPlaying) {
      this.playNext()
    }
  }

  async playNext() {
    if (this.queue.length > 0) {
      const nextUrl = this.queue.shift()
      await this.play(nextUrl)
    }
  }

  getCurrentTime() {
    if (this.isPlaying) {
      this.sound.getProperty('playback-time').then((time) => {
        this.emit('timeupdate', time)
      })
    }
  }

  getDuration() {
    if (this.isPlaying) {
      this.sound.getProperty('duration').then((duration) => {
        this.emit('duration', duration)
      })
    }
  }

  async quit() {
    this.sound.quit()
  }

  formatTime(seconds) {
    seconds = Math.floor(seconds)

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
}

const audioPlayer = new AudioPlayer()
export default audioPlayer
