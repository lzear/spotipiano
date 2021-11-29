import React from 'react'
import { SpringKey } from './KeyTile'

const LetterComp: React.FC<{
  letter: string
  isLastPressedAt: number | false
  onKey: (letter: string) => void
  color: string
}> = ({ color, letter, isLastPressedAt, onKey }) => (
  <SpringKey
    color={color}
    key={letter}
    letter={letter}
    onClick={() => onKey(letter)}
    isLastPressedAt={isLastPressedAt}
  />
)

export const Letter = React.memo(LetterComp)
