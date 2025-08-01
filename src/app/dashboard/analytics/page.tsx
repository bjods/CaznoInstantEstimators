import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AnalyticsContent from '@/components/dashboard/AnalyticsContent'

async function getAnalyticsData(businessId: string) {
  const supabase = createClient()
  
  // Get widgets for the business
  const { data: widgets } = await supabase
    .from('widgets')
    .select('*')
    .eq('business_id', businessId)
  
  // Get all submissions with widget information
  const { data: submissions } = await supabase
    .from('submissions')
    .select(`
      *,
      widgets(name, embed_key, config)
    `)
    .eq('business_id', businessId)
    .order('created_at', { ascending: true })
  
  return {
    widgets: widgets || [],
    submissions: submissions || [],
    businessId
  }
}

export default async function AnalyticsPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get user's business (single business per user)
  const { data: userProfiles } = await supabase
    .from('user_profiles')
    .select('business_id')
    .eq('user_id', user.id)
    .single()

  if (!userProfiles?.business_id) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No Business Access</h1>
        <p className="text-gray-600">You don't have access to any business dashboard.</p>
      </div>
    )
  }

  const analyticsData = await getAnalyticsData(userProfiles.business_id)

  return (
    <AnalyticsContent 
      widgets={analyticsData.widgets}
      submissions={analyticsData.submissions}
      businessId={analyticsData.businessId}
    />
  )
}