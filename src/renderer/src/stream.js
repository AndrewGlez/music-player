import { Howl } from 'howler'
import { exec, spawnSync, execSync } from 'child_process'
import { tmpdir } from 'os'
import { join } from 'path'
import { promisify } from 'util'
import { statSync } from 'node:fs'
import { toast } from 'react-toastify'
import { execSync } from 'node:child_process'

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

  async downloadAudio(url) {
    let ytDlpPath
    switch (process.platform) {
      case 'win32':
        ytDlpPath = process.env.PATH.split(';').find((path) => {
          try {
            const stat = statSync(join(path, 'yt-dlp.exe'))
            return stat.isFile()
          } catch {
            return false
          }
        })
        if (typeof ytDlpPath === 'undefined') {
          console.error('yt-dlp.exe not found in PATH')
          throw new Error('yt-dlp.exe not found in PATH')
        }
        ytDlpPath = join(ytDlpPath, 'yt-dlp.exe')
        break
      case 'linux':
        ytDlpPath = process.env.PATH.split(':').find((path) => {
          try {
            const stat = statSync(join(path, 'yt-dlp'))
            return stat.isFile()
          } catch {
            return false
          }
        })
        if (typeof ytDlpPath === 'undefined') {
          console.log('yt-dlp not found in PATH')
          console.log('downloading yt-dlp...')
          toast.warning('Yt-dlp not found in PATH, Downloading yt-dlp...')
          execSync(
            'curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -o /usr/bin/yt-dlp && chmod a+rx /usr/bin/yt-dlp'
          )
        }
        ytDlpPath = join(ytDlpPath, 'yt-dlp')
        break
      case 'darwin':
        ytDlpPath = '/usr/local/bin/yt-dlp'
        if (!statSync(ytDlpPath).isFile()) {
          console.error('yt-dlp not found in PATH')
          throw new Error('yt-dlp not found in PATH')
        }
        break
      default:
        throw new Error(`Unsupported platform: ${process.platform}`)
    }

    const idResult = spawnSync('yt-dlp', ['--print', 'filename', '-o', '%(id)s.mp3', url])
    const idTempPath = join(tmpdir(), idResult.stdout.toString().trim())
    const tempPath = join(tmpdir(), `%(id)s.mp3`)
    const command = `yt-dlp -x --audio-format mp3 -o "${tempPath}" ${url}`

    try {
      try {
        const existingFile = statSync(idTempPath)
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
      console.log('is playing: ', this.isPlaying)

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
    if (this.sound) {
      this.sound.stop()
      this.sound = null
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
