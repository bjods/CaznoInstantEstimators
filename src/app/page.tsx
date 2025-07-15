'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const demoOptions = {
    fencing: {
      title: 'Fence Installation',
      color: 'from-emerald-500 to-green-600',
      fields: ['Linear Feet', 'Fence Height', 'Material Type', 'Number of Gates']
    },
    concrete: {
      title: 'Concrete Work',
      color: 'from-blue-500 to-cyan-600',
      fields: ['Square Feet', 'Thickness', 'Finish Type', 'Reinforcement']
    },
    landscaping: {
      title: 'Landscaping',
      color: 'from-purple-500 to-pink-600',
      fields: ['Square Feet', 'Service Type', 'Material', 'Design Complexity']
    },
    roofing: {
      title: 'Roofing',
      color: 'from-orange-500 to-red-600',
      fields: ['Square Feet', 'Pitch', 'Material', 'Tear-off Required']
    }
  }

export default function Home() {
  const [showNav, setShowNav] = useState(false)
  const [currentDemo, setCurrentDemo] = useState<keyof typeof demoOptions>('fencing')

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
        <div className="bg-black/80 backdrop-blur-md border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <span className="text-xl font-medium tracking-tight">Cazno</span>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="#demo" className="text-gray-300 hover:text-white transition">Demo</Link>
                <Link href="#features" className="text-gray-300 hover:text-white transition">Features</Link>
                <Link href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</Link>
                <Link href="/dashboard" className="bg-green-500 text-black px-5 py-2 rounded-full font-medium hover:bg-green-400 transition">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full screen */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
        {/* Centered Cazno Logo */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-medium tracking-tight">Cazno</h1>
        </div>

        {/* Main Content */}
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-medium leading-tight mb-8">
            Instant estimates that
            <br />
            close deals while you sleep.
          </h2>
          <Link href="/dashboard" className="inline-block bg-green-500 text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-green-400 transition transform hover:scale-105">
            START BUILDING
          </Link>
        </div>

        {/* Dot pattern decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black"></div>
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="dots" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.5" fill="white" />
            </pattern>
            <rect width="100" height="100" fill="url(#dots)" />
          </svg>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-medium mb-4">
              Live Demo
            </h3>
            <p className="text-xl text-gray-400">
              See how your customers will experience instant quotes.
            </p>
          </div>

          {/* Demo Widget */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-black rounded-2xl border border-gray-800 overflow-hidden">
              {/* Widget Header */}
              <div className={`bg-gradient-to-r ${demoOptions[currentDemo].color} p-6`}>
                <h4 className="text-2xl font-medium text-white">{demoOptions[currentDemo].title} Calculator</h4>
                <p className="text-white/80 mt-2">Get an instant quote for your project</p>
              </div>

              {/* Widget Form */}
              <div className="p-8 space-y-6">
                {demoOptions[currentDemo].fields.map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{field}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                      placeholder={`Enter ${field.toLowerCase()}`}
                    />
                  </div>
                ))}
                
                <div className="pt-4">
                  <button className="w-full bg-green-500 text-black py-4 rounded-lg font-medium hover:bg-green-400 transition">
                    Get Instant Quote
                  </button>
                </div>
              </div>
            </div>

            {/* Industry Switcher */}
            <div className="flex justify-center mt-8 space-x-2">
              {Object.keys(demoOptions).map((option) => (
                <button
                  key={option}
                  onClick={() => setCurrentDemo(option as keyof typeof demoOptions)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    currentDemo === option
                      ? 'bg-white text-black'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-medium mb-4">
              Built for conversion
            </h3>
            <p className="text-xl text-gray-400">
              Every feature designed to turn visitors into customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group">
              <div className="bg-gray-900 rounded-2xl p-8 h-full border border-gray-800 hover:border-gray-700 transition">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-medium mb-3">Instant Quotes</h4>
                <p className="text-gray-400">Generate accurate estimates in seconds. No waiting, no phone calls, just results.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="bg-gray-900 rounded-2xl p-8 h-full border border-gray-800 hover:border-gray-700 transition">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-medium mb-3">Smart Analytics</h4>
                <p className="text-gray-400">Track conversions, optimize pricing, and understand your customers better.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="bg-gray-900 rounded-2xl p-8 h-full border border-gray-800 hover:border-gray-700 transition">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-medium mb-3">24/7 Availability</h4>
                <p className="text-gray-400">Capture leads around the clock. Your business never sleeps.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-medium text-green-500 mb-2">73%</div>
              <div className="text-gray-400">Faster Sales</div>
            </div>
            <div>
              <div className="text-5xl font-medium text-green-500 mb-2">2.5x</div>
              <div className="text-gray-400">More Conversions</div>
            </div>
            <div>
              <div className="text-5xl font-medium text-green-500 mb-2">312%</div>
              <div className="text-gray-400">Average ROI</div>
            </div>
            <div>
              <div className="text-5xl font-medium text-green-500 mb-2">24/7</div>
              <div className="text-gray-400">Lead Capture</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-medium mb-6">
            Ready to automate your sales?
          </h3>
          <p className="text-xl text-gray-400 mb-8">
            Join 500+ businesses already using Cazno to grow faster.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard" className="bg-green-500 text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-green-400 transition">
              Start Free Trial
            </Link>
            <Link href="#demo" className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition border border-gray-800">
              See Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-medium mb-4">Cazno</h4>
              <p className="text-gray-400 text-sm">
                Instant estimates that convert.
              </p>
            </div>
            <div>
              <h5 className="font-medium mb-4">Product</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#demo" className="hover:text-white transition">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition">About</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-900 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Cazno. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}