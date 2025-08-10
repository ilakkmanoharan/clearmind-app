// src/components/ClientLayout.tsx



'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../../utils/supabase/client'

const supabase = createClient()

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setLoggedIn(!!session)
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <>
      <nav className="bg-white shadow-sm p-4 border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex gap-6 items-center">
          <span className="text-xl font-bold text-blue-700">🧠 ClearMind</span>
          <Link href="/">Home</Link>
          {!loggedIn && (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </>
          )}
          {loggedIn && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/profile">Profile</Link>
              <button onClick={handleLogout} className="ml-auto text-red-600 hover:text-red-800 font-medium">
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </>
  )
}
