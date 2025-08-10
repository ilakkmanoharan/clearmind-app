'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../utils/supabase/client'

const supabase = createClient()

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const router = useRouter()

  // Redirect if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        //router.replace('/dashboard')
        router.replace('/')
      } else {
        setCheckingSession(false)
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Email and password are required.')
      return
    }

    setLoading(true)
    setErrorMessage(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setErrorMessage(error.message)
    } else {
      //router.push('/dashboard')
      router.push('/')
    }
  }

  if (checkingSession) {
    return (
      <main className="p-8 max-w-md mx-auto text-center">
        <p>Checking session...</p>
      </main>
    )
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-6 font-bold">Login</h1>

      <label className="block mb-1">Email</label>
      <input
        type="email"
        className="input w-full border px-3 py-2 rounded"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />

      <label className="block mt-4 mb-1">Password</label>
      <input
        type="password"
        className="input w-full border px-3 py-2 rounded"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />

      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="btn mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>
    </main>
  )
}


