'use client'

import { useEffect, useRef } from 'react'

interface WidgetIframeProps {
  embedKey: string
  className?: string
  style?: React.CSSProperties
  width?: string | number
  useAutoResize?: boolean
}

export default function WidgetIframe({ 
  embedKey, 
  className, 
  style,
  width = "100%",
  useAutoResize = true
}: WidgetIframeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!useAutoResize || !containerRef.current) return

    // Dynamically load the widget embed script
    const script = document.createElement('script')
    script.src = '/widget-embed.js'
    script.async = true

    script.onload = () => {
      if (window.CaznoWidget && containerRef.current) {
        // Clear any existing content
        containerRef.current.innerHTML = ''
        
        // Initialize the auto-resizing widget
        window.CaznoWidget.init(embedKey, {
          target: containerRef.current,
          theme: {
            cardBackground: '#ffffff'
          }
        })
      }
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup script when component unmounts
      document.head.removeChild(script)
    }
  }, [embedKey, useAutoResize])

  // If auto-resize is disabled, use traditional iframe
  if (!useAutoResize) {
    return (
      <iframe
        src={`/iframe/${embedKey}`}
        width={width}
        height="600px"
        className={className}
        style={{
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          ...style
        }}
        title="Quote Calculator"
        loading="lazy"
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width,
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        ...style
      }}
    />
  )
}

// Extend the Window interface to include CaznoWidget
declare global {
  interface Window {
    CaznoWidget: any
  }
}