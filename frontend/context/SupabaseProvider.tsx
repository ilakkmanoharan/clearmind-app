// frontend/context/SupabaseProvider.tsx
// frontend/context/SupabaseProvider.tsx
'use client'

import { createContext, useEffect, useState, ReactNode, useContext } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { createClient } from '../utils/supabase/client'

const supabase = createClient()

interface SupabaseContextProps {
  session: Session | null
  user: User | null
  supabase: typeof supabase
}

export const SupabaseContext = createContext<SupabaseContextProps>({
  session: null,
  user: null,
  supabase,
})

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <SupabaseContext.Provider value={{ session, user, supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => useContext(SupabaseContext)