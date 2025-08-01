'use client'

import { useState, useMemo } from 'react'
import WidgetSelector from './WidgetSelector'
import Link from 'next/link'

interface Widget {
  id: string
  name: string
  embed_key: string
  config?: any
  has_pricing?: boolean
  show_instant_estimate?: boolean
  has_booking?: boolean
  appointment_booking?: boolean
}

interface Submission {
  id: string
  widget_id: string
  full_name?: string
  email?: string
  phone?: string
  pricing_data?: {
    estimate?: number
    basePrice?: number
    finalPrice?: number
    display_price?: string
  }
  completion_status: string
  appointment_date?: string
  service_type?: string
  booking_confirmed?: boolean
  started_at?: string
  created_at: string
  widgets?: {
    name: string
    embed_key: string
    config?: any
  }
}

interface AnalyticsContentProps {
  widgets: Widget[]
  submissions: Submission[]
  businessId: string
}

export default function AnalyticsContent({
  widgets,
  submissions,
  businessId
}: AnalyticsContentProps) {
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null)

  // Filter data based on selected widget
  const filteredData = useMemo(() => {
    if (!selectedWidgetId) {
      // Show all data
      return {
        submissions,
        widgets
      }
    }

    // Filter by selected widget
    return {
      submissions: submissions.filter(s => s.widget_id === selectedWidgetId),
      widgets: widgets.filter(w => w.id === selectedWidgetId)
    }
  }, [selectedWidgetId, submissions, widgets])

  // Detect widget capabilities using pricingCalculator in config
  const hasInstantPricing = filteredData.widgets.some(w => {
    // Check if widget has pricingCalculator in config
    if (w.config && typeof w.config === 'object' && w.config.pricingCalculator) {
      return true
    }
    // Fallback to old detection methods
    return w.has_pricing || w.show_instant_estimate
  })

  const hasBooking = filteredData.widgets.some(w => w.has_booking || w.appointment_booking)

  // Process data for analytics
  const analyticsData = useMemo(() => {
    const estimatesByDay: Record<string, number> = {}
    const estimatesByMonth: Record<string, number> = {}
    const estimatesByService: Record<string, { count: number; value: number }> = {}
    const afterHoursSubmissions: Submission[] = []
    const businessHoursSubmissions: Submission[] = []
    const appointmentsByHour: Record<number, number> = {}
    const bookingsByDay: Record<string, number> = {}
    
    filteredData.submissions.forEach(submission => {
      const date = new Date(submission.created_at)
      const dayKey = date.toISOString().split('T')[0]
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
      const hour = date.getHours()
      const estimatedPrice = submission.pricing_data?.estimate || submission.pricing_data?.finalPrice || 0
      
      // Estimate values by day (only for pricing widgets)
      if (hasInstantPricing) {
        estimatesByDay[dayKey] = (estimatesByDay[dayKey] || 0) + estimatedPrice
        estimatesByMonth[monthKey] = (estimatesByMonth[monthKey] || 0) + estimatedPrice
      }
      
      // Estimates by service type
      const service = submission.service_type || 'General Service'
      if (!estimatesByService[service]) {
        estimatesByService[service] = { count: 0, value: 0 }
      }
      estimatesByService[service].count += 1
      estimatesByService[service].value += estimatedPrice
      
      // Booking analytics (only for booking widgets)
      if (hasBooking && (submission.appointment_date || submission.booking_confirmed)) {
        bookingsByDay[dayKey] = (bookingsByDay[dayKey] || 0) + 1
        
        // Track appointment times if available
        if (submission.appointment_date) {
          const appointmentDate = new Date(submission.appointment_date)
          const appointmentHour = appointmentDate.getHours()
          appointmentsByHour[appointmentHour] = (appointmentsByHour[appointmentHour] || 0) + 1
        }
      }
      
      // After hours tracking (after 6 PM or before 8 AM, or weekends)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const isAfterHours = hour < 8 || hour >= 18 || isWeekend
      
      if (isAfterHours) {
        afterHoursSubmissions.push(submission)
      } else {
        businessHoursSubmissions.push(submission)
      }
    })
    
    // Calculate after hours metrics
    const afterHoursValue = afterHoursSubmissions.reduce((total, sub) => 
      total + (sub.pricing_data?.estimate || sub.pricing_data?.finalPrice || 0), 0
    )
    const businessHoursValue = businessHoursSubmissions.reduce((total, sub) => 
      total + (sub.pricing_data?.estimate || sub.pricing_data?.finalPrice || 0), 0
    )
    const afterHoursRate = filteredData.submissions.length ? 
      (afterHoursSubmissions.length / filteredData.submissions.length * 100).toFixed(1) : '0'
    
    // Calculate completion rates
    const startedSubmissions = filteredData.submissions.filter(s => s.started_at) || []
    const completedSubmissions = filteredData.submissions.filter(s => s.completion_status === 'complete') || []
    const formCompletionRate = startedSubmissions.length > 0 ? 
      Math.round((completedSubmissions.length / startedSubmissions.length) * 100) : 0
    
    const bookingCompletionRate = hasBooking && filteredData.submissions.length ? 
      Math.round((Object.values(bookingsByDay).reduce((sum: number, val: number) => sum + val, 0) / filteredData.submissions.length) * 100) : 0
    
    return {
      estimatesByDay,
      estimatesByMonth,
      estimatesByService,
      bookingsByDay,
      appointmentsByHour,
      formCompletionRate,
      bookingCompletionRate,
      afterHours: {
        count: afterHoursSubmissions.length,
        rate: afterHoursRate,
        value: afterHoursValue
      },
      businessHours: {
        count: businessHoursSubmissions.length,
        value: businessHoursValue
      },
      totalEstimateValue: Object.values(estimatesByMonth).reduce((sum: number, val: number) => sum + val, 0),
      totalBookings: Object.values(bookingsByDay).reduce((sum: number, val: number) => sum + val, 0)
    }
  }, [filteredData.submissions, hasInstantPricing, hasBooking])

  // Prepare chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - i))
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
  })

  const selectedWidgetName = selectedWidgetId 
    ? widgets.find(w => w.id === selectedWidgetId)?.name 
    : null

  return (
    <div className="space-y-8">
      {/* Header with Widget Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Estimator Analytics
            {selectedWidgetName && <span className="text-gray-500"> - {selectedWidgetName}</span>}
          </h1>
          <p className="text-gray-600">
            {selectedWidgetId 
              ? 'Track estimate values, service breakdowns, and after-hours capture for selected widget' 
              : 'Track estimate values, service breakdowns, and after-hours capture across all widgets'
            }
          </p>
        </div>
        
        <WidgetSelector
          widgets={widgets}
          selectedWidgetId={selectedWidgetId}
          onWidgetChange={setSelectedWidgetId}
          className="w-64"
        />
      </div>

      {/* Key Metrics - Adaptive based on widget type */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {filteredData.submissions.length}
          </div>
          <div className="text-sm text-gray-600 mb-1">Total Submissions</div>
          <div className="text-xs text-green-600">
            +{filteredData.submissions.filter(s => {
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              return new Date(s.created_at) > weekAgo
            }).length} this week
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {analyticsData.formCompletionRate}%
          </div>
          <div className="text-sm text-gray-600 mb-1">Form Completion Rate</div>
          <div className="text-xs text-gray-500">
            Of started forms completed
          </div>
        </div>

        {hasInstantPricing && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              ${analyticsData.totalEstimateValue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mb-1">Total Estimate Value</div>
            <div className="text-xs text-gray-500">
              All-time estimates combined
            </div>
          </div>
        )}

        {hasBooking && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {analyticsData.totalBookings}
            </div>
            <div className="text-sm text-gray-600 mb-1">Total Appointments</div>
            <div className="text-xs text-gray-500">
              {analyticsData.bookingCompletionRate}% booking rate
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {analyticsData.afterHours.rate}%
          </div>
          <div className="text-sm text-gray-600 mb-1">After Hours Rate</div>
          <div className="text-xs text-gray-500">
            {analyticsData.afterHours.count} after-hours submissions
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Daily Estimate Values Chart - Only show for pricing widgets */}
        {hasInstantPricing && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Estimate Values (Last 7 Days)</h2>
            <div className="space-y-3">
              {last7Days.map(day => {
                const value = analyticsData.estimatesByDay[day] || 0
                const maxValue = Math.max(...last7Days.map(d => analyticsData.estimatesByDay[d] || 0)) || 1
                const percentage = (value / maxValue) * 100
                
                return (
                  <div key={day} className="flex items-center space-x-3">
                    <div className="w-20 text-xs text-gray-600">
                      {new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                      <div 
                        className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-16 text-xs text-gray-900 font-medium text-right">
                      ${value.toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Daily Bookings Chart - Only show for booking widgets */}
        {hasBooking && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Bookings (Last 7 Days)</h2>
            <div className="space-y-3">
              {last7Days.map(day => {
                const value = analyticsData.bookingsByDay[day] || 0
                const maxValue = Math.max(...last7Days.map(d => analyticsData.bookingsByDay[d] || 0)) || 1
                const percentage = (value / maxValue) * 100
                
                return (
                  <div key={day} className="flex items-center space-x-3">
                    <div className="w-20 text-xs text-gray-600">
                      {new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                      <div 
                        className="bg-indigo-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-16 text-xs text-gray-900 font-medium text-right">
                      {value}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Estimates by Service */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Estimates by Service Type</h2>
          <div className="space-y-4">
            {Object.entries(analyticsData.estimatesByService).map(([service, data]) => {
              const serviceData = data as { count: number; value: number }
              return (
                <div key={service} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{service}</h3>
                    <span className="text-sm text-gray-500">{serviceData.count} estimates</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    Total Value: ${serviceData.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    Avg Value: ${Math.round(serviceData.value / serviceData.count || 0).toLocaleString()}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ 
                        width: `${filteredData.submissions.length ? (serviceData.count / filteredData.submissions.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )
            })}
            {Object.keys(analyticsData.estimatesByService).length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No service data available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Estimate Values Chart - Only show for pricing widgets */}
        {hasInstantPricing && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Estimate Values (Last 6 Months)</h2>
            <div className="space-y-3">
              {last6Months.map(month => {
                const value = analyticsData.estimatesByMonth[month] || 0
                const maxValue = Math.max(...last6Months.map(m => analyticsData.estimatesByMonth[m] || 0)) || 1
                const percentage = (value / maxValue) * 100
                
                return (
                  <div key={month} className="flex items-center space-x-3">
                    <div className="w-16 text-xs text-gray-600">
                      {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                      <div 
                        className="bg-green-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-16 text-xs text-gray-900 font-medium text-right">
                      ${value.toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Appointment Times Chart - Only show for booking widgets */}
        {hasBooking && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Times Distribution</h2>
            <div className="space-y-2">
              {Array.from({ length: 12 }, (_, i) => {
                const hour = i + 8 // 8 AM to 7 PM
                const hourKey = hour
                const value = analyticsData.appointmentsByHour[hourKey] || 0
                const maxValue = Math.max(...Object.values(analyticsData.appointmentsByHour)) || 1
                const percentage = (value / maxValue) * 100
                const displayHour = hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`
                
                return (
                  <div key={hour} className="flex items-center space-x-3">
                    <div className="w-16 text-xs text-gray-600">
                      {displayHour}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                      <div 
                        className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-xs text-gray-900 font-medium text-right">
                      {value}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Shows when customers prefer to book appointments
            </div>
          </div>
        )}

        {/* After Hours vs Business Hours */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Hours vs After Hours</h2>
          <div className="space-y-6">
            
            {/* Business Hours */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Business Hours (8 AM - 6 PM)</h3>
                <span className="text-sm text-gray-500">{analyticsData.businessHours.count} estimates</span>
              </div>
              <div className="text-xs text-gray-600 mb-2">
                Total Value: ${analyticsData.businessHours.value.toLocaleString()}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ 
                    width: `${filteredData.submissions.length ? (analyticsData.businessHours.count / filteredData.submissions.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* After Hours */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">After Hours & Weekends</h3>
                <span className="text-sm text-gray-500">{analyticsData.afterHours.count} estimates</span>
              </div>
              <div className="text-xs text-gray-600 mb-2">
                Total Value: ${analyticsData.afterHours.value.toLocaleString()}
              </div>
              <div className="text-xs text-purple-600 mb-2">
                {analyticsData.afterHours.rate}% of all estimates
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full"
                  style={{ 
                    width: `${filteredData.submissions.length ? (analyticsData.afterHours.count / filteredData.submissions.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
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