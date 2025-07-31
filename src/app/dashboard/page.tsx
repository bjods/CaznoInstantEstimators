import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardContent from '@/components/dashboard/DashboardContent'

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
  
  return {
    widgets: widgets || [],
    submissions: submissions || [],
    thisWeekSubmissions,
    recentSubmissions: recentSubmissions || [],
    businessId
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

  if (!userProfile?.business_id) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No Business Access</h1>
        <p className="text-gray-600">You don't have access to any business dashboard.</p>
      </div>
    )
  }

  const dashboardData = await getDashboardData(userProfile.business_id)

  return (
    <DashboardContent 
      widgets={dashboardData.widgets}
      submissions={dashboardData.submissions}
      thisWeekSubmissions={dashboardData.thisWeekSubmissions}
      recentSubmissions={dashboardData.recentSubmissions}
      businessId={dashboardData.businessId}
    />
  )
}