import { Track } from '../store'

export const getTrackImgUrl = (track?: Track): string | undefined => {
  if (!track) return undefined
  const images = track.album.images
  let w = Infinity
  let url
  for (const img of images) {
    if (img.width < w) {
      w = img.width
      url = img.url
    }
  }
  return url
}
