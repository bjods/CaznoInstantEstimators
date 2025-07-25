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
    <div className="overflow-x-hidden">
      {/* Glass Navigation - Only shows after hero */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        showNav ? 'top-0 opacity-100' : '-top-20 opacity-0'
      }`}>
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <span className="text-xl font-bold text-black">Cazno</span>
              <div className="hidden md:flex items-center space-x-4">
                <a href="#demo" className="text-gray-700 hover:text-black transition-colors">DEMO</a>
                <a href="#stats" className="text-gray-700 hover:text-black transition-colors">STATS</a>
                <a href="#about" className="text-gray-700 hover:text-black transition-colors">ABOUT</a>
                <a href="#testimonials" className="text-gray-700 hover:text-black transition-colors">REVIEWS</a>
                <Link href="/login" className="text-gray-700 hover:text-black transition-colors">
                  SIGN IN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
        {/* Dotted Pattern Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 left-0 w-full h-2/3">
            <svg className="w-full h-full" viewBox="0 0 1920 800" fill="none">
              {Array.from({ length: 50 }).map((_, i) => (
                <g key={i}>
                  {Array.from({ length: 100 }).map((_, j) => (
                    <circle
                      key={j}
                      cx={j * 20 + (i % 2) * 10}
                      cy={i * 16}
                      r="1.5"
                      fill="white"
                      opacity={Math.random() * 0.8 + 0.2}
                    />
                  ))}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Logo and Auth buttons at top - FORCE DEPLOY */}
        <div className="absolute top-8 left-8">
          <span className="text-xl font-bold">Cazno</span>
        </div>
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50">
          <Link href="/login" className="bg-white text-black border-2 border-black px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors text-sm sm:text-base">
            SIGN IN
          </Link>
        </div>

        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            We handle instant estimates
            <br />
            so you can stay
            <br />
            focused on growth.
          </h1>
          
          <div className="flex justify-center items-center">
            <Link href="/onboarding" className="inline-block bg-lime-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-lime-300 transition-colors transform hover:scale-105">
              GET STARTED
            </Link>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-16">
            Award-winning estimate calculators.
          </h2>
          
          {/* Large Calculator Card */}
          <div className="max-w-4xl mx-auto mb-16">
            <div 
              className={`w-full h-96 rounded-2xl shadow-xl transition-all duration-500 ${
                activeCalculator === 'fencing' 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                  : activeCalculator === 'concrete'
                  ? 'bg-gradient-to-br from-green-500 to-teal-600'
                  : activeCalculator === 'landscaping'
                  ? 'bg-gradient-to-br from-orange-500 to-red-600'
                  : 'bg-gradient-to-br from-gray-400 to-gray-600'
              }`}
            >
              {/* Blank card - will add calculator content later */}
            </div>
          </div>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
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
      <section id="stats" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-black mb-4">73%</div>
              <div className="text-gray-600">Faster Sales</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-4">2.5x</div>
              <div className="text-gray-600">More Conversions</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-4">312%</div>
              <div className="text-gray-600">Average ROI</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-4">24/7</div>
              <div className="text-gray-600">Lead Capture</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-8">
            Built for home service professionals.
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Transform your business with instant quote calculators that work around the clock. 
            No more missed opportunities, no more delayed responses. Just instant estimates 
            that convert visitors into customers while you focus on what you do best.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 bg-black text-white">
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
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-8">
            Ready to start converting?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join hundreds of contractors already using Cazno to grow their business.
          </p>
          <Link href="/onboarding" className="inline-block bg-lime-400 text-black px-12 py-4 rounded-full font-bold text-xl hover:bg-lime-300 transition-colors transform hover:scale-105">
            GET STARTED
          </Link>
        </div>
      </section>
    </div>
  )
}