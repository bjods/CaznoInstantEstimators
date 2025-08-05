'use client'

import WidgetIframe from '@/components/widget/WidgetIframe'
import Link from 'next/link'

export default function GetStarted() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">CAZNO</Link>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-gray-300 hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Full Page Form */}
      <div className="pt-20 min-h-screen bg-black">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Calculate Your ROI
            <br />
            <span className="text-blue-400">in 60 seconds</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            See how much revenue you could be generating with instant estimates. 
            Most contractors see 2-3x more leads and save 10+ hours per week.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">2-3x</div>
              <div className="text-gray-400 text-sm">More Leads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">87%</div>
              <div className="text-gray-400 text-sm">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">48hrs</div>
              <div className="text-gray-400 text-sm">To Go Live</div>
            </div>
          </div>
        </div>

        {/* Widget Form - Full Width */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <WidgetIframe embedKey="roi-calculator-demo" />
          </div>
        </div>

        {/* Trust Section */}
        <div className="border-t border-gray-800 bg-gray-900 py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-12">
              Join 200+ contractors already using Cazno
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🚧</div>
                <h3 className="text-xl font-semibold text-white mb-2">Fencing Companies</h3>
                <p className="text-gray-400">Generate instant linear foot estimates</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🏗️</div>
                <h3 className="text-xl font-semibold text-white mb-2">Concrete & Hardscaping</h3>
                <p className="text-gray-400">Calculate square footage pricing automatically</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-white mb-2">Landscaping</h3>
                <p className="text-gray-400">Map-based area measurement and quotes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}