'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DynamicWidget } from './DynamicWidget'
import WidgetSkeleton from './WidgetSkeleton'

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

interface WidgetLoaderProps {
  embedKey: string
}

export default function WidgetLoader({ embedKey }: WidgetLoaderProps) {
  const [widget, setWidget] = useState<WidgetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWidget = async () => {
      try {
        const { data, error } = await supabase
          .from('widgets')
          .select('id, name, embed_key, config, theme')
          .eq('embed_key', embedKey)
          .eq('is_active', true)
          .single()

        if (error) throw error
        setWidget(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load widget')
      } finally {
        setLoading(false)
      }
    }

    fetchWidget()
  }, [embedKey])

  if (loading) return <WidgetSkeleton />
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full p-8 border border-red-200 rounded-lg bg-red-50 text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Widget</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }
  
  if (!widget) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full p-8 border border-gray-200 rounded-lg bg-white text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467.901-6.062 2.379L4.5 20l1.621-1.437A7.962 7.962 0 0112 15z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Widget Not Found</h2>
          <p className="text-gray-600 mb-4">The widget you're looking for doesn't exist or has been disabled.</p>
          <button 
            onClick={() => window.history.back()} 
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return <DynamicWidget config={{...widget.config, id: widget.id}} />
}