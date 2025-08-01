'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CalendarIcon, ClockIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/20/solid'

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
      month: 'long',
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
  const systemFields = ['id', 'created_at', 'updated_at', 'business_id', 'widget_id', 'submission_id']
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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                {/* Header */}
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                        Submission Details
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-gray-500">
                        {submission.widgets?.name || 'Unknown Widget'} • {formatDate(submission.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-6">
                  {/* Status and Contact Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <span className="font-medium text-gray-700 w-24">Name:</span>
                            <span>{submission.full_name || 'Not provided'}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{submission.email || 'Not provided'}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{submission.phone || 'Not provided'}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{submission.address || allData.address || 'Not provided'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Status & Pricing</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <span className="font-medium text-gray-700 w-24">Status:</span>
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
                          <div className="flex items-center text-sm">
                            <span className="font-medium text-gray-700 w-24">Estimate:</span>
                            <span className="font-semibold text-green-600">
                              {formatCurrency(submission.estimated_price)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="font-medium text-gray-700 w-24">Current Step:</span>
                            <span>{submission.current_step || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Responses */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Form Responses</h4>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white divide-y divide-gray-200">
                          {displayData.map(([key, value]) => (
                            <tr key={key}>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {typeof value === 'object' 
                                  ? JSON.stringify(value, null, 2)
                                  : String(value || 'Not provided')
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  {pricingData && Object.keys(pricingData).length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Pricing Details</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="space-y-2 text-sm">
                          {pricingData.basePrice && (
                            <div className="flex justify-between">
                              <span>Base Price:</span>
                              <span className="font-medium">{formatCurrency(pricingData.basePrice)}</span>
                            </div>
                          )}
                          {pricingData.finalPrice && (
                            <div className="flex justify-between font-semibold text-blue-900 pt-2 border-t border-blue-200">
                              <span>Final Price:</span>
                              <span>{formatCurrency(pricingData.finalPrice)}</span>
                            </div>
                          )}
                          {pricingData.display_price && (
                            <div className="text-center pt-2">
                              <span className="text-lg font-bold text-blue-900">{pricingData.display_price}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tracking & Activity */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Activity & Tracking</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        {/* Submission Timeline */}
                        <div className="flex items-start space-x-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Form Started</p>
                            <p className="text-sm text-gray-500">{formatDate(submission.created_at)}</p>
                          </div>
                        </div>

                        {submission.last_interaction_at && (
                          <div className="flex items-start space-x-3">
                            <ClockIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Last Interaction</p>
                              <p className="text-sm text-gray-500">{formatDate(submission.last_interaction_at)}</p>
                            </div>
                          </div>
                        )}

                        {submission.quote_viewed_at && (
                          <div className="flex items-start space-x-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Quote Viewed</p>
                              <p className="text-sm text-gray-500">{formatDate(submission.quote_viewed_at)}</p>
                            </div>
                          </div>
                        )}

                        {submission.completed_at && (
                          <div className="flex items-start space-x-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Completed</p>
                              <p className="text-sm text-gray-500">{formatDate(submission.completed_at)}</p>
                            </div>
                          </div>
                        )}

                        {/* Metadata */}
                        {metadata.source && (
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Source:</span> {metadata.source}
                            </p>
                          </div>
                        )}

                        {metadata.ip_address && (
                          <div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">IP Address:</span> {metadata.ip_address}
                            </p>
                          </div>
                        )}

                        {metadata.user_agent && (
                          <div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Device:</span> {metadata.user_agent.substring(0, 50)}...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Internal Notes (placeholder for future) */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Internal Notes</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 italic">No notes added yet</p>
                      <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                        Add a note
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
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