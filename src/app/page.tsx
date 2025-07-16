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
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <span className="text-2xl font-medium tracking-tight">Cazno</span>
              <div className="hidden md:flex items-center space-x-12">
                <Link href="#demo" className="text-gray-300 hover:text-white transition text-lg">Demo</Link>
                <Link href="#features" className="text-gray-300 hover:text-white transition text-lg">Features</Link>
                <Link href="#pricing" className="text-gray-300 hover:text-white transition text-lg">Pricing</Link>
                <Link href="/dashboard" className="bg-green-500 text-black px-8 py-4 rounded-full font-medium hover:bg-green-400 transition text-lg">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full screen with perfect centering */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        {/* Centered Cazno Logo at top */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
          <h1 className="text-3xl font-medium tracking-tight">Cazno</h1>
        </div>

        {/* Main Content - Perfectly centered */}
        <div className="text-center max-w-6xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-medium leading-tight mb-12">
            Instant estimates that
            <br className="hidden md:block" />
            close deals while you sleep.
          </h2>
          
          <div className="mt-16">
            <Link href="/dashboard" className="inline-block bg-green-500 text-black px-12 py-6 rounded-full font-medium text-xl hover:bg-green-400 transition transform hover:scale-105">
              START BUILDING
            </Link>
          </div>
        </div>
      </section>

      {/* MASSIVE SPACER */}
      <div className="h-32 md:h-48"></div>

      {/* Demo Section - White background with perfect centering */}
      <section id="demo" className="min-h-screen py-20 px-6 bg-white text-black flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Section Header - Centered with proper spacing */}
          <div className="text-center mb-20">
            <h3 className="text-6xl md:text-7xl font-medium mb-8 leading-tight">
              Live Demo
            </h3>
            <div className="mt-8">
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                See how your customers will experience instant quotes.
              </p>
            </div>
          </div>

          {/* Demo Cards Grid - Centered with proper gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            
            {/* Card 1 */}
            <div className="bg-gray-50 rounded-3xl p-12 h-[500px] shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 bg-green-100 rounded-3xl mb-8"></div>
                <h4 className="text-3xl font-medium mb-6">Fencing</h4>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Instant quotes for residential and commercial fencing projects
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 rounded-3xl p-12 h-[500px] shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 bg-blue-100 rounded-3xl mb-8"></div>
                <h4 className="text-3xl font-medium mb-6">Concrete</h4>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Calculate driveways, patios, and foundation costs instantly
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 rounded-3xl p-12 h-[500px] shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 bg-purple-100 rounded-3xl mb-8"></div>
                <h4 className="text-3xl font-medium mb-6">Landscaping</h4>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Design and installation pricing calculated in seconds
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button - Centered */}
          <div className="text-center">
            <Link href="/dashboard" className="inline-block bg-black text-white px-12 py-6 rounded-full font-medium text-xl hover:bg-gray-900 transition transform hover:scale-105">
              Try Demo Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* MASSIVE SPACER */}
      <div className="h-32 md:h-48 bg-white"></div>

      {/* Features Section - Black background with perfect centering */}
      <section id="features" className="min-h-screen py-20 px-6 bg-black flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Section Header - Centered */}
          <div className="text-center mb-20">
            <h3 className="text-6xl md:text-7xl font-medium mb-8 leading-tight">
              Built for conversion
            </h3>
            <div className="mt-8">
              <p className="text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                Every feature designed to turn visitors into customers.
              </p>
            </div>
          </div>

          {/* Features Grid - Centered with proper spacing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
            
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-32 h-32 bg-green-500/10 rounded-3xl flex items-center justify-center mb-8 mx-auto">
                <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-3xl font-medium mb-6">Instant Quotes</h4>
              <p className="text-xl text-gray-400 leading-relaxed">
                Generate accurate estimates in seconds. No waiting, no phone calls, just results.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-32 h-32 bg-green-500/10 rounded-3xl flex items-center justify-center mb-8 mx-auto">
                <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-3xl font-medium mb-6">Smart Analytics</h4>
              <p className="text-xl text-gray-400 leading-relaxed">
                Track conversions, optimize pricing, and understand your customers better.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-32 h-32 bg-green-500/10 rounded-3xl flex items-center justify-center mb-8 mx-auto">
                <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-3xl font-medium mb-6">24/7 Availability</h4>
              <p className="text-xl text-gray-400 leading-relaxed">
                Capture leads around the clock. Your business never sleeps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MASSIVE SPACER */}
      <div className="h-32 md:h-48"></div>

      {/* Stats Section - White background, vertically centered */}
      <section className="min-h-screen py-20 px-6 bg-white text-black flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 text-center">
            
            <div className="flex flex-col items-center">
              <div className="text-7xl md:text-8xl font-bold text-green-500 mb-6">73%</div>
              <div className="text-2xl text-gray-600">Faster Sales</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-7xl md:text-8xl font-bold text-green-500 mb-6">2.5x</div>
              <div className="text-2xl text-gray-600">More Conversions</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-7xl md:text-8xl font-bold text-green-500 mb-6">312%</div>
              <div className="text-2xl text-gray-600">Average ROI</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-7xl md:text-8xl font-bold text-green-500 mb-6">24/7</div>
              <div className="text-2xl text-gray-600">Lead Capture</div>
            </div>
          </div>
        </div>
      </section>

      {/* MASSIVE SPACER */}
      <div className="h-32 md:h-48 bg-white"></div>

      {/* CTA Section - Black background, vertically centered */}
      <section className="min-h-screen py-20 px-6 bg-black flex items-center justify-center">
        <div className="max-w-5xl mx-auto text-center w-full">
          <h3 className="text-6xl md:text-7xl font-medium mb-12 leading-tight">
            Ready to automate
            <br />
            your sales?
          </h3>
          
          <div className="mt-12 mb-16">
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Join 500+ businesses already using Cazno to grow faster.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-8 mt-16">
            <Link href="/dashboard" className="bg-green-500 text-black px-12 py-6 rounded-full font-medium text-xl hover:bg-green-400 transition transform hover:scale-105">
              Start Free Trial
            </Link>
            <Link href="#demo" className="bg-transparent text-white px-12 py-6 rounded-full font-medium text-xl hover:bg-white/10 transition border-2 border-white/20">
              See Demo
            </Link>
          </div>
        </div>
      </section>

      {/* MASSIVE SPACER */}
      <div className="h-32 md:h-48"></div>

      {/* Footer - White background with proper spacing */}
      <footer className="py-20 px-6 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="text-center md:text-left">
              <h4 className="text-3xl font-medium mb-8">Cazno</h4>
              <p className="text-lg text-gray-600 leading-relaxed">
                Instant estimates that convert.
              </p>
            </div>
            
            <div className="text-center md:text-left">
              <h5 className="font-medium mb-8 text-xl">Product</h5>
              <ul className="space-y-4 text-lg text-gray-600">
                <li><Link href="#features" className="hover:text-black transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-black transition">Pricing</Link></li>
                <li><Link href="#demo" className="hover:text-black transition">Demo</Link></li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h5 className="font-medium mb-8 text-xl">Company</h5>
              <ul className="space-y-4 text-lg text-gray-600">
                <li><Link href="#" className="hover:text-black transition">About</Link></li>
                <li><Link href="#" className="hover:text-black transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-black transition">Contact</Link></li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h5 className="font-medium mb-8 text-xl">Legal</h5>
              <ul className="space-y-4 text-lg text-gray-600">
                <li><Link href="#" className="hover:text-black transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-black transition">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-12 text-center">
            <p className="text-lg text-gray-600">&copy; 2024 Cazno. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}