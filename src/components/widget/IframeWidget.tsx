'use client'

import { useEffect, useState } from 'react'
import { DynamicWidget } from './DynamicWidget'
import { WidgetThemeProvider, WidgetTheme } from '@/contexts/WidgetThemeContext'

interface WidgetData {
  id: string
  name: string
  embed_key: string
  config: {
    steps: Array<{
      id: string
      title: string
      components: Array<{
        type: string
        props: Record<string, any>
      }>
    }>
    priceDisplay?: string
    thankYouMessage?: string
    showInstantQuote?: boolean
  }
  theme: Record<string, any>
}

interface IframeWidgetProps {
  embedKey: string
}

export default function IframeWidget({ embedKey }: IframeWidgetProps) {
  const [widget, setWidget] = useState<WidgetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWidget = async () => {
      try {
        const response = await fetch(`/api/widget-config/${embedKey}`)
        
        if (!response.ok) {
          throw new Error('Widget not found')
        }
        
        const data = await response.json()
        setWidget(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load widget')
      } finally {
        setLoading(false)
      }
    }

    fetchWidget()
  }, [embedKey])

  if (loading) {
    return (
      <div style={{ 
        height: '600px',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#6b7280'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Loading...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }
  
  if (error) {
    return (
      <div style={{ 
        height: '600px',
        backgroundColor: '#fef2f2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#dc2626'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            Error Loading Widget
          </div>
          <div style={{ color: '#7f1d1d' }}>
            {error}
          </div>
        </div>
      </div>
    )
  }
  
  if (!widget) {
    return (
      <div style={{ 
        height: '600px',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            Widget Not Found
          </div>
          <div>
            The widget you're looking for doesn't exist or has been disabled.
          </div>
        </div>
      </div>
    )
  }

  // Convert theme config to WidgetTheme format
  const widgetTheme: Partial<WidgetTheme> = {
    backgroundColor: widget.theme?.backgroundColor || '#000000',
    cardBackground: widget.theme?.cardBackground || '#1f2937',
    primaryText: widget.theme?.primaryText || '#ffffff',
    secondaryText: widget.theme?.secondaryText || '#9ca3af',
    labelText: widget.theme?.labelText || '#f3f4f6',
    primaryColor: widget.theme?.primaryColor || '#60a5fa',
    inputBackground: widget.theme?.inputBackground || '#374151',
    inputBorder: widget.theme?.inputBorder || '#4b5563',
    inputFocusBorder: widget.theme?.inputFocusBorder || '#60a5fa',
    inputText: widget.theme?.inputText || '#ffffff',
    inputPlaceholder: widget.theme?.inputPlaceholder || '#9ca3af',
    primaryButton: widget.theme?.primaryButton || '#60a5fa',
    primaryButtonHover: widget.theme?.primaryButtonHover || '#3b82f6',
    primaryButtonText: widget.theme?.primaryButtonText || '#ffffff',
    secondaryButton: widget.theme?.secondaryButton || '#374151',
    secondaryButtonHover: widget.theme?.secondaryButtonHover || '#4b5563',
    secondaryButtonText: widget.theme?.secondaryButtonText || '#f3f4f6',
    progressBackground: widget.theme?.progressBackground || '#374151',
    progressFill: widget.theme?.progressFill || '#60a5fa',
    borderColor: widget.theme?.borderColor || '#4b5563',
    borderColorLight: widget.theme?.borderColorLight || '#374151',
  }

  return (
    <WidgetThemeProvider theme={widgetTheme}>
      <div style={{ 
        backgroundColor: widgetTheme.backgroundColor,
        height: '600px',
        overflow: 'auto'
      }}>
        <DynamicWidget config={{...widget.config, id: widget.id}} />
      </div>
    </WidgetThemeProvider>
  )
}