import YouTube from 'youtube-sr'

export default async function query(url) {
  const videos = await YouTube.search(url, { limit: 10 })
  return videos
}
