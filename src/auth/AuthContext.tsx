import React, { createContext } from 'react'
import { NEXT_PUBLIC_BASE_URL, SPOTIFY_CLIENT_ID } from '../config'
import { Scope } from '../store'

export type Auth = { accessToken: string; expiresAt: number; scope: string[] }

const REMEMBER_ME = 'REMEMBER_ME'

type PreAuthState = {
  state: string
  scope: string[]
}

export const AuthContext = createContext<{
  auth: Auth | null
  setAuth: React.Dispatch<React.SetStateAction<Auth | null>>
  setPreAuthState: (v: PreAuthState) => void
}>({ auth: null, setAuth: () => null, setPreAuthState: () => null })

export const spotifyAuthParams = (
  scopes: Scope[],
  state: string,
  showDialog = true,
): string =>
  new URLSearchParams({
    response_type: 'token',
    client_id: SPOTIFY_CLIENT_ID,
    scope: scopes.join(' '),
    redirect_uri: `${NEXT_PUBLIC_BASE_URL}/spotify/callback`,
    state,
    show_dialog: showDialog ? 'true' : 'false',
  }).toString()

export const saveLocal = (scopes: Scope[]): void =>
  window.localStorage.setItem(REMEMBER_ME, scopes.join(' '))

export const getLocal = (): string | null =>
  window.localStorage.getItem(REMEMBER_ME)

export const removeLocal = (): void =>
  window.localStorage.removeItem(REMEMBER_ME)

export const AuthedContext = createContext<{ accessToken: string }>({
  accessToken: 'INVALID',
})
