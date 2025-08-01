'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import SubmissionDetailsModal from '@/components/dashboard/SubmissionDetailsModal'

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      console.log('[SUBMISSIONS] Starting to fetch submissions')
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.log('[SUBMISSIONS] No user found, redirecting to login')
        router.push('/login')
        return
      }

      // Get user's business (single business per user)
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('business_id')
        .eq('user_id', user.id)
        .single()

      if (profileError) {
        throw new Error(`Failed to fetch user profile: ${profileError.message}`)
      }

      if (!userProfile?.business_id) {
        console.log('[SUBMISSIONS] No business ID found')
        setSubmissions([])
        setLoading(false)
        return
      }

      console.log('[SUBMISSIONS] Business ID:', userProfile.business_id)

      // Get all submissions with widget information
      const { data: submissions, error: submissionsError } = await supabase
        .from('submissions')
        .select(`
          *,
          widgets(name, embed_key)
        `)
        .eq('business_id', userProfile.business_id)
        .order('created_at', { ascending: false })

      if (submissionsError) {
        throw new Error(`Failed to fetch submissions: ${submissionsError.message}`)
      }

      console.log('[SUBMISSIONS] Fetched submissions:', submissions?.length || 0)
      setSubmissions(submissions || [])
    } catch (err) {
      console.error('[SUBMISSIONS] Error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (submission: any) => {
    setSelectedSubmission(submission)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Lead Submissions</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading submissions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Lead Submissions</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={fetchSubmissions}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

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
            {submissions.filter(s => s?.completion_status === 'complete').length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {submissions.filter(s => s?.completion_status === 'in_progress').length}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">
            {submissions.filter(s => s?.completion_status === 'abandoned').length}
          </div>
          <div className="text-sm text-gray-600">Abandoned</div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Submissions</h2>
          <p className="text-sm text-gray-500 mt-1">Click on any row to view details</p>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => {
                  const contactName = submission?.full_name || 'No name'
                  const contactEmail = submission?.email || submission?.phone || 'No contact'
                  const widgetName = submission?.widgets?.name || 'Unknown Widget'
                  const status = submission?.completion_status || 'unknown'
                  const createdAt = submission?.created_at ? new Date(submission.created_at) : null
                  const estimatePrice = submission?.estimated_price
                  
                  return (
                    <tr 
                      key={submission?.id || Math.random()} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(submission)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center">
                            <span className="text-black font-bold text-sm">
                              {contactName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {contactName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contactEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {widgetName}
                          </span>
                        </div>
                        {submission?.widgets?.embed_key && (
                          <div className="text-xs text-gray-500 mt-1">
                            {submission.widgets.embed_key}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          status === 'complete' 
                            ? 'bg-green-100 text-green-800'
                            : status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {createdAt ? createdAt.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Unknown date'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {estimatePrice 
                          ? `$${Number(estimatePrice).toLocaleString()}`
                          : 'N/A'
                        }
                      </td>
                    </tr>
                  )
                })}
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

      {/* Submission Details Modal */}
      <SubmissionDetailsModal 
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedSubmission(null)
        }}
        submission={selectedSubmission}
      />
    </div>
  )
}