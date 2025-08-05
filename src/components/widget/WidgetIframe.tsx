'use client'

import { useEffect, useRef, useState } from 'react'

interface WidgetIframeProps {
  embedKey: string
  className?: string
  style?: React.CSSProperties
}

export default function WidgetIframe({ embedKey, className, style }: WidgetIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(800) // Default height

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our own domain or localhost
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''
      const allowedOrigins = [
        currentOrigin,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002'
      ]
      
      if (!allowedOrigins.includes(event.origin)) {
        return
      }

      if (event.data.type === 'widget-resize' && typeof event.data.height === 'number') {
        setHeight(Math.max(400, event.data.height + 50)) // Add padding and set minimum height
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const iframeUrl = `/embed/${embedKey}`

  return (
    <iframe
      ref={iframeRef}
      src={iframeUrl}
      width="100%"
      height={height}
      frameBorder="0"
      scrolling="no"
      className={className}
      style={{
        border: 'none',
        overflow: 'hidden',
        ...style
      }}
      title="Cazno Widget"
      allow="geolocation; camera; microphone"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
    />
  )
}