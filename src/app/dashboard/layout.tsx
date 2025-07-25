import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  ChartBarIcon,
  WrenchScrewdriverIcon,
  UsersIcon,
  ChartPieIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile if exists (optional - no setup required)
  const { data: userProfiles } = await supabase
    .from('user_profiles')
    .select('business_id, businesses(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  const userProfile = userProfiles?.[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-black">
                Cazno
              </Link>
              <div className="hidden md:flex ml-10 space-x-1">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-black hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <ChartBarIcon className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/dashboard/widgets"
                  className="flex items-center space-x-2 text-gray-700 hover:text-black hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <WrenchScrewdriverIcon className="w-4 h-4" />
                  <span>Widgets</span>
                </Link>
                <Link
                  href="/dashboard/leads"
                  className="flex items-center space-x-2 text-gray-700 hover:text-black hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <UsersIcon className="w-4 h-4" />
                  <span>Leads</span>
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="flex items-center space-x-2 text-gray-700 hover:text-black hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <ChartPieIcon className="w-4 h-4" />
                  <span>Analytics</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center space-x-2 text-gray-700 hover:text-black hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Business Name */}
              {userProfile?.businesses?.name && (
                <div className="hidden sm:block text-sm text-gray-600">
                  <span className="font-medium">{userProfile.businesses.name}</span>
                </div>
              )}
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              
              {/* Sign Out */}
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm text-gray-700 hover:text-black hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </form>
              
              {/* Back to Website */}
              <Link
                href="/"
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black px-3 py-2 rounded-lg transition-colors"
              >
                ← Website
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 bg-gray-50">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-700 hover:text-black hover:bg-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <ChartBarIcon className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/widgets"
              className="flex items-center space-x-2 text-gray-700 hover:text-black hover:bg-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <WrenchScrewdriverIcon className="w-4 h-4" />
              <span>Widgets</span>
            </Link>
            <Link
              href="/dashboard/leads"
              className="flex items-center space-x-2 text-gray-700 hover:text-black hover:bg-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <UsersIcon className="w-4 h-4" />
              <span>Leads</span>
            </Link>
            <Link
              href="/dashboard/analytics"
              className="flex items-center space-x-2 text-gray-700 hover:text-black hover:bg-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <ChartPieIcon className="w-4 h-4" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center space-x-2 text-gray-700 hover:text-black hover:bg-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Cog6ToothIcon className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2024 Cazno. Built for home service professionals.
            </div>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <Link href="/about" className="text-sm text-gray-500 hover:text-gray-700">About</Link>
              <Link href="/case-studies" className="text-sm text-gray-500 hover:text-gray-700">Case Studies</Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}