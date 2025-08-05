import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Cazno Widget',
  description: 'Instant estimate widget by Cazno',
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}