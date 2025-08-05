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
      className={className}
      style={{
        border: 'none',
        ...style
      }}
    />
  )
}