'use client'

import WidgetLoader from '@/components/widget/WidgetLoader'

interface EmbedPageProps {
  params: {
    embedKey: string
  }
}

export default function EmbedPage({ params }: EmbedPageProps) {
  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
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