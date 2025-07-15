'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Widget } from '@/types'
import DynamicWidget from './DynamicWidget'
import WidgetSkeleton from './WidgetSkeleton'

interface WidgetLoaderProps {
  embedKey: string
}

export default function WidgetLoader({ embedKey }: WidgetLoaderProps) {
  const [widget, setWidget] = useState<Widget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWidget = async () => {
      try {
        const { data, error } = await supabase
          .from('widgets')
          .select('*')
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
  if (error) return <div>Error: {error}</div>
  if (!widget) return <div>Widget not found</div>

  return <DynamicWidget widget={widget} />
}