'use client'

import { useState, useMemo } from 'react'
import WidgetSelector from './WidgetSelector'
import { 
  WrenchScrewdriverIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ChartPieIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Widget {
  id: string
  name: string
  embed_key: string
  has_pricing?: boolean
  show_instant_estimate?: boolean
  has_booking?: boolean
  appointment_booking?: boolean
}

interface Submission {
  id: string
  widget_id: string
  customer: any
  service: any
  estimated_price?: number
  completion_status: string
  appointment_date?: string
  created_at: string
}

interface DashboardContentProps {
  widgets: Widget[]
  submissions: Submission[]
  thisWeekSubmissions: Submission[]
  recentSubmissions: Submission[]
  businessId: string
}

export default function DashboardContent({
  widgets,
  submissions,
  thisWeekSubmissions,
  recentSubmissions,
  businessId
}: DashboardContentProps) {
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null)

  // Filter data based on selected widget
  const filteredData = useMemo(() => {
    if (!selectedWidgetId) {
      // Show all data
      return {
        submissions,
        thisWeekSubmissions,
        recentSubmissions,
        widgets
      }
    }

    // Filter by selected widget
    return {
      submissions: submissions.filter(s => s.widget_id === selectedWidgetId),
      thisWeekSubmissions: thisWeekSubmissions.filter(s => s.widget_id === selectedWidgetId),
      recentSubmissions: recentSubmissions.filter(s => s.widget_id === selectedWidgetId),
      widgets: widgets.filter(w => w.id === selectedWidgetId)
    }
  }, [selectedWidgetId, submissions, thisWeekSubmissions, recentSubmissions, widgets])

  // Detect widget capabilities
  const hasInstantPricing = filteredData.widgets.some(w => w.has_pricing || w.show_instant_estimate)
  const hasBooking = filteredData.widgets.some(w => w.has_booking || w.appointment_booking)

  // Calculate metrics
  const totalSubmissions = filteredData.submissions.length
  const thisWeekCount = filteredData.thisWeekSubmissions.length
  const lastWeekStart = new Date()
  lastWeekStart.setDate(lastWeekStart.getDate() - 14)
  const lastWeekEnd = new Date()
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 7)
  
  const lastWeekSubmissions = filteredData.submissions.filter(s => {
    const submissionDate = new Date(s.created_at)
    return submissionDate >= lastWeekStart && submissionDate < lastWeekEnd
  })
  
  const lastWeekCount = lastWeekSubmissions.length

  // Calculate completion rate
  const completedSubmissions = filteredData.submissions.filter(s => s.completion_status === 'complete')
  const completionRate = totalSubmissions > 0 ? (completedSubmissions.length / totalSubmissions) * 100 : 0

  // Calculate total estimate value (for pricing widgets)
  const totalEstimateValue = hasInstantPricing 
    ? filteredData.submissions
        .filter(s => s.estimated_price && typeof s.estimated_price === 'number')
        .reduce((sum, s) => sum + (s.estimated_price || 0), 0)
    : 0

  // Calculate appointment count (for booking widgets)
  const appointmentCount = hasBooking 
    ? filteredData.submissions.filter(s => s.appointment_date).length 
    : 0

  // After hours rate calculation
  const afterHoursSubmissions = filteredData.submissions.filter(s => {
    const hour = new Date(s.created_at).getHours()
    const day = new Date(s.created_at).getDay()
    return hour < 8 || hour >= 18 || day === 0 || day === 6 // Before 8am, after 6pm, or weekends
  })
  const afterHoursRate = totalSubmissions > 0 ? (afterHoursSubmissions.length / totalSubmissions) * 100 : 0

  // Growth calculation
  const growthRate = lastWeekCount > 0 ? ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100 : 0
  const isGrowthPositive = growthRate > 0

  const selectedWidgetName = selectedWidgetId 
    ? widgets.find(w => w.id === selectedWidgetId)?.name 
    : null

  return (
    <div className="space-y-6">
      {/* Header with Widget Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
            {selectedWidgetName && <span className="text-gray-500"> - {selectedWidgetName}</span>}
          </h1>
          <p className="text-gray-600">
            {selectedWidgetId ? 'Analytics for selected widget' : 'Analytics for all widgets'}
          </p>
        </div>
        
        <WidgetSelector
          widgets={widgets}
          selectedWidgetId={selectedWidgetId}
          onWidgetChange={setSelectedWidgetId}
          className="w-64"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Submissions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
              <div className="flex items-center text-sm">
                <ArrowTrendingUpIcon 
                  className={`h-4 w-4 mr-1 ${isGrowthPositive ? 'text-green-500' : 'text-red-500'}`} 
                />
                <span className={isGrowthPositive ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(growthRate).toFixed(1)}% vs last week
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Completion Rate */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Form Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">{completedSubmissions.length} of {totalSubmissions} completed</p>
            </div>
          </div>
        </div>

        {/* Conditional Third Metric */}
        {hasInstantPricing && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Estimate Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalEstimateValue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">All-time estimates</p>
              </div>
            </div>
          </div>
        )}

        {hasBooking && !hasInstantPricing && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{appointmentCount}</p>
                <p className="text-sm text-gray-600">Booked appointments</p>
              </div>
            </div>
          </div>
        )}

        {/* After Hours Rate */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">After Hours Rate</p>
              <p className="text-2xl font-bold text-gray-900">{afterHoursRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">{afterHoursSubmissions.length} after hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Submissions</h2>
          <Link 
            href={`/dashboard/submissions${selectedWidgetId ? `?widget=${selectedWidgetId}` : ''}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all submissions →
          </Link>
        </div>
        
        {filteredData.recentSubmissions.length > 0 ? (
          <div className="space-y-3">
            {filteredData.recentSubmissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {submission.customer?.name || 'Anonymous'}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{submission.service?.type || 'Service request'}</span>
                    {submission.estimated_price && (
                      <span>${submission.estimated_price.toLocaleString()}</span>
                    )}
                    <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    submission.completion_status === 'complete' 
                      ? 'bg-green-100 text-green-800'
                      : submission.completion_status === 'in_progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {submission.completion_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No recent submissions for {selectedWidgetName || 'selected widgets'}</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/analytics"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChartPieIcon className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-600">Detailed performance metrics</p>
            </div>
          </Link>

          <Link
            href="/dashboard/submissions"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UsersIcon className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Manage Leads</p>
              <p className="text-sm text-gray-600">View and contact submissions</p>
            </div>
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <WrenchScrewdriverIcon className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Widget Settings</p>
              <p className="text-sm text-gray-600">Configure security and domains</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}