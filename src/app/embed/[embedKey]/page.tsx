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
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          margin: 0;
          padding: 0;
        }

        @media (max-width: 768px) {
          html, body {
            height: 100vh;
            overflow-x: hidden;
            position: relative;
          }
          
          body {
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior-y: contain;
          }
        }
      `}</style>
      <WidgetLoader embedKey={params.embedKey} />
    </>
  )
}