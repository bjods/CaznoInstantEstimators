'use client'

interface WidgetIframeProps {
  embedKey: string
  className?: string
  style?: React.CSSProperties
  width?: string | number
  height?: string | number
}

export default function WidgetIframe({ 
  embedKey, 
  className, 
  style,
  width = "100%",
  height = "800px"
}: WidgetIframeProps) {
  const iframeUrl = `/embed/${embedKey}`

  return (
    <iframe
      src={iframeUrl}
      width={width}
      height={height}
      frameBorder="0"
      className={className}
      style={{
        border: 'none',
        ...style
      }}
      title="Cazno Widget"
      allow="geolocation; camera; microphone"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
    />
  )
}