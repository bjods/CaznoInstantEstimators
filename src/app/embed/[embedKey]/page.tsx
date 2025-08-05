'use client'

import { useEffect } from 'react'
import WidgetLoader from '@/components/widget/WidgetLoader'

interface EmbedPageProps {
  params: {
    embedKey: string
  }
}

export default function EmbedPage({ params }: EmbedPageProps) {
  useEffect(() => {
    // Auto-resize iframe based on content height
    function resizeIframe() {
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'widget-resize',
          height: height
        }, '*');
      }
    }
    
    // Initial resize
    const timer = setTimeout(resizeIframe, 100);
    
    // Resize on content changes
    const observer = new MutationObserver(resizeIframe);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    // Resize on window resize
    window.addEventListener('resize', resizeIframe);
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', resizeIframe);
    };
  }, []);

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
          overflow-x: hidden;
        }
        html, body {
          height: 100%;
        }
      `}</style>
      <WidgetLoader embedKey={params.embedKey} />
    </>
  )
}