// utils/withGuestOnly.tsx

'use client';

import { useEffect } from 'react'
//import { useRouter } from 'next/router'
import { useRouter } from 'next/navigation'
import { createClient } from './supabase/client'

const supabase = createClient()

export function withGuestOnly(Component: React.ComponentType) {
  return function GuestOnlyWrapper(props: React.ComponentProps<typeof Component>) {
    const router = useRouter()

    useEffect(() => {
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          //router.replace('/dashboard') // already logged in, redirect
          router.replace('/')
        }
      }
      checkSession()
    }, [router])

    return <Component {...props} />
  }
}
