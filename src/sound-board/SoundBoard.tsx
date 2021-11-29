import React, { useCallback, useContext, useEffect, useState } from 'react'
import { SpotifyQuerier } from '../spotify/SpotifyQuerier'
import { LastPressed } from './LastPressedKey'
import { useOnKeyboardPress } from './useOnKeyboardPress'
import { LastPressedType, TrackMoment } from '../utils/notes'
import { AuthedContext } from '../auth/AuthContext'
import { useStore } from '../store/zustand'
import { Letter } from './Letter'
import { KeyTile } from '../demo/KeyTile'
import { keyboard } from '../demo/SoundBoard'

const EmptyKey: React.FC = () => (
  <div>
    <KeyTile />
    <style jsx>{`
      div {
        margin: 3px;
      }
    `}</style>
  </div>
)

const Keyboard: React.FC<{
  onKeyboardPress: (letter: string, thisKey: TrackMoment) => void
  board: { [k: string]: (TrackMoment & { defaulted?: boolean }) | null }
  lastPressed: LastPressedType | null
}> = ({ onKeyboardPress, board, lastPressed }) => {
  const tracksByID = useStore((s) => s.tracksByID)
  const element = (letter: string) => {
    const boardKey = board[letter]
    return boardKey ? (
      <Letter
        keey={boardKey}
        key={letter}
        letter={letter}
        onKey={onKeyboardPress}
        track={tracksByID[boardKey.trackID]}
        isLastPressedAt={
          !!lastPressed &&
          lastPressed.letter === letter &&
          lastPressed.pressedAt
        }
        defaulted={boardKey.defaulted}
      />
    ) : (
      <EmptyKey key={letter} />
    )
  }
  return (
    <div className="soundBoard">
      <div className="row row0">{keyboard[0].map(element)}</div>
      <div className="row row1">{keyboard[1].map(element)}</div>
      <div className="row row2">{keyboard[2].map(element)}</div>

      <style jsx>{`
        .soundBoard {
          flex: 1 0 auto;
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

const SoundBoard: React.FC<{ editable: boolean }> = ({ editable }) => {
  const onKeyboardPress = useOnKeyboardPress()
  const { keys, lastPressed } = useStore((s) => s.soundBoard)
  const setKey = useStore((s) => s.setKey)
  const { accessToken } = useContext(AuthedContext)
  const stopNote = useStore((s) => s.stopNote)
  const started = useStore((s) => s.recording.started)
  const [showShiftHint, setShowShiftHint] = useState(editable)
  const board: {
    [k: string]: (TrackMoment & { defaulted?: boolean }) | null
  } = keys
  const onKeySave = useCallback(
    async (key: string) => {
      const currentPlayer = await SpotifyQuerier.currentPlayer(accessToken)
      if (!currentPlayer) return false
      setKey(key, {
        positionMs: currentPlayer.progress_ms,
        trackID: currentPlayer.item.id,
      })
      return true
    },
    [accessToken, setKey],
  )

  const lastKey = lastPressed?.letter && board[lastPressed.letter]

  useEffect(() => {
    const keysDown = async (e: KeyboardEvent) => {
      if (/[A-Za-z]/.test(e.key)) {
        const lower = e.key.toLowerCase()
        if (editable && e.shiftKey) {
          const worked = await onKeySave(lower)
          if (worked) setShowShiftHint(false)
        } else {
          const k = board[lower]
          if (k) onKeyboardPress(lower, k)
        }
      }
    }
    window.addEventListener('keypress', keysDown, false)
    return () => window.removeEventListener('keypress', keysDown)
  }, [onKeyboardPress, board, onKeySave, started, stopNote])
  const lastLetter = lastPressed?.letter

  return (
    <div className="container">
      {showShiftHint && (
        <div className="hint">
          Press &ldquo;Shift + Letter&rdquo; while playing a song to define a
          key
        </div>
      )}
      {editable && lastLetter && lastPressed && lastKey && (
        <div className="last">
          Last pressed:
          <LastPressed
            letter={lastLetter}
            onClick={() => onKeyboardPress(lastLetter, lastKey)}
          />
        </div>
      )}
      {!!Object.keys(board).length && (
        <Keyboard
          onKeyboardPress={onKeyboardPress}
          board={board}
          lastPressed={lastPressed}
        />
      )}
      <style jsx>{`
        .hint {
          margin: 15px 0;
          text-align: center;
          width: 100%;
          font-style: italic;
        }
        .container {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
        }
        .last {
          flex: 0 0 auto;
          margin-left: auto;
        }
      `}</style>
    </div>
  )
}

export default SoundBoard
