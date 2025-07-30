import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'

async function getAnalyticsData(businessId: string) {
  const supabase = createClient()
  
  // Get submissions with dates for trending
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: true })
  
  // Get widgets for service analysis
  const { data: widgets } = await supabase
    .from('widgets')
    .select('*')
    .eq('business_id', businessId)
  
  // Process data for estimator-focused analytics
  const estimatesByDay = {}
  const estimatesByMonth = {}
  const estimatesByService = {}
  const afterHoursSubmissions = []
  const businessHoursSubmissions = []
  
  submissions?.forEach(submission => {
    const date = new Date(submission.created_at)
    const dayKey = date.toISOString().split('T')[0]
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
    const hour = date.getHours()
    const estimatedPrice = submission.estimated_price || 0
    
    // Estimate values by day
    estimatesByDay[dayKey] = (estimatesByDay[dayKey] || 0) + estimatedPrice
    
    // Estimate values by month
    estimatesByMonth[monthKey] = (estimatesByMonth[monthKey] || 0) + estimatedPrice
    
    // Estimates by service type
    const service = submission.service_type || 'General Service'
    estimatesByService[service] = (estimatesByService[service] || { count: 0, value: 0 })
    estimatesByService[service].count += 1
    estimatesByService[service].value += estimatedPrice
    
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
    total + (sub.estimated_price || 0), 0
  )
  const businessHoursValue = businessHoursSubmissions.reduce((total, sub) => 
    total + (sub.estimated_price || 0), 0
  )
  const afterHoursRate = submissions?.length ? 
    (afterHoursSubmissions.length / submissions.length * 100).toFixed(1) : '0'
  
  return {
    submissions: submissions || [],
    widgets: widgets || [],
    estimatesByDay,
    estimatesByMonth,
    estimatesByService,
    afterHours: {
      count: afterHoursSubmissions.length,
      rate: afterHoursRate,
      value: afterHoursValue
    },
    businessHours: {
      count: businessHoursSubmissions.length,
      value: businessHoursValue
    },
    totalEstimateValue: Object.values(estimatesByMonth).reduce((sum: number, val: number) => sum + val, 0)
  }
}

export default async function AnalyticsPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get user's business
  const { data: userProfiles } = await supabase
    .from('user_profiles')
    .select('business_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  const analytics = userProfiles?.[0]?.business_id 
    ? await getAnalyticsData(userProfiles[0].business_id)
    : {
        submissions: [],
        widgets: [],
        submissionsByDay: {},
        submissionsByMonth: {},
        submissionsByStatus: { complete: 0, in_progress: 0, abandoned: 0 },
        revenueByMonth: {},
        totalRevenue: 0,
        conversionRate: '0'
      }

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Estimator Analytics</h1>
        <p className="text-gray-600">Track estimate values, service breakdowns, and after-hours capture</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {analytics.submissions.length}
          </div>
          <div className="text-sm text-gray-600 mb-1">Total Estimates</div>
          <div className="text-xs text-green-600">
            +{analytics.submissions.filter(s => {
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              return new Date(s.created_at) > weekAgo
            }).length} this week
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-green-600 mb-2">
            ${analytics.totalEstimateValue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mb-1">Total Estimate Value</div>
          <div className="text-xs text-gray-500">
            All-time estimates combined
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {analytics.afterHours.rate}%
          </div>
          <div className="text-sm text-gray-600 mb-1">After Hours Rate</div>
          <div className="text-xs text-gray-500">
            {analytics.afterHours.count} after-hours estimates
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            ${analytics.afterHours.value.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mb-1">After Hours Value</div>
          <div className="text-xs text-gray-500">
            Revenue captured outside business hours
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Daily Estimate Values Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Estimate Values (Last 7 Days)</h2>
          <div className="space-y-3">
            {last7Days.map(day => {
              const value = analytics.estimatesByDay[day] || 0
              const maxValue = Math.max(...last7Days.map(d => analytics.estimatesByDay[d] || 0)) || 1
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

        {/* Estimates by Service */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Estimates by Service Type</h2>
          <div className="space-y-4">
            {Object.entries(analytics.estimatesByService).map(([service, data]) => (
              <div key={service} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{service}</h3>
                  <span className="text-sm text-gray-500">{data.count} estimates</span>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  Total Value: ${data.value.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  Avg Value: ${Math.round(data.value / data.count || 0).toLocaleString()}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ 
                      width: `${analytics.submissions.length ? (data.count / analytics.submissions.length) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
            {Object.keys(analytics.estimatesByService).length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No service data available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Estimate Values Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Estimate Values (Last 6 Months)</h2>
          <div className="space-y-3">
            {last6Months.map(month => {
              const value = analytics.estimatesByMonth[month] || 0
              const maxValue = Math.max(...last6Months.map(m => analytics.estimatesByMonth[m] || 0)) || 1
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

        {/* After Hours vs Business Hours */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Hours vs After Hours</h2>
          <div className="space-y-6">
            
            {/* Business Hours */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Business Hours (8 AM - 6 PM)</h3>
                <span className="text-sm text-gray-500">{analytics.businessHours.count} estimates</span>
              </div>
              <div className="text-xs text-gray-600 mb-2">
                Total Value: ${analytics.businessHours.value.toLocaleString()}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ 
                    width: `${analytics.submissions.length ? (analytics.businessHours.count / analytics.submissions.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* After Hours */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">After Hours & Weekends</h3>
                <span className="text-sm text-gray-500">{analytics.afterHours.count} estimates</span>
              </div>
              <div className="text-xs text-gray-600 mb-2">
                Total Value: ${analytics.afterHours.value.toLocaleString()}
              </div>
              <div className="text-xs text-purple-600 mb-2">
                {analytics.afterHours.rate}% of all estimates
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full"
                  style={{ 
                    width: `${analytics.submissions.length ? (analytics.afterHours.count / analytics.submissions.length) * 100 : 0}%` 
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