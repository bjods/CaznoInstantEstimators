import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardContent from '@/components/dashboard/DashboardContent'

async function getDashboardData(businessIds: string[]) {
  const supabase = createClient()
  
  if (businessIds.length === 0) {
    return {
      widgets: [],
      submissions: [],
      thisWeekSubmissions: [],
      recentSubmissions: [],
      businessIds
    }
  }
  
  // Get widgets for all user's businesses
  const { data: widgets } = await supabase
    .from('widgets')
    .select('*')
    .in('business_id', businessIds)
  
  // Get all submissions with widget information
  const { data: submissions } = await supabase
    .from('submissions')
    .select(`
      *,
      widgets(name, embed_key)
    `)
    .in('business_id', businessIds)
  
  // Get this week's submissions (last 7 days)
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  const thisWeekSubmissions = submissions?.filter(s => 
    new Date(s.created_at) >= oneWeekAgo
  ) || []
  
  // Get recent submissions for display with widget information
  const { data: recentSubmissions } = await supabase
    .from('submissions')
    .select(`
      *,
      widgets(name, embed_key)
    `)
    .in('business_id', businessIds)
    .order('created_at', { ascending: false })
    .limit(5)
  
  return {
    widgets: widgets || [],
    submissions: submissions || [],
    thisWeekSubmissions,
    recentSubmissions: recentSubmissions || [],
    businessIds
  }
}

export default async function Dashboard() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get all user's businesses
  const { data: userProfiles } = await supabase
    .from('user_profiles')
    .select('business_id')
    .eq('user_id', user.id)

  const businessIds = userProfiles?.map(profile => profile.business_id).filter(Boolean) || []

  if (businessIds.length === 0) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No Business Access</h1>
        <p className="text-gray-600">You don't have access to any business dashboard.</p>
      </div>
    )
  }

  const dashboardData = await getDashboardData(businessIds)

  return (
    <DashboardContent 
      widgets={dashboardData.widgets}
      submissions={dashboardData.submissions}
      thisWeekSubmissions={dashboardData.thisWeekSubmissions}
      recentSubmissions={dashboardData.recentSubmissions}
      businessIds={dashboardData.businessIds}
    />
  )
}