/** @type {import('vite').UserConfig} */
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import commonjsExternals from 'vite-plugin-commonjs-externals'

const commonjsPackages = [
  'electron',
  'electron/main',
  'electron/common',
  'electron/renderer',
  'original-fs',
  'child_process',
  'os',
  'path',
  'node-mpv',
  'pcm-volume',
  'howler',
  'stream',
  'jsonwebtoken',
  'crypto',
  'dotenv',
  'node:fs'
] as const
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [react(), commonjsExternals({ externals: commonjsPackages })]
  }
})
