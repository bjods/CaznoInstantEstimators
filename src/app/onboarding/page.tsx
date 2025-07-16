'use client'

import Link from 'next/link'

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-8">
        {/* Back Button */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </Link>

        {/* Cazno Logo */}
        <span className="text-xl font-bold">Cazno</span>

        {/* Empty div for spacing */}
        <div className="w-16"></div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-8" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {/* Blank Form Container */}
        <div className="w-full max-w-2xl">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 shadow-2xl">
            {/* Form content will go here */}
          </div>
        </div>
      </main>
    </div>
  )
}