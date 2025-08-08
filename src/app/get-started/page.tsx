'use client'

import Link from 'next/link'
import Script from 'next/script'

export default function GetStarted() {
  return (
    <>
      <Script id="cazno-resize" strategy="afterInteractive">
        {`
          window.addEventListener('message', function(e) {
            if (e.data.type === 'cazno-resize') {
              document.getElementById('cazno-widget').height = e.data.height + 'px';
            }
          });
        `}
      </Script>
      <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </Link>
            <Link href="/" className="text-xl font-bold text-white">CAZNO</Link>
          </div>
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
            Get Your Custom
            <br />
            <span className="text-blue-400">Quote Calculator</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            Book a 30-minute demo and see exactly how Cazno can transform your lead generation. 
            We'll build your first calculator live during the call.
          </p>
          
          {/* Benefits */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">30min</div>
              <div className="text-gray-400 text-sm">Demo Call</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">Live</div>
              <div className="text-gray-400 text-sm">Calculator Build</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">48hrs</div>
              <div className="text-gray-400 text-sm">To Go Live</div>
            </div>
          </div>
        </div>

        {/* Widget Form - Full Width */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <iframe 
            id="cazno-widget"
            src="/embed/roi-calculator-demo"
            width="100%"
            height="800"
            style={{ border: 'none' }}
          />
        </div>

        {/* What to Expect Section */}
        <div className="border-t border-gray-800 bg-gray-900 py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              What to expect in your demo
            </h2>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
              We'll show you exactly how Cazno works and build your first calculator together
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Understand Your Business</h3>
                <p className="text-gray-400">We'll learn about your services, pricing model, and current lead generation process</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-400">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Live Calculator Build</h3>
                <p className="text-gray-400">Watch as we create a custom calculator for your specific service and pricing structure</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-400">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">ROI Calculation</h3>
                <p className="text-gray-400">Calculate your potential return on investment and discuss implementation timeline</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}