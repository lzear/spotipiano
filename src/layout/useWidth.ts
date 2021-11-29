import { useLayoutEffect } from 'react'
import { useStore } from '../store/zustand'
import { selectSetScreenWidth } from '../store/selectors'

const useWidth = () => {
  const setScreenWidth = useStore(selectSetScreenWidth)
  useLayoutEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth - 40)
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])
}

export const WidthSetter = () => {
  useWidth()
  return null
}
