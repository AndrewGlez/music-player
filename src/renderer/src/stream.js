import { Howl } from 'howler'
import { exec, spawnSync, execSync, spawn } from 'child_process'
import { tmpdir } from 'os'
import { join } from 'path'
import { promisify } from 'util'
import { statSync } from 'node:fs'
import { toast } from 'react-toastify'
import mpv from 'node-mpv'
import EventEmitter from 'node:events'

const execAsync = promisify(exec)

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
    setInterval(() => {
      if (this.isPlaying) {
        this.getCurrentTime()
        this.getDuration()
      }
    }, 1000) // Update every second
  }

  addListener(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  async downloadAudio(url) {}

  async play(url) {
    try {
      console.log('is playing: ', this.isPlaying)

      const command = `mpv --no-video --input-ipc-server=\\\\.\\pipe\\mpv-pipe "${url}"`

      await exec(command)

      this.sound = new mpv({
        audio_only: true,
        debug: false,
        socket: '\\\\.\\pipe\\mpv-pipe', // Windows
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
        })

      this.currentUrl = url
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
