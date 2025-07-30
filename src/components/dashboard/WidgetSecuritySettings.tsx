'use client'

import { useState, useEffect } from 'react'

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

interface WidgetSecuritySettingsProps {
  widget: Widget
  onUpdate: (updatedWidget: Widget) => void
}

export default function WidgetSecuritySettings({ widget, onUpdate }: WidgetSecuritySettingsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    allowed_domains: widget.allowed_domains,
    security_enabled: widget.security_enabled,
    embed_restrictions: widget.embed_restrictions
  })
  const [domainInput, setDomainInput] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setFormData({
      allowed_domains: widget.allowed_domains,
      security_enabled: widget.security_enabled,
      embed_restrictions: widget.embed_restrictions
    })
  }, [widget])

  const addDomain = () => {
    if (!domainInput.trim()) return
    
    const domain = domainInput.trim().toLowerCase()
    
    // Basic domain validation
    const domainRegex = /^(\*\.)?[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/
    if (!domainRegex.test(domain)) {
      setError('Invalid domain format. Use formats like: example.com or *.example.com')
      return
    }
    
    if (formData.allowed_domains.includes(domain)) {
      setError('Domain already added')
      return
    }
    
    setFormData({
      ...formData,
      allowed_domains: [...formData.allowed_domains, domain]
    })
    setDomainInput('')
    setError('')
  }

  const removeDomain = (domainToRemove: string) => {
    setFormData({
      ...formData,
      allowed_domains: formData.allowed_domains.filter(domain => domain !== domainToRemove)
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/widgets/${widget.id}/security`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to update security settings')
      }

      onUpdate(result.data)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      allowed_domains: widget.allowed_domains,
      security_enabled: widget.security_enabled,
      embed_restrictions: widget.embed_restrictions
    })
    setDomainInput('')
    setError('')
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{widget.name}</h3>
          <p className="text-sm text-gray-500">Embed Key: {widget.embed_key}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            formData.security_enabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {formData.security_enabled ? 'Secured' : 'Unsecured'}
          </span>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit Security
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Security Enable/Disable */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Security Enabled</h4>
              <p className="text-sm text-gray-500">
                Enable domain validation and security restrictions
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.security_enabled}
                onChange={(e) => setFormData({
                  ...formData,
                  security_enabled: e.target.checked
                })}
                disabled={!isEditing}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
            </label>
          </div>
        </div>

        {/* Allowed Domains */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Allowed Domains</h4>
          <p className="text-sm text-gray-500 mb-3">
            Specify which domains can embed this widget. Use *.domain.com for subdomains.
          </p>
          
          {isEditing && (
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="example.com or *.example.com"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && addDomain()}
              />
              <button
                onClick={addDomain}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          )}

          <div className="space-y-2">
            {formData.allowed_domains.length === 0 ? (
              <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-md">
                No domains configured. Widget can be embedded on any domain.
                {formData.security_enabled && (
                  <span className="text-amber-600 font-medium"> (Security Risk!)</span>
                )}
              </div>
            ) : (
              formData.allowed_domains.map((domain, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                  <span className="text-sm text-gray-700">{domain}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeDomain(domain)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Embed Restrictions */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Embed Restrictions</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-700">Require HTTPS</h5>
                <p className="text-xs text-gray-500">Only allow embedding on secure (HTTPS) sites</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.embed_restrictions.require_https}
                  onChange={(e) => setFormData({
                    ...formData,
                    embed_restrictions: {
                      ...formData.embed_restrictions,
                      require_https: e.target.checked
                    }
                  })}
                  disabled={!isEditing}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Embeds per Domain
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.embed_restrictions.max_embeds_per_domain}
                  onChange={(e) => setFormData({
                    ...formData,
                    embed_restrictions: {
                      ...formData.embed_restrictions,
                      max_embeds_per_domain: parseInt(e.target.value) || 10
                    }
                  })}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate Limit (requests/hour)
                </label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  value={formData.embed_restrictions.rate_limit_per_hour}
                  onChange={(e) => setFormData({
                    ...formData,
                    embed_restrictions: {
                      ...formData.embed_restrictions,
                      rate_limit_per_hour: parseInt(e.target.value) || 1000
                    }
                  })}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}