'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  PlusIcon,
  EyeIcon,
  Cog6ToothIcon,
  CalendarIcon,
  LinkIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

interface Widget {
  id: string
  name: string
  embed_key: string
  allowed_domains: string[]
  security_enabled: boolean
  embed_restrictions: any
  created_at: string
}

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWidgets()
  }, [])

  const fetchWidgets = async () => {
    try {
      const response = await fetch('/api/widgets')
      const result = await response.json()
      
      if (result.success) {
        setWidgets(result.data)
      } else {
        setError(result.error || 'Failed to fetch widgets')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getWidgetUrl = (embedKey: string) => {
    return `${window.location.origin}/iframe/${embedKey}`
  }

  const copyEmbedCode = (embedKey: string) => {
    const embedCode = `<iframe src="${getWidgetUrl(embedKey)}" width="100%" height="600" frameBorder="0"></iframe>`
    navigator.clipboard.writeText(embedCode)
    // You could add a toast notification here
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Widgets</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Create Widget
          </button>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Widgets</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Create Widget
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={fetchWidgets}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (widgets.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Widgets</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Create Widget
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No widgets yet</h3>
            <p className="text-gray-500 mb-6">
              Create your first widget to start capturing leads from your website.
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Create Your First Widget
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Widgets</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
          <PlusIcon className="w-4 h-4" />
          <span>Create Widget</span>
        </button>
      </div>

      <div className="grid gap-6">
        {widgets.map((widget) => (
          <div key={widget.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{widget.name}</h3>
                  {widget.security_enabled && (
                    <ShieldCheckIcon className="w-5 h-5 text-green-500" title="Security enabled" />
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <LinkIcon className="w-4 h-4" />
                    <span>Embed Key: {widget.embed_key}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Created: {formatDate(widget.created_at)}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {widget.allowed_domains.length > 0 ? (
                      <span>Domains: {widget.allowed_domains.length} allowed</span>
                    ) : (
                      <span>No domain restrictions</span>
                    )}
                  </div>
                </div>
                
                {widget.allowed_domains.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700">Allowed domains:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {widget.allowed_domains.map((domain, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3 ml-6">
                <Link
                  href={`/iframe/${widget.embed_key}`}
                  target="_blank"
                  className="flex items-center space-x-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>View Widget</span>
                </Link>
                
                <Link
                  href={`/dashboard/settings?widget=${widget.id}`}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
                
                <button
                  onClick={() => copyEmbedCode(widget.embed_key)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  title="Copy embed code"
                >
                  Copy Embed
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* UTM Parameter Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">Track Lead Sources with UTM Parameters</h2>
        <p className="text-blue-800 mb-4">
          Add UTM parameters to your widget URLs to track where your leads are coming from. This data will appear in your Analytics dashboard.
        </p>
        
        <div className="bg-white rounded-md p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Example Usage:</h3>
          <code className="text-xs bg-gray-100 p-2 rounded block text-gray-800 break-all">
            &lt;iframe src="{getWidgetUrl('your-embed-key')}?utm_source=facebook&amp;utm_campaign=spring_promo" width="100%" height="600" frameBorder="0"&gt;&lt;/iframe&gt;
          </code>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-2">Common UTM Parameters:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>utm_source:</strong> facebook, google, email</li>
              <li><strong>utm_medium:</strong> social, cpc, newsletter</li>
              <li><strong>utm_campaign:</strong> spring_promo, new_service</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-2">Benefits:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Track which marketing channels work best</li>
              <li>• See lead sources in Analytics dashboard</li>
              <li>• Make data-driven marketing decisions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}