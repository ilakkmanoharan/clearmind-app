// src/app/layout.tsx
import '../styles/globals.css'
import ClientLayout from '@/components/ClientLayout'
import { SupabaseProvider } from '../../context/SupabaseProvider'

export const metadata = {
  title: 'ClearMind App',
  description: 'A Supabase + Next.js blog platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <SupabaseProvider>
          <ClientLayout>{children}</ClientLayout>
        </SupabaseProvider>
      </body>
    </html>
  )
}






