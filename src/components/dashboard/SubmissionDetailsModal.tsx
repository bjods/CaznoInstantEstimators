'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CalendarIcon, ClockIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, CheckCircleIcon, CurrencyDollarIcon, DocumentTextIcon } from '@heroicons/react/20/solid'

interface SubmissionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  submission: any
}

export default function SubmissionDetailsModal({ isOpen, onClose, submission }: SubmissionDetailsModalProps) {
  if (!submission) return null

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Format currency
  const formatCurrency = (amount: number | string | null) => {
    if (!amount) return 'N/A'
    return `$${Number(amount).toLocaleString()}`
  }

  // Extract form data fields
  const formData = submission.form_data || {}
  const contactData = submission.contact_data || {}
  const serviceData = submission.service_data || {}
  const pricingData = submission.pricing_data || {}
  const metadata = submission.metadata || {}

  // Combine all data for display
  const allData = {
    ...formData,
    ...serviceData,
    ...contactData
  }

  // Remove duplicate/system fields
  const systemFields = ['id', 'created_at', 'updated_at', 'business_id', 'widget_id', 'submission_id', 'email', 'phone', 'full_name', 'address']
  const displayData = Object.entries(allData).filter(([key]) => !systemFields.includes(key))

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-7xl">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                        Submission Details
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-gray-500">
                        {submission.widgets?.name || 'Unknown Widget'} • Submitted {formatDate(submission.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="rounded-md bg-gray-50 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Content - 3 column layout */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Contact & Status */}
                    <div className="space-y-6">
                      {/* Contact Information */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                          Contact Information
                        </h4>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Name:</span>
                            <div className="text-gray-900">{submission.full_name || 'Not provided'}</div>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Email:</span>
                            <div className="text-gray-900">{submission.email || 'Not provided'}</div>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Phone:</span>
                            <div className="text-gray-900">{submission.phone || 'Not provided'}</div>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Address:</span>
                            <div className="text-gray-900">{submission.address || allData.address || 'Not provided'}</div>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Source:</span>
                            <div className="text-gray-900">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                submission.utm_source 
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {submission.utm_source || 'Direct'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status & Pricing */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2 text-blue-500" />
                          Status & Pricing
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Status:</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              submission.completion_status === 'complete' 
                                ? 'bg-green-100 text-green-800'
                                : submission.completion_status === 'in_progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {submission.completion_status || 'unknown'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Estimate:</span>
                            <span className="text-lg font-bold text-green-600">
                              {formatCurrency(submission.estimated_price)}
                            </span>
                          </div>
                          {submission.current_step && (
                            <div className="pt-2 border-t border-blue-100">
                              <span className="text-xs text-gray-600">Last Step: {submission.current_step}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle Column - Form Responses */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                          <DocumentTextIcon className="h-4 w-4 mr-2 text-gray-400" />
                          Form Responses
                        </h4>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <tbody className="bg-white divide-y divide-gray-200">
                            {displayData.length > 0 ? displayData.map(([key, value]) => (
                              <tr key={key} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm font-medium text-gray-700 w-2/5">
                                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {typeof value === 'object' 
                                    ? JSON.stringify(value, null, 2)
                                    : String(value || 'Not provided')
                                  }
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td className="px-4 py-4 text-sm text-gray-500 text-center" colSpan={2}>
                                  No additional form data
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right Column - Activity & Tracking */}
                    <div className="space-y-6">
                      {/* Activity Timeline */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                          Activity Timeline
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900">Form Started</p>
                              <p className="text-xs text-gray-500">{formatDate(submission.created_at)}</p>
                            </div>
                          </div>

                          {submission.last_interaction_at && (
                            <div className="flex items-start space-x-3">
                              <ClockIcon className="h-4 w-4 text-blue-500 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900">Last Activity</p>
                                <p className="text-xs text-gray-500">{formatDate(submission.last_interaction_at)}</p>
                              </div>
                            </div>
                          )}

                          {submission.quote_viewed_at && (
                            <div className="flex items-start space-x-3">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900">Quote Viewed</p>
                                <p className="text-xs text-gray-500">{formatDate(submission.quote_viewed_at)}</p>
                              </div>
                            </div>
                          )}

                          {submission.completed_at && (
                            <div className="flex items-start space-x-3">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900">Completed</p>
                                <p className="text-xs text-gray-500">{formatDate(submission.completed_at)}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tracking Info */}
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Tracking Info</h4>
                        <div className="space-y-2 text-xs">
                          {metadata.source && (
                            <div>
                              <span className="font-medium text-gray-700">Source:</span>
                              <div className="text-gray-900">{metadata.source}</div>
                            </div>
                          )}
                          {metadata.ip_address && (
                            <div>
                              <span className="font-medium text-gray-700">IP:</span>
                              <div className="text-gray-900">{metadata.ip_address}</div>
                            </div>
                          )}
                          {metadata.user_agent && (
                            <div>
                              <span className="font-medium text-gray-700">Device:</span>
                              <div className="text-gray-900 break-all">{metadata.user_agent.substring(0, 100)}...</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Internal Notes */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Internal Notes</h4>
                        <p className="text-xs text-gray-500 italic">No notes added</p>
                        <button className="mt-2 text-xs text-blue-600 hover:text-blue-800">
                          + Add note
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}