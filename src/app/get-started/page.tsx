'use client'

import WidgetLoader from '@/components/widget/WidgetLoader'

export default function GetStarted() {

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-black text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                  Calculate Your ROI
                  <br />
                  <span className="text-blue-400">in 60 seconds</span>
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed mb-8">
                  See how much revenue you could be generating with instant estimates. 
                  Most contractors see 2-3x more leads and save 10+ hours per week.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">2-3x</div>
                  <div className="text-gray-400 text-sm">More Leads</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">87%</div>
                  <div className="text-gray-400 text-sm">Time Saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">48hrs</div>
                  <div className="text-gray-400 text-sm">To Go Live</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Instant quotes 24/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-300">No more back-and-forth emails</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Close more deals faster</span>
                </div>
              </div>
            </div>

            {/* Right Side - Widget */}
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">ROI Calculator</h3>
                <p className="text-gray-400">Enter your business details to see your potential</p>
              </div>
              
              {/* Widget Container */}
              <div className="min-h-[400px]">
                <WidgetLoader embedKey="roi-calculator-demo" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-8">
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
      </section>
    </div>
  )
}