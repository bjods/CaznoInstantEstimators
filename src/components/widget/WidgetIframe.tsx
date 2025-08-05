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
  height = "600px"
}: WidgetIframeProps) {
  const iframeUrl = `/iframe/${embedKey}`

  return (
    <iframe
      src={iframeUrl}
      width={width}
      height={height}
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