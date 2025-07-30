import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  WrenchScrewdriverIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline'

async function getDashboardData(businessId: string) {
  const supabase = createClient()
  
  // Get widgets
  const { data: widgets } = await supabase
    .from('widgets')
    .select('*')
    .eq('business_id', businessId)
  
  // Get all submissions
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('business_id', businessId)
  
  // Get this week's submissions (last 7 days)
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  const thisWeekSubmissions = submissions?.filter(s => 
    new Date(s.created_at) >= oneWeekAgo
  ) || []
  
  // Get recent submissions for display
  const { data: recentSubmissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(5)
  
  // Calculate this week's estimated value
  const thisWeekEstimatedValue = thisWeekSubmissions.reduce((total, submission) => {
    return total + (submission.estimated_price || 0)
  }, 0)
  
  // Calculate leads by source (top 3)
  const sourceCount = {}
  submissions?.forEach(submission => {
    const source = submission.source || 'Direct'
    sourceCount[source] = (sourceCount[source] || 0) + 1
  })
  
  const topSources = Object.entries(sourceCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([source, count]) => ({ source, count }))
  
  return {
    widgets,
    submissions,
    recentSubmissions,
    stats: {
      totalWidgets: widgets?.length || 0,
      thisWeekLeads: thisWeekSubmissions.length,
      thisWeekEstimatedValue,
      topSources
    }
  }
}

export default async function Dashboard() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get user's business - get the first/primary business
  const { data: userProfiles } = await supabase
    .from('user_profiles')
    .select('business_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  const userProfile = userProfiles?.[0]

  // Get business info and dashboard data only if user has a profile
  let business = null
  let dashboardData = {
    widgets: [],
    submissions: [],
    recentSubmissions: [],
    stats: {
      totalWidgets: 0,
      totalLeads: 0,
      completedLeads: 0,
      conversionRate: 0,
      estimatedRevenue: 0
    }
  }

  if (userProfile?.business_id) {
    const { data: businessData } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', userProfile.business_id)
      .single()
    
    business = businessData
    dashboardData = await getDashboardData(userProfile.business_id)
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">
          Track your lead generation performance and view detailed metrics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Leads This Week</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.thisWeekLeads}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/submissions" className="text-sm text-green-600 hover:text-green-800 font-medium">
              View all submissions →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estimated Value This Week</p>
              <p className="text-3xl font-bold text-gray-900">${dashboardData.stats.thisWeekEstimatedValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/analytics" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View analytics →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Lead Sources</p>
              <div className="mt-2 space-y-1">
                {dashboardData.stats.topSources.map((source, index) => (
                  <div key={source.source} className="flex justify-between text-sm">
                    <span className="text-gray-700">{source.source}</span>
                    <span className="font-medium text-gray-900">{source.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ChartPieIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Leads</h2>
            <Link href="/dashboard/leads" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all
            </Link>
          </div>
          
          {dashboardData.recentSubmissions && dashboardData.recentSubmissions.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">
                        {submission.full_name?.charAt(0) || submission.email?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {submission.full_name || submission.email || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </p>
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
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <DocumentTextIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
              <p className="text-gray-500">Your leads will appear here once your widgets start receiving submissions.</p>
            </div>
          )}
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Access</h2>
          
          <div className="space-y-4">
            <Link href="/dashboard/submissions" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">View All Submissions</h3>
                  <p className="text-sm text-gray-500">See detailed lead information and status</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/analytics" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <ChartPieIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Analytics & Charts</h3>
                  <p className="text-sm text-gray-500">Detailed performance metrics and trends</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/contact" className="block p-4 bg-lime-50 rounded-lg hover:bg-lime-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-lime-500 rounded-lg flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Contact Support</h3>
                  <p className="text-sm text-gray-500">Get help or request new features</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/widgets" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <WrenchScrewdriverIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Widget Status</h3>
                  <p className="text-sm text-gray-500">View your active calculators</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}