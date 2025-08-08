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
            max-height: 100vh;
            overflow-x: hidden;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
          
          body {
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior-y: contain;
          }

          #__next {
            height: 100vh;
            max-height: 100vh;
            overflow: hidden;
          }

          /* Force all content to respect viewport constraints */
          .min-h-full {
            min-height: 100vh !important;
            max-height: 100vh !important;
          }

          /* Ensure main content area scrolls properly */
          main {
            flex: 1;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
      <WidgetLoader embedKey={params.embedKey} />
    </>
  )
}