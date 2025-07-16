'use client'

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
    <div className="overflow-x-hidden">
      {/* Glass Navigation - Only shows after hero */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        showNav ? 'top-0 opacity-100' : '-top-20 opacity-0'
      }`}>
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <span className="text-xl font-bold text-black">Cazno</span>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#demo" className="text-gray-700 hover:text-black transition-colors">DEMO</a>
                <a href="#stats" className="text-gray-700 hover:text-black transition-colors">STATS</a>
                <a href="#about" className="text-gray-700 hover:text-black transition-colors">ABOUT</a>
                <a href="#testimonials" className="text-gray-700 hover:text-black transition-colors">REVIEWS</a>
                <button className="bg-lime-400 text-black px-6 py-2 rounded-full font-medium hover:bg-lime-300 transition-colors">
                  GET STARTED
                </button>
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

        {/* Logo at top */}
        <div className="absolute top-8 left-8">
          <span className="text-xl font-bold">Cazno</span>
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
          
          <button className="bg-lime-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-lime-300 transition-colors transform hover:scale-105">
            START BUILDING
          </button>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-16">
            Award-winning estimate calculators.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-transform">
              <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-6 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">FENCING</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Fencing Calculator</h3>
              <p className="text-gray-600">Instant quotes for residential and commercial fencing projects</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-transform">
              <div className="w-full h-64 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl mb-6 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">CONCRETE</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Concrete Calculator</h3>
              <p className="text-gray-600">Calculate driveways, patios, and foundation costs instantly</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-transform">
              <div className="w-full h-64 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl mb-6 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">LANDSCAPE</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Landscaping Calculator</h3>
              <p className="text-gray-600">Design and installation pricing calculated in seconds</p>
            </div>
          </div>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            We shape estimating that feels like you. Honest, sharp, and built to stick in 
            people's minds long after they've scrolled past or walked away.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full">FENCING</span>
            <span className="bg-black text-white px-6 py-3 rounded-full">CONCRETE</span>
            <span className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full">LANDSCAPING</span>
            <span className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full">ROOFING</span>
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
          <button className="bg-lime-400 text-black px-12 py-4 rounded-full font-bold text-xl hover:bg-lime-300 transition-colors transform hover:scale-105">
            GET STARTED
          </button>
        </div>
      </section>
    </div>
  )
}