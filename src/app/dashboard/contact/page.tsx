'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  EnvelopeIcon,
  ClockIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          priority: 'medium'
        })
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }

    setTimeout(() => setStatus('idle'), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Support</h1>
        <p className="text-gray-600">Get help with your account, request new features, or report issues</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Send us a message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Subject and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Account issue</option>
                    <option value="high">High - Widget not working</option>
                    <option value="urgent">Urgent - System down</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  placeholder="Please provide as much detail as possible about your issue or request..."
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-lime-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-green-600 mr-3">✓</div>
                    <div>
                      <h3 className="text-sm font-medium text-green-800">Message sent successfully!</h3>
                      <p className="text-sm text-green-700 mt-1">
                        We've received your message and will respond within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-red-600 mr-3">✗</div>
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Failed to send message</h3>
                      <p className="text-sm text-red-700 mt-1">
                        Please try again or email us directly at support@cazno.com
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Contact Information & FAQ */}
        <div className="space-y-6">
          {/* Direct Contact */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Direct Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                  <EnvelopeIcon className="w-5 h-5 text-lime-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Email Support</div>
                  <div className="text-sm text-gray-600">support@cazno.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Response Time</div>
                  <div className="text-sm text-gray-600">Within 24 hours</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CalendarDaysIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Support Hours</div>
                  <div className="text-sm text-gray-600">Mon-Fri 9AM-5PM EST</div>
                </div>
              </div>
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Issues</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">Widget not loading?</div>
                <div className="text-gray-600">Check your embed code and domain settings</div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">Missing lead data?</div>
                <div className="text-gray-600">Verify your form completion flows</div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">Dashboard access issues?</div>
                <div className="text-gray-600">Clear cache and try logging in again</div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">Need new features?</div>
                <div className="text-gray-600">Send us detailed feature requests</div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-lime-50 rounded-xl p-6 border border-lime-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Priority Support</h3>
            <p className="text-sm text-gray-700 mb-3">
              For urgent issues affecting your business operations, mark your request as "Urgent" and we'll respond immediately.
            </p>
            <div className="text-xs text-gray-600">
              Urgent issues include: system downtime, widget failures, or payment processing problems.
            </div>
          </div>
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="flex justify-start">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}