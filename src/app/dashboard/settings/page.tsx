'use client'

import { useState, useEffect } from 'react'
import WidgetSecuritySettings from '@/components/dashboard/WidgetSecuritySettings'

interface Widget {
  id: string
  name: string
  embed_key: string
  allowed_domains: string[]
  security_enabled: boolean
  embed_restrictions: {
    require_https: boolean
    block_iframes: boolean
    max_embeds_per_domain: number
    rate_limit_per_hour: number
  }
}

export default function SettingsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchWidgets()
  }, [])

  const fetchWidgets = async () => {
    try {
      const response = await fetch('/api/widgets')
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch widgets')
      }

      setWidgets(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load widgets')
    } finally {
      setLoading(false)
    }
  }

  const handleWidgetUpdate = (updatedWidget: Widget) => {
    setWidgets(widgets.map(widget => 
      widget.id === updatedWidget.id ? updatedWidget : widget
    ))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account, security settings, and preferences</p>
      </div>

      {/* Widget Security Settings */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Widget Security Settings</h2>
          <p className="text-gray-600 text-sm">
            Configure which domains can embed your widgets and manage security restrictions.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading widgets...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="text-center">
              <div className="text-red-600 mb-2">⚠️ Error</div>
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchWidgets}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : widgets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No widgets found</h3>
              <p className="text-gray-500">
                Create your first widget to start configuring security settings.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {widgets.map((widget) => (
              <WidgetSecuritySettings
                key={widget.id}
                widget={widget}
                onUpdate={handleWidgetUpdate}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Your Business Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email notifications</h3>
                <p className="text-sm text-gray-500">Get notified when you receive new leads</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">SMS notifications</h3>
                <p className="text-sm text-gray-500">Get text messages for urgent leads</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}