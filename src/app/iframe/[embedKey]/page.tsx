'use client'

import WidgetLoader from '@/components/widget/WidgetLoader'

interface IframePageProps {
  params: {
    embedKey: string
  }
}

export default function IframePage({ params }: IframePageProps) {
  return (
    <>
      <style jsx global>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
      <WidgetLoader embedKey={params.embedKey} />
    </>
  )
}