import type { Metadata } from 'next'

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
      <body>
        {children}
      </body>
    </html>
  )
}