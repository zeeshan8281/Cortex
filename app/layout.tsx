import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CORTEX — AI Agent Economy Terminal',
  description: 'Real-time intelligence terminal for the AI agent economy',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
