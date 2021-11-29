export function humanTime(millis: number, withMillis = false): string {
  const minutes = Math.floor(millis / 60000)
  const seconds = Math.floor((millis % 60000) / 1000)
  const ss = `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(0)}`
  if (!withMillis) return ss

  const mmm = millis % 1000
  return `${ss}.${String(mmm).padStart(3, '0')}`
}
