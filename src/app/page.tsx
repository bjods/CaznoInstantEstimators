'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [showNav, setShowNav] = useState(false)
  const [activeCalculator, setActiveCalculator] = useState('fencing')

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
    <div className="min-h-screen bg-black">
      {/* Fixed Navigation Bar - Only shows when scrolled past hero */}
      {showNav && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white">CAZNO</Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">Case Studies</Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">About</Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">Solutions</Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">Resources</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">Sign In</Link>
              <Link href="#" className="bg-blue-900/50 backdrop-blur-sm text-white px-6 py-2 rounded-full font-medium hover:bg-blue-900/70 transition-colors">
                Get Started →
              </Link>
            </div>
          </div>
        </nav>
      )}

      <section className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">

        {/* Hero Navigation - only CAZNO left and Sign In right */}
        <div className="absolute top-0 left-0 right-0 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white">CAZNO</Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            Custom inbound systems
            <br />
            for service based
            <br />
            companies.
          </h1>
          
          <Link href="/onboarding" className="inline-block bg-blue-900/50 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-900/70 transition-colors transform hover:scale-105">
            GET STARTED
          </Link>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-16">
            Award-winning estimate calculators.
          </h2>
          
          {/* Large Calculator Card */}
          <div className="max-w-4xl mx-auto mb-16">
            <div 
              className={`w-full h-96 rounded-2xl shadow-xl transition-all duration-500 bg-gray-900 border border-gray-800`}
            >
              {/* Blank card - will add calculator content later */}
            </div>
          </div>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            We shape estimating that feels like you. Honest, sharp, and built to stick in 
            people&apos;s minds long after they&apos;ve scrolled past or walked away.
          </p>

          {/* Calculator Type Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setActiveCalculator('fencing')}
              className={`px-6 py-3 rounded-full transition-colors ${
                activeCalculator === 'fencing' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              FENCING
            </button>
            <button 
              onClick={() => setActiveCalculator('concrete')}
              className={`px-6 py-3 rounded-full transition-colors ${
                activeCalculator === 'concrete' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              CONCRETE
            </button>
            <button 
              onClick={() => setActiveCalculator('landscaping')}
              className={`px-6 py-3 rounded-full transition-colors ${
                activeCalculator === 'landscaping' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              LANDSCAPING
            </button>
            <button 
              onClick={() => setActiveCalculator('roofing')}
              className={`px-6 py-3 rounded-full transition-colors ${
                activeCalculator === 'roofing' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ROOFING
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-4">73%</div>
              <div className="text-gray-400">Faster Sales</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-4">2.5x</div>
              <div className="text-gray-400">More Conversions</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-4">312%</div>
              <div className="text-gray-400">Average ROI</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-4">24/7</div>
              <div className="text-gray-400">Lead Capture</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Built for home service professionals.
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed">
            Transform your business with instant quote calculators that work around the clock. 
            No more missed opportunities, no more delayed responses. Just instant estimates 
            that convert visitors into customers while you focus on what you do best.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-16">
            "Cazno totally got what we
            <br />
            were going for — we're obsessed
            <br />
            with our new estimators."
          </h2>
          
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-sm uppercase tracking-wider">
              WE'RE HELPING CONTRACTORS GROW AT THEIR BEST.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Ready to start converting?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join hundreds of contractors already using Cazno to grow their business.
          </p>
          <Link href="/onboarding" className="inline-block bg-blue-900/50 backdrop-blur-sm text-white px-12 py-4 rounded-full font-bold text-xl hover:bg-blue-900/70 transition-colors transform hover:scale-105">
            GET STARTED
          </Link>
        </div>
      </section>
    </div>
  )
}