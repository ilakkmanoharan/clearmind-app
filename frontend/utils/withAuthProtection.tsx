// utils/withAuthProtection.tsx
'use client';

import { useEffect, useState } from 'react'
//import { useRouter } from 'next/router'
import { useRouter } from 'next/navigation'
import { createClient } from './supabase/client'

const supabase = createClient()

export function withAuthProtection(Component: React.ComponentType) {
  return function ProtectedWrapper(props: React.ComponentProps<typeof Component>) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.replace('/login') // not logged in, redirect
        } else {
          setLoading(false)
        }
      }
      checkSession()
    }, [router])

    if (loading) return <p>Loading...</p>
    return <Component {...props} />
  }
}
