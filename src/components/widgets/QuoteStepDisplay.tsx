'use client'

import React from 'react'
import { 
  CheckCircle, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  ArrowLeft,
  Download,
  Share
} from 'lucide-react'

interface QuoteStepDisplayProps {
  formData: Record<string, any>
  quoteConfig: {
    header?: {
      title?: string
      subtitle?: string
      showQuoteNumber?: boolean
      showSuccessIcon?: boolean
    }
    breakdown?: {
      showServiceBreakdown?: boolean
      showOptionsBreakdown?: boolean  
      showBaseCalculation?: boolean
    }
    timeline?: {
      showTimeline?: boolean
      steps?: Array<{
        title: string
        description: string
        duration: string
      }>
    }
    contact?: {
      showContactInfo?: boolean
      showNextSteps?: boolean
      nextSteps?: Array<{
        title: string
        description: string
        status?: 'completed' | 'active' | 'pending'
      }>
    }
    cta?: {
      showCta?: boolean
      title?: string
      subtitle?: string
      buttonText?: string
      phoneNumber?: string
    }
    actions?: {
      showBackButton?: boolean
      showShareButton?: boolean
      showDownloadButton?: boolean
    }
    styling?: {
      headerBgColor?: string
      primaryColor?: string
      cardShadow?: 'none' | 'soft' | 'large'
      layout?: 'single' | 'sidebar'
    }
  }
  calculatedTotal: number
  calculatedBreakdown: Array<{
    service: string
    area?: number
    quantity?: number
    basePrice: number
    options: Array<{ name: string; price: number }>
    total: number
  }>
  onBack?: () => void
}

export default function QuoteStepDisplay({ 
  formData, 
  quoteConfig,
  calculatedTotal,
  calculatedBreakdown,
  onBack 
}: QuoteStepDisplayProps) {
  const config = {
    header: {
      title: 'Your Quote is Ready!',
      subtitle: "Here's your personalized estimate",
      showQuoteNumber: true,
      showSuccessIcon: true,
      ...quoteConfig.header
    },
    breakdown: {
      showServiceBreakdown: true,
      showOptionsBreakdown: true,
      showBaseCalculation: true,
      ...quoteConfig.breakdown
    },
    timeline: {
      showTimeline: true,
      steps: [
        { title: 'Site Visit', description: '3-5 business days', duration: '3-5 days' },
        { title: 'Final Quote', description: '1-2 business days', duration: '1-2 days' },
        { title: 'Project Start', description: '2-3 weeks', duration: '2-3 weeks' }
      ],
      ...quoteConfig.timeline
    },
    contact: {
      showContactInfo: true,
      showNextSteps: true,
      nextSteps: [
        { title: 'Quote Submitted', description: "We've received your quote request", status: 'completed' as const },
        { title: "We'll Call You", description: 'Within 24 hours to schedule site visit', status: 'active' as const },
        { title: 'Site Assessment', description: 'Professional measurement and consultation', status: 'pending' as const },
        { title: 'Final Quote', description: 'Detailed proposal with accurate pricing', status: 'pending' as const }
      ],
      ...quoteConfig.contact
    },
    cta: {
      showCta: true,
      title: 'Ready to Get Started?',
      subtitle: 'Call us now to expedite your project',
      buttonText: 'Call Now',
      phoneNumber: '(555) 123-4567',
      ...quoteConfig.cta
    },
    actions: {
      showBackButton: true,
      showShareButton: true,
      showDownloadButton: true,
      ...quoteConfig.actions
    },
    styling: {
      headerBgColor: 'bg-green-50',
      primaryColor: 'text-green-600',
      cardShadow: 'soft' as const,
      layout: 'sidebar' as const,
      ...quoteConfig.styling
    }
  }

  const quoteNumber = `LQ-${Date.now().toString().slice(-6)}`
  
  const shadowClass = {
    'none': '',
    'soft': 'shadow-md',
    'large': 'shadow-xl'
  }[config.styling.cardShadow]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Actions */}
        {(config.actions.showBackButton || config.actions.showShareButton || config.actions.showDownloadButton) && (
          <div className="flex items-center justify-between mb-8">
            {config.actions.showBackButton && onBack && (
              <button 
                onClick={onBack}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Form</span>
              </button>
            )}
            <div className="flex items-center space-x-2">
              {config.actions.showShareButton && (
                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                </button>
              )}
              {config.actions.showDownloadButton && (
                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 ${config.styling.layout === 'sidebar' ? 'lg:grid-cols-3' : ''} gap-8`}>
          {/* Quote Details */}
          <div className={`${config.styling.layout === 'sidebar' ? 'lg:col-span-2' : ''} space-y-6`}>
            {/* Success Header */}
            <div className={`${config.styling.headerBgColor} border border-green-200 rounded-lg ${shadowClass}`}>
              <div className="p-8 text-center">
                {config.header.showSuccessIcon && (
                  <CheckCircle className={`w-16 h-16 ${config.styling.primaryColor} mx-auto mb-4`} />
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {config.header.title}
                </h1>
                <p className="text-gray-600 mb-4">
                  {config.header.subtitle}
                </p>
                {config.header.showQuoteNumber && (
                  <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    Quote #{quoteNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Services Breakdown */}
            {config.breakdown.showServiceBreakdown && (
              <div className={`bg-white rounded-lg border border-gray-200 ${shadowClass}`}>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Services Breakdown</h2>
                </div>
                <div className="p-6 space-y-6">
                  {calculatedBreakdown.map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{item.service}</h3>
                        {item.area && (
                          <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                            {item.area} sq ft
                          </div>
                        )}
                        {item.quantity && (
                          <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                            {item.quantity} units
                          </div>
                        )}
                      </div>
                      
                      {config.breakdown.showBaseCalculation && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-600">
                            <span>Base installation (${item.basePrice} per {item.area ? 'sq ft' : 'unit'})</span>
                            <span>${(item.basePrice * (item.area || item.quantity || 1)).toLocaleString()}</span>
                          </div>
                          
                          {config.breakdown.showOptionsBreakdown && item.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex justify-between text-gray-600">
                              <span>{option.name}</span>
                              <span>+${option.price.toLocaleString()}</span>
                            </div>
                          ))}
                          
                          <hr className="my-2" />
                          <div className="flex justify-between font-semibold">
                            <span>Service Total</span>
                            <span>${item.total.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <hr className="my-6" />
                  
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total Project Cost</span>
                    <span className={config.styling.primaryColor}>${calculatedTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Project Timeline */}
            {config.timeline.showTimeline && (
              <div className={`bg-white rounded-lg border border-gray-200 ${shadowClass}`}>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Project Timeline</span>
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    {config.timeline.steps?.map((step, index) => (
                      <div key={index} className="space-y-2">
                        <div className={`w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto`}>
                          <span className="text-blue-600 font-semibold">{index + 1}</span>
                        </div>
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact & Next Steps Sidebar */}
          {config.styling.layout === 'sidebar' && (
            <div className="space-y-6">
              {/* Contact Information */}
              {config.contact.showContactInfo && (
                <div className={`bg-white rounded-lg border border-gray-200 ${shadowClass}`}>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Your Information</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {formData.name?.charAt(0) || formData.firstName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="font-medium">
                        {formData.name || `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'User'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      {formData.email && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{formData.email}</span>
                        </div>
                      )}
                      {formData.phone && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{formData.phone}</span>
                        </div>
                      )}
                      {formData.address && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{formData.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Next Steps */}
              {config.contact.showNextSteps && (
                <div className={`bg-white rounded-lg border border-gray-200 ${shadowClass}`}>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>What's Next?</span>
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 text-sm">
                      {config.contact.nextSteps?.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            step.status === 'completed' ? 'bg-green-600' :
                            step.status === 'active' ? 'bg-blue-600' : 'bg-gray-300'
                          }`}>
                            <span className="text-white text-xs">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{step.title}</p>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              {config.cta.showCta && (
                <div className={`bg-blue-600 text-white rounded-lg ${shadowClass}`}>
                  <div className="p-6 text-center">
                    <h3 className="font-semibold mb-2">{config.cta.title}</h3>
                    <p className="text-blue-100 text-sm mb-4">
                      {config.cta.subtitle}
                    </p>
                    <button className="w-full bg-white text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{config.cta.buttonText} {config.cta.phoneNumber}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}