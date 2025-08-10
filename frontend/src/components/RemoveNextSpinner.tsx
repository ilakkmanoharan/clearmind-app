// src/components/RemoveNextSpinner.tsx
'use client'

import { useEffect } from 'react'

export default function RemoveNextSpinner() {
  useEffect(() => {
    const interval = setInterval(() => {
      const spinner = document.querySelector('svg[data-next-mark-loading]')
      if (spinner) {
        spinner.remove()
        clearInterval(interval)
      }
    }, 100) // try for a few frames

    return () => clearInterval(interval)
  }, [])

  return null
}
