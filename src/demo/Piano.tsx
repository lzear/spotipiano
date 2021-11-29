import React, { useEffect, useRef, useState } from 'react'
import { hsluvToHex } from 'hsluv'
import { Letter } from './Letter'
import _ from 'lodash'
import { keyboard, letters } from './SoundBoard'

const saturation = 25
const lightness = 80

const colors = _.shuffle(letters).reduce((acc, cur, idx) => {
  acc[cur] = hsluvToHex([(360 / letters.length) * idx, saturation, lightness])
  return acc
}, {} as { [letter: string]: string })

export const Keyboard: React.FC<{ sounds: string[] }> = ({ sounds }) => {
  const [lastPressed, setLastPressed] = useState<{
    letter: null | string
    at: number
  }>({ letter: null, at: 0 })
  const audio = useRef<HTMLAudioElement>()

  const playLetter = async (letter: string) => {
    if (audio.current) audio.current.pause()
    const idx = letters.indexOf(letter)
    if (idx >= 0) {
      const filename = sounds[idx]
      if (!audio.current) audio.current = new Audio(`/sounds/${filename}`)
      else audio.current.src = `/sounds/${filename}`
      audio.current.load()
      setTimeout(() => void audio.current?.play(), 0)
    }
  }

  const play = (letter: string) => {
    setLastPressed({ letter, at: Date.now() })
    void playLetter(letter)
  }

  const element = (letter: string) => (
    <Letter
      color={colors[letter]}
      key={letter}
      letter={letter}
      isLastPressedAt={lastPressed.letter === letter && lastPressed.at}
      onKey={play}
    />
  )

  useEffect(() => {
    const keysDown = async (e: KeyboardEvent) => {
      if (/[A-Za-z]/.test(e.key)) play(e.key.toLowerCase())
    }
    window.addEventListener('keypress', keysDown, false)
    return () => window.removeEventListener('keypress', keysDown)
  }, [])

  return (
    <div className="soundBoard">
      <div className="row row0">{keyboard[0].map(element)}</div>
      <div className="row row1">{keyboard[1].map(element)}</div>
      <div className="row row2">{keyboard[2].map(element)}</div>

      <style jsx>{`
        .soundBoard {
          flex: 0 0 auto;
          margin: -3px;
          display: grid;
          justify-content: center;
        }
        .row {
          display: flex;
        }
        .row1 {
          margin-left: 25px;
        }
        .row2 {
          margin-left: 50px;
        }
      `}</style>
    </div>
  )
}
