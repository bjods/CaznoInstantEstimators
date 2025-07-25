import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function getDashboardData(businessId: string) {
  const supabase = createClient()
  
  // Get widgets
  const { data: widgets } = await supabase
    .from('widgets')
    .select('*')
    .eq('business_id', businessId)
  
  // Get submissions (leads)
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('business_id', businessId)
  
  // Get recent submissions
  const { data: recentSubmissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(5)
  
  // Calculate stats
  const totalWidgets = widgets?.length || 0
  const totalLeads = submissions?.length || 0
  const completedLeads = submissions?.filter(s => s.completion_status === 'complete').length || 0
  const conversionRate = totalLeads > 0 ? Math.round((completedLeads / totalLeads) * 100) : 0
  
  // Calculate estimated revenue (using average of $2500 per completed lead)
  const estimatedRevenue = completedLeads * 2500
  
  return {
    widgets,
    submissions,
    recentSubmissions,
    stats: {
      totalWidgets,
      totalLeads,
      completedLeads,
      conversionRate,
      estimatedRevenue
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

  if (!userProfiles || userProfiles.length === 0 || !userProfiles[0]?.business_id) {
    redirect('/setup')
  }

  const userProfile = userProfiles[0]

  // Get business info
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', userProfile.business_id)
    .single()

  const dashboardData = await getDashboardData(userProfile.business_id)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-lime-400 to-green-500 rounded-2xl p-8 text-black">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {business?.name}! 👋
        </h1>
        <p className="text-lg opacity-90">
          Here's what's happening with your lead generation today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Widgets</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalWidgets}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🛠️</span>
            </div>
          </div>
          <div className="mt-4">
            {dashboardData.stats.totalWidgets === 0 ? (
              <Link href="/dashboard/widgets" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Create your first widget →
              </Link>
            ) : (
              <Link href="/dashboard/widgets" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Manage widgets →
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalLeads}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/leads" className="text-sm text-green-600 hover:text-green-800 font-medium">
              View all leads →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.conversionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/analytics" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
              View analytics →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Est. Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${dashboardData.stats.estimatedRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Based on completed leads</span>
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
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
              <p className="text-gray-500 mb-4">Your leads will appear here once customers submit forms.</p>
              <Link href="/dashboard/widgets" className="inline-flex items-center px-4 py-2 bg-lime-400 text-black rounded-lg hover:bg-lime-300 transition-colors font-medium">
                Create a widget to get started
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <Link href="/dashboard/widgets" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🛠️</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Create New Widget</h3>
                  <p className="text-sm text-gray-500">Add a new quote calculator to your website</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/leads" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">👥</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Manage Leads</h3>
                  <p className="text-sm text-gray-500">View and follow up with your prospects</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/analytics" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">View Analytics</h3>
                  <p className="text-sm text-gray-500">Track performance and conversions</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/settings" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">⚙️</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Business Settings</h3>
                  <p className="text-sm text-gray-500">Update your profile and preferences</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Getting Started Section - Only show if no widgets */}
      {dashboardData.stats.totalWidgets === 0 && (
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 text-white">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">🚀 Ready to capture your first lead?</h2>
            <p className="text-gray-300 mb-6">
              Create your first instant quote widget and start converting website visitors into paying customers. 
              It takes less than 5 minutes to set up.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard/widgets" className="inline-flex items-center px-6 py-3 bg-lime-400 text-black rounded-lg hover:bg-lime-300 transition-colors font-bold">
                Create Your First Widget
              </Link>
              <Link href="/case-studies" className="inline-flex items-center px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-black transition-colors font-medium">
                See Success Stories
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}