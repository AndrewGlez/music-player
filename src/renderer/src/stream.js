import { Howl } from 'howler'
import { exec, spawn, spawnSync } from 'child_process'
import { tmpdir } from 'os'
import { join } from 'path'
import { promisify } from 'util'
import { v4 as uuidv4 } from 'uuid'
import { stat, statSync } from 'node:fs'

const execAsync = promisify(exec)

class AudioPlayer {
  constructor() {
    this.sound = null
    this.queue = []
    this.isPlaying = false
    this.volume = 0.02
    this.tempFiles = new Set()
    this.listeners = new Set()
  }

  addListener(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  updateListeners() {
    this.listeners.forEach((callback) =>
      callback({
        isPlaying: this.isPlaying,
        currentTime: this.getCurrentTime()
      })
    )
  }

  async downloadAudio(url) {
    const idResult = spawnSync('yt-dlp', ['--print', 'filename', '-o', '%(id)s.mp3', url])
    const idTempPath = join(tmpdir(), idResult.stdout.toString().trim())
    const tempPath = join(tmpdir(), `%(id)s.mp3`)
    const command = `yt-dlp -x --audio-format mp3 -o "${tempPath}" ${url}`

    try {
      try {
        const existingFile = await statSync(idTempPath)
        if (existingFile) {
          this.tempFiles.add(idTempPath)
          return idTempPath
        }
      } catch (error) {
        console.log('Error checking for existing file')
      }

      await execAsync(command)
      this.tempFiles.add(tempPath)
      return idTempPath
    } catch (error) {
      console.error('Error downloading audio:', error)
      throw error
    }
  }

  async play(url) {
    try {
      // Cleanup previous sound
      if (this.sound) {
        this.sound.unload()
      }

      const localPath = await this.downloadAudio(url)

      this.sound = new Howl({
        src: [localPath],
        html5: true,
        volume: this.volume,
        onplay: () => {
          this.isPlaying = true
        },
        onend: () => {
          this.isPlaying = false
          this.playNext()
        },
        onloaderror: (id, error) => {
          console.error('Error loading audio:', error)
          //this.cleanupTempFile(localPath)
          this.playNext()
        }
      })

      this.sound.play()
      this.currentUrl = url
    } catch (error) {
      console.error('Error playing audio:', error)
      throw error
    }
  }

  async setVolume(value) {
    if (value >= 0 && value <= 1) {
      this.volume = value
      if (this.sound) {
        this.sound.volume(value)
      }
      this.updateListeners()
    }
  }

  async pause() {
    if (this.sound) {
      this.sound.pause()
      this.isPlaying = false
      this.updateListeners()
    }
  }

  async resume() {
    if (this.sound) {
      this.sound.play()
      this.isPlaying = true
      this.updateListeners()
    }
  }

  stop() {
    this.sound = null
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
    if (!this.isPlaying || !this.sound) {
      return null
    }

    const duration = this.sound.duration()
    const currentTime = this.sound.seek()
    return {
      current: currentTime,
      total: duration,
      formatted: this.formatTime(currentTime)
    }
  }

  formatTime(seconds) {
    // Round seconds to nearest integer
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

// Export a singleton instance
const audioPlayer = new AudioPlayer()
export default audioPlayer
