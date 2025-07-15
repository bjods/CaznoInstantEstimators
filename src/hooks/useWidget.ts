'use client'

import { useState, useEffect } from 'react'
import { Widget } from '@/types'

export function useWidget(embedKey: string) {
  const [widget, setWidget] = useState<Widget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWidget = async () => {
      try {
        const response = await fetch(`/api/widget-config/${embedKey}`)
        if (!response.ok) throw new Error('Widget not found')
        
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

  return { widget, loading, error }
}