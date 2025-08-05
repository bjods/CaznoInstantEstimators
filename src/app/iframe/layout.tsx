import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Cazno Widget',
  description: 'Instant estimate widget by Cazno',
}

export default function IframeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          #__next {
            height: 100%;
          }
        `}</style>
      </head>
      <body style={{ height: '100%', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}