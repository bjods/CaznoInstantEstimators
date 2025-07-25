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
  
  // Get widgets for performance analysis
  const { data: widgets } = await supabase
    .from('widgets')
    .select('*')
    .eq('business_id', businessId)
  
  // Process data for charts
  const submissionsByDay = {}
  const submissionsByMonth = {}
  const submissionsByStatus = { complete: 0, in_progress: 0, abandoned: 0 }
  const revenueByMonth = {}
  
  submissions?.forEach(submission => {
    const date = new Date(submission.created_at)
    const dayKey = date.toISOString().split('T')[0]
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
    
    // Daily submissions
    submissionsByDay[dayKey] = (submissionsByDay[dayKey] || 0) + 1
    
    // Monthly submissions
    submissionsByMonth[monthKey] = (submissionsByMonth[monthKey] || 0) + 1
    
    // Status breakdown
    submissionsByStatus[submission.completion_status] = 
      (submissionsByStatus[submission.completion_status] || 0) + 1
    
    // Revenue tracking (assuming $2500 average per completed lead)
    if (submission.completion_status === 'complete') {
      const revenue = submission.estimated_price || 2500
      revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + revenue
    }
  })
  
  return {
    submissions: submissions || [],
    widgets: widgets || [],
    submissionsByDay,
    submissionsByMonth,
    submissionsByStatus,
    revenueByMonth,
    totalRevenue: Object.values(revenueByMonth).reduce((sum: number, val: number) => sum + val, 0),
    conversionRate: submissions?.length ? 
      (submissionsByStatus.complete / submissions.length * 100).toFixed(1) : '0'
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
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your performance metrics and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {analytics.submissions.length}
          </div>
          <div className="text-sm text-gray-600 mb-1">Total Leads</div>
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
            {analytics.conversionRate}%
          </div>
          <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
          <div className="text-xs text-gray-500">
            {analytics.submissionsByStatus.complete} completed leads
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            ${analytics.totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
          <div className="text-xs text-gray-500">
            From completed projects
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {analytics.widgets.length}
          </div>
          <div className="text-sm text-gray-600 mb-1">Active Widgets</div>
          <div className="text-xs text-gray-500">
            Generating leads
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Daily Submissions Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Submissions (Last 7 Days)</h2>
          <div className="space-y-3">
            {last7Days.map(day => {
              const count = analytics.submissionsByDay[day] || 0
              const maxCount = Math.max(...last7Days.map(d => analytics.submissionsByDay[d] || 0)) || 1
              const percentage = (count / maxCount) * 100
              
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
                  <div className="w-8 text-xs text-gray-900 font-medium text-right">
                    {count}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Status Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-700">Completed</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {analytics.submissionsByStatus.complete} leads
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-700">In Progress</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {analytics.submissionsByStatus.in_progress} leads
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span className="text-sm text-gray-700">Abandoned</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {analytics.submissionsByStatus.abandoned} leads
              </div>
            </div>
          </div>
          
          {/* Visual breakdown */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-full flex">
                <div 
                  className="bg-green-500"
                  style={{ 
                    width: `${analytics.submissions.length ? (analytics.submissionsByStatus.complete / analytics.submissions.length) * 100 : 0}%` 
                  }}
                ></div>
                <div 
                  className="bg-yellow-500"
                  style={{ 
                    width: `${analytics.submissions.length ? (analytics.submissionsByStatus.in_progress / analytics.submissions.length) * 100 : 0}%` 
                  }}
                ></div>
                <div 
                  className="bg-gray-500"
                  style={{ 
                    width: `${analytics.submissions.length ? (analytics.submissionsByStatus.abandoned / analytics.submissions.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue (Last 6 Months)</h2>
          <div className="space-y-3">
            {last6Months.map(month => {
              const revenue = analytics.revenueByMonth[month] || 0
              const maxRevenue = Math.max(...last6Months.map(m => analytics.revenueByMonth[m] || 0)) || 1
              const percentage = (revenue / maxRevenue) * 100
              
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
                    ${revenue.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Widget Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Widget Performance</h2>
          {analytics.widgets.length > 0 ? (
            <div className="space-y-4">
              {analytics.widgets.map(widget => {
                const widgetSubmissions = analytics.submissions.filter(s => s.widget_id === widget.id)
                return (
                  <div key={widget.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{widget.name}</h3>
                      <span className="text-sm text-gray-500">{widgetSubmissions.length} leads</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      Conversion: {widgetSubmissions.length ? 
                        ((widgetSubmissions.filter(s => s.completion_status === 'complete').length / widgetSubmissions.length) * 100).toFixed(1)
                        : '0'
                      }%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ 
                          width: `${analytics.submissions.length ? (widgetSubmissions.length / analytics.submissions.length) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <WrenchScrewdriverIcon className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No widgets configured yet</p>
            </div>
          )}
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