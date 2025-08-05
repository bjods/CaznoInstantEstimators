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
    let lastHeight = 0;
    let resizeCount = 0;
    const maxResizes = 5; // Prevent infinite resize loops
    
    function resizeIframe() {
      if (resizeCount >= maxResizes) {
        console.warn('Max iframe resizes reached, stopping to prevent infinite loop');
        return;
      }
      
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      // Only send message if height changed significantly
      if (Math.abs(height - lastHeight) > 20 && window.parent && window.parent !== window) {
        lastHeight = height;
        resizeCount++;
        
        window.parent.postMessage({
          type: 'widget-resize',
          height: height
        }, '*');
        
        // Reset counter after successful resize
        setTimeout(() => {
          resizeCount = Math.max(0, resizeCount - 1);
        }, 2000);
      }
    }
    
    // Initial resize after DOM loads
    const timer = setTimeout(() => {
      resizeIframe();
      // One more resize after everything is rendered
      setTimeout(resizeIframe, 1000);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
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