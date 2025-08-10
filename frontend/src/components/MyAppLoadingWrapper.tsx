'use client'

import { useTransition } from 'react'

export default function MyAppLoadingWrapper({ children }: { children: React.ReactNode }) {
  const [isPending] = useTransition()

  return (
    <>
      {isPending && (
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 z-50">
          Loading...
        </div>
      )}
      {children}
    </>
  )
}
