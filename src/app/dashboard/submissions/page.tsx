import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

// Force dynamic rendering since we use authentication
export const dynamic = 'force-dynamic'

async function getSubmissions(businessIds: string[]) {
  console.log('[SUBMISSIONS] getSubmissions called with businessIds:', businessIds)
  const supabase = createClient()
  
  // Return empty array if no business IDs
  if (!businessIds || businessIds.length === 0) {
    console.log('[SUBMISSIONS] No business IDs provided, returning empty array')
    return []
  }
  
  try {
    console.log('[SUBMISSIONS] Making Supabase query for business IDs:', businessIds)
    
    // Get all submissions with widget information for all user's businesses
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select(`
        *,
        widgets(name, embed_key)
      `)
      .in('business_id', businessIds)
      .order('created_at', { ascending: false })
    
    console.log('[SUBMISSIONS] Supabase query completed. Error:', error, 'Data count:', submissions?.length || 0)
    
    if (error) {
      console.error('[SUBMISSIONS] Error fetching submissions:', error)
      throw new Error(`Submissions query failed: ${error.message}`)
    }
    
    console.log('[SUBMISSIONS] Successfully fetched submissions:', submissions?.length || 0)
    return submissions || []
  } catch (err) {
    console.error('[SUBMISSIONS] Exception in getSubmissions:', err)
    throw err
  }
}

export default async function SubmissionsPage() {
  console.log('[SUBMISSIONS] SubmissionsPage component started')
  
  try {
    const supabase = createClient()
    console.log('[SUBMISSIONS] Supabase client created')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('[SUBMISSIONS] Auth check completed. User ID:', user?.id, 'Auth Error:', authError)
    
    if (!user) {
      console.log('[SUBMISSIONS] No user found, redirecting to login')
      redirect('/login')
    }

    // Get user's businesses
    console.log('[SUBMISSIONS] Fetching user profiles for user ID:', user.id)
    const { data: userProfiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('business_id')
      .eq('user_id', user.id)

    console.log('[SUBMISSIONS] User profiles query completed. Profiles:', userProfiles, 'Error:', profileError)

    if (profileError) {
      console.error('[SUBMISSIONS] Error fetching user profiles:', profileError)
      throw new Error(`User profiles query failed: ${profileError.message}`)
    }

    const businessIds = userProfiles?.map(profile => profile.business_id).filter(Boolean) || []
    console.log('[SUBMISSIONS] Processed business IDs:', businessIds)
    
    console.log('[SUBMISSIONS] About to call getSubmissions with business IDs:', businessIds)
    const submissions = await getSubmissions(businessIds)
    console.log('[SUBMISSIONS] getSubmissions completed, submissions count:', submissions?.length || 0)
  
    console.log('[SUBMISSIONS] About to render component with', submissions?.length || 0, 'submissions')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Submissions</h1>
          <p className="text-gray-600">View and track all your customer inquiries</p>
        </div>
        <div className="text-sm text-gray-500">
          {submissions.length} total submissions
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {submissions.length}
          </div>
          <div className="text-sm text-gray-600">Total Submissions</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {submissions.filter(s => s.completion_status === 'complete').length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {submissions.filter(s => s.completion_status === 'in_progress').length}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">
            {submissions.filter(s => s.completion_status === 'abandoned').length}
          </div>
          <div className="text-sm text-gray-600">Abandoned</div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Submissions</h2>
        </div>

        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Widget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estimate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center">
                          <span className="text-black font-bold text-sm">
                            {submission.full_name?.charAt(0) || submission.email?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {submission.full_name || 'No name provided'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.email || submission.phone || 'No contact info'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {submission.widgets?.name || 'Unknown Widget'}
                        </span>
                      </div>
                      {submission.widgets?.embed_key && (
                        <div className="text-xs text-gray-500 mt-1">
                          {submission.widgets.embed_key}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        submission.completion_status === 'complete' 
                          ? 'bg-green-100 text-green-800'
                          : submission.completion_status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {submission.completion_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(submission.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.estimated_price 
                        ? `$${Number(submission.estimated_price).toLocaleString()}`
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => {
                          // Show submission details in a modal or expand row
                          console.log('View details:', submission.id);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <DocumentTextIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
            <p className="text-gray-500 mb-6">
              Customer submissions will appear here once your widgets start receiving form completions.
            </p>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        )}
      </div>

      {/* Back to Dashboard */}
      {submissions.length > 0 && (
        <div className="flex justify-start">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      )}
    </div>
  )
  } catch (error) {
    console.error('[SUBMISSIONS] Fatal error in SubmissionsPage:', error)
    
    // Return error page instead of crashing
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lead Submissions</h1>
            <p className="text-gray-600">Error loading submissions</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Submissions</h3>
          <p className="text-red-600 mb-4">
            There was an error loading your submissions. Please check the console for details and try refreshing the page.
          </p>
          <div className="text-sm text-red-500 bg-red-100 p-3 rounded font-mono">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }
}