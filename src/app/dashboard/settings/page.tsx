'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [allowedDomains, setAllowedDomains] = useState<string[]>([])
  const [newDomain, setNewDomain] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchBusinessSettings()
  }, [])

  const fetchBusinessSettings = async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        router.push('/login')
        return
      }

      // Get user's business
      const { data: userProfiles } = await supabase
        .from('user_profiles')
        .select('business_id')
        .eq('user_id', user.id)
        .single()

      if (!userProfiles?.business_id) {
        setError('No business found for this user')
        setLoading(false)
        return
      }

      // Get business settings
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('settings')
        .eq('id', userProfiles.business_id)
        .single()

      if (businessError) {
        throw businessError
      }

      // Extract allowed domains from settings
      const domains = business?.settings?.allowed_domains || []
      setAllowedDomains(domains)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleAddDomain = () => {
    const domain = newDomain.trim().toLowerCase()
    
    // Basic validation
    if (!domain) return
    
    // Check if already exists
    if (allowedDomains.includes(domain)) {
      setError('Domain already added')
      return
    }
    
    // Simple domain validation
    const domainRegex = /^(\*\.)?([a-z0-9-]+\.)*[a-z0-9-]+\.[a-z]{2,}$/i
    if (!domainRegex.test(domain)) {
      setError('Invalid domain format. Use format like "example.com" or "*.example.com"')
      return
    }
    
    setAllowedDomains([...allowedDomains, domain])
    setNewDomain('')
    setError('')
  }

  const handleRemoveDomain = (domain: string) => {
    setAllowedDomains(allowedDomains.filter(d => d !== domain))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        router.push('/login')
        return
      }

      // Get user's business
      const { data: userProfiles } = await supabase
        .from('user_profiles')
        .select('business_id')
        .eq('user_id', user.id)
        .single()

      if (!userProfiles?.business_id) {
        throw new Error('No business found for this user')
      }

      // Get current business settings
      const { data: business } = await supabase
        .from('businesses')
        .select('settings')
        .eq('id', userProfiles.business_id)
        .single()

      const currentSettings = business?.settings || {}

      // Update settings with new allowed domains
      const updatedSettings = {
        ...currentSettings,
        allowed_domains: allowedDomains,
        security_enabled: allowedDomains.length > 0
      }

      // Update business settings
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ settings: updatedSettings })
        .eq('id', userProfiles.business_id)

      if (updateError) {
        throw updateError
      }

      setSuccess('Settings saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your business settings and security preferences</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Domain Security Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Domain Security</h2>
          <p className="text-sm text-gray-600 mt-1">
            Control which domains can embed your widgets. This applies to all widgets under your business.
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Add Domain Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Allowed Domain
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
                  placeholder="example.com or *.example.com"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddDomain}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Domain
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use * for wildcard subdomains (e.g., *.example.com)
              </p>
            </div>

            {/* Current Domains List */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed Domains ({allowedDomains.length})
              </label>
              {allowedDomains.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ No domains configured. Your widgets can be embedded on any website.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {allowedDomains.map((domain, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                      <span className="text-sm font-mono">{domain}</span>
                      <button
                        onClick={() => handleRemoveDomain(domain)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Security Status */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Security Status</h3>
                  <p className="text-sm text-gray-500">
                    {allowedDomains.length > 0 
                      ? '🟢 Domain validation is active for all widgets'
                      : '🟡 Domain validation is disabled - widgets can be embedded anywhere'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? 'Saving...' : 'Save Domain Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Information */}
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
                disabled
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
                disabled
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
                disabled
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
                disabled
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Contact support to update your business information.
          </p>
        </div>
      </div>

      {/* Notifications */}
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
                <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">SMS notifications</h3>
                <p className="text-sm text-gray-500">Get text messages for urgent leads</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" disabled />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Notification settings coming soon.
          </p>
        </div>
      </div>
    </div>
  )
}