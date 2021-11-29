import { Pianote, PianotePause } from '../utils/notes'

export const sortPartition = (
  partition: (Pianote | PianotePause)[],
): (Pianote | PianotePause)[] => partition.sort((a, b) => a.at - b.at)

export const first0Partition = (
  partition: (Pianote | PianotePause)[],
): (Pianote | PianotePause)[] => {
  if (partition.length === 0) return partition
  const at0 = partition[0].at
  if (!at0) return partition
  return partition.map((n) => ({ ...n, at: n.at - at0 }))
}

export const noDoublePause = (
  partition: (Pianote | PianotePause)[],
): (Pianote | PianotePause)[] =>
  partition.filter((note, idx, arr) => {
    if (!note.pause) return true
    if (idx === 0) return false
    return !arr[idx - 1].pause
  })

export const sanitizePartition = (
  partition: (Pianote | PianotePause)[],
): (Pianote | PianotePause)[] =>
  first0Partition(noDoublePause(sortPartition(partition)))

export const getEndTime = (partition: (Pianote | PianotePause)[]): number => {
  const endNote = partition[partition.length - 1]
  if (!endNote) throw new Error('no note?!')
  return endNote.at
}

export const getNoteAtTime = (
  partition: (Pianote | PianotePause)[],
  time: number,
): Pianote | PianotePause | undefined => {
  const nextNoteIdx = partition.findIndex((note) => note.at > time)
  const currentNoteIdxCandidate =
    nextNoteIdx === -1 ? partition.length - 1 : nextNoteIdx - 1
  if (nextNoteIdx < 0) return
  return partition[currentNoteIdxCandidate]
}
