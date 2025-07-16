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
      <div className="max-w-2xl mx-auto p-6">
        <div className="p-6 border border-red-200 rounded-lg bg-red-50">
          <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Widget</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }
  
  if (!widget) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800 mb-2">Widget Not Found</h2>
          <p className="text-gray-600">The widget you're looking for doesn't exist or has been disabled.</p>
        </div>
      </div>
    )
  }

  return <DynamicWidget config={widget.config} />
}