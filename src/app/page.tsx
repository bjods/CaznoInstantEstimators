'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [showNav, setShowNav] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight
      const scrolled = window.scrollY > heroHeight - 100
      setShowNav(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Sticky Navigation - Hidden initially */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        showNav ? 'top-0 opacity-100' : '-top-20 opacity-0'
      }`}>
        <div className="bg-gray-800/70 backdrop-blur-md border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <span className="text-xl font-semibold tracking-tight">Cazno</span>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="#demo" className="text-gray-300 hover:text-white transition-colors duration-200">Demo</Link>
                <Link href="#features" className="text-gray-300 hover:text-white transition-colors duration-200">Features</Link>
                <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-200">Pricing</Link>
                <Link href="/dashboard" className="bg-green-500 text-black px-6 py-2.5 rounded-full font-medium hover:bg-green-400 transition-all duration-200">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full screen with perfect centering */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Centered Cazno Logo at top */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-semibold tracking-tight">Cazno</h1>
        </div>

        {/* Main Content - Perfectly centered */}
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Instant estimates that
            <br />
            close deals while you sleep.
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your home service business with instant quote calculators that convert visitors into customers 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard" className="bg-green-500 text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-400 transition-all duration-200 transform hover:scale-105">
              START BUILDING
            </Link>
            <Link href="#demo" className="text-white border border-white/30 px-8 py-4 rounded-full font-medium text-lg hover:bg-white/10 transition-all duration-200">
              See Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Section - White background with perfect centering */}
      <section id="demo" className="py-24 px-4 sm:px-6 lg:px-8 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header - Centered with proper spacing */}
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Live Demo
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See how your customers will experience instant quotes.
            </p>
          </div>

          {/* Demo Cards Grid - Centered with proper gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            
            {/* Card 1 */}
            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-2xl font-semibold mb-4">Fencing</h4>
                <p className="text-gray-600 leading-relaxed">
                  Instant quotes for residential and commercial fencing projects
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l7-3 7 3z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-semibold mb-4">Concrete</h4>
                <p className="text-gray-600 leading-relaxed">
                  Calculate driveways, patios, and foundation costs instantly
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h4 className="text-2xl font-semibold mb-4">Landscaping</h4>
                <p className="text-gray-600 leading-relaxed">
                  Design and installation pricing calculated in seconds
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button - Centered */}
          <div className="text-center">
            <Link href="/dashboard" className="inline-block bg-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-900 transition-all duration-200 transform hover:scale-105">
              Try Demo Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Black background with perfect centering */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header - Centered */}
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Built for conversion
            </h3>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Every feature designed to turn visitors into customers.
            </p>
          </div>

          {/* Features Grid - Centered with proper spacing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-2xl font-semibold mb-4">Instant Quotes</h4>
              <p className="text-gray-400 leading-relaxed">
                Generate accurate estimates in seconds. No waiting, no phone calls, just results.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-2xl font-semibold mb-4">Smart Analytics</h4>
              <p className="text-gray-400 leading-relaxed">
                Track conversions, optimize pricing, and understand your customers better.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-semibold mb-4">24/7 Availability</h4>
              <p className="text-gray-400 leading-relaxed">
                Capture leads around the clock. Your business never sleeps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - White background, vertically centered */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-500 mb-4">73%</div>
              <div className="text-lg text-gray-600">Faster Sales</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-500 mb-4">2.5x</div>
              <div className="text-lg text-gray-600">More Conversions</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-500 mb-4">312%</div>
              <div className="text-lg text-gray-600">Average ROI</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-500 mb-4">24/7</div>
              <div className="text-lg text-gray-600">Lead Capture</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Black background, vertically centered */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Ready to automate
            <br />
            your sales?
          </h3>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12">
            Join 500+ businesses already using Cazno to grow faster.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard" className="bg-green-500 text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-400 transition-all duration-200 transform hover:scale-105">
              Start Free Trial
            </Link>
            <Link href="#demo" className="bg-transparent text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white/10 transition-all duration-200 border-2 border-white/20">
              See Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - White background with proper spacing */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-2xl font-semibold mb-4">Cazno</h4>
              <p className="text-gray-600 leading-relaxed">
                Instant estimates that convert.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="#features" className="hover:text-black transition-colors duration-200">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-black transition-colors duration-200">Pricing</Link></li>
                <li><Link href="#demo" className="hover:text-black transition-colors duration-200">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="#" className="hover:text-black transition-colors duration-200">About</Link></li>
                <li><Link href="#" className="hover:text-black transition-colors duration-200">Blog</Link></li>
                <li><Link href="#" className="hover:text-black transition-colors duration-200">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="#" className="hover:text-black transition-colors duration-200">Privacy</Link></li>
                <li><Link href="#" className="hover:text-black transition-colors duration-200">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-600">&copy; 2024 Cazno. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}