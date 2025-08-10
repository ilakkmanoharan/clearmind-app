
//frontend/src/app/profile/page.tsx

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
//import { createClient } from '../../../utils/supabase/client'
import { useSupabase } from '../../../context/SupabaseProvider'
import { withAuthProtection } from '../../../utils/withAuthProtection' // adjust path if needed

//const supabase = createClient()

type Profile = {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
  [key: string]: unknown
}

function ProfilePage() {
  const { supabase } = useSupabase()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true)

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error('User not authenticated or error:', userError)
        setProfile(null)
        setLoading(false)
        return
      }

      // Fetch profile data

        const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()

if (error) {
  if (error.code === 'PGRST116') {
    console.warn('No profile found for user:', user.id)
  } else {
    console.error('Error fetching profile:', error)
  }
  setProfile(null)
} else {
  setProfile(data)
}


      if (error) {
        console.error('Error fetching profile:', error)
        setProfile(null)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    getProfile()
  }, [supabase])

  if (loading) return <main className="p-8"><p>Loading...</p></main>

  if (!profile)
    return (
      <main className="p-8">
        <p>You are not logged in or profile not found.</p>
      </main>
    )

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <div className="bg-gray-100 p-4 rounded space-y-2">
        <p><strong>ID:</strong> {profile.id}</p>
        {profile.email && <p><strong>Email:</strong> {profile.email}</p>}
        {profile.avatar_url && (
          <Image
            src={profile.avatar_url as string}
            alt="Avatar"
            width={96}
            height={96}
            className="rounded-full"
          />
        )}
        {/* Render other fields as needed */}
      </div>
    </main>
  )
}

export default withAuthProtection(ProfilePage)

/*
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '../../../utils/supabase/client'

const supabase = createClient()

type Profile = {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
  // add other profile fields as per your schema
  [key: string]: unknown
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true)

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error('User not authenticated or error:', userError)
        setProfile(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        setProfile(null)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    getProfile()
  }, [])

  if (loading) return <main className="p-8"><p>Loading...</p></main>

  if (!profile)
    return (
      <main className="p-8">
        <p>You are not logged in or profile not found.</p>
      </main>
    )

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <div className="bg-gray-100 p-4 rounded space-y-2">
        <p><strong>ID:</strong> {profile.id}</p>
        {profile.email && <p><strong>Email:</strong> {profile.email}</p>}
        {profile.avatar_url && (
          <Image
            src={profile.avatar_url as string}
            alt="Avatar"
            width={96}
            height={96}
            className="rounded-full"
          />
        )}
        {profile.avatar_url && (
          <Image
            src={profile.avatar_url as string}
            alt="Avatar"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full"
          />
        )}
        {}
      </div>
    </main>
  )
}


*/
