export const msToHuman = (millis: number): string => {
  const m = String(Math.floor(millis / 60000)).padStart(2, '0')
  const s = String(Math.floor((millis % 60000) / 1000)).padStart(2, '0')
  const ms = String(millis % 1000).padStart(3, '0')

  return `${m}:${s}.${ms}`
}
