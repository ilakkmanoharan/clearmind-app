'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../utils/supabase/client'

const supabase = createClient()

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const router = useRouter()

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

  const handleSignup = async () => {
    if (!email || !password || !username) {
      setErrorMessage('Email, password, and username are required.')
      return
    }

    setErrorMessage(null)
    setLoading(true)

    //const cleanedEmail = email.trim();
    console.log("Signup email:", email);

    try {

      const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { username } },
})

if (error) {
  setErrorMessage(error.message)
  setLoading(false)
  return
}

if (data.user) {
  const { error: updateError } = await supabase
    .from('profiles')
    .upsert(
      { id: data.user.id, username },
      { onConflict: 'id' }
    );

  if (updateError) {
    setErrorMessage('Profile insert/update error: ' + updateError.message)
    setLoading(false)
    return
  }
}

setLoading(false)
//router.push('/dashboard')
router.push('/')

     

    } catch (err: unknown) {
      console.error("🔥 Unexpected error:", err)
      if (err instanceof Error) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Unknown error occurred.')
      }
      setLoading(false)
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
      <h1 className="text-2xl mb-6 font-bold">Create an Account</h1>

      <label className="block mb-1">Email</label>
      <input
        type="email"
        className="input w-full border px-3 py-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <label className="block mt-4 mb-1">Password</label>
      <input
        type="password"
        className="input w-full border px-3 py-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <label className="block mt-4 mb-1">Username</label>
      <input
        type="text"
        className="input w-full border px-3 py-2 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />

      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}

      <button
        onClick={handleSignup}
        className="btn mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
    </main>
  )
}


