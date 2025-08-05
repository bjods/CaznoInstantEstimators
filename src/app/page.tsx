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
              <Link href="/get-started" className="bg-blue-900/50 backdrop-blur-sm text-white px-6 py-2 rounded-full font-medium hover:bg-blue-900/70 transition-colors">
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
        <div className="text-center max-w-5xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Your website visitors are
            <br />
            <span className="text-red-400">leaving without buying.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            73% of contractors lose qualified leads because customers can't get instant pricing. 
            <br />
            While you're writing estimates, your competitors are closing deals.
          </p>

          <p className="text-2xl md:text-3xl font-semibold text-blue-400 mb-12">
            Turn website visitors into paying customers with instant quote calculators that work 24/7.
          </p>

          <div className="flex items-center justify-center gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">200+</div>
              <div className="text-gray-400">Contractors Using Cazno</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">48hrs</div>
              <div className="text-gray-400">To Go Live</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">2-3x</div>
              <div className="text-gray-400">More Leads</div>
            </div>
          </div>
          
          <Link href="/get-started" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-full font-bold text-xl transition-colors transform hover:scale-105 mb-16">
            Get Your Calculator In 48 Hours →
          </Link>

          {/* Overlapping Images */}
          <div className="relative max-w-4xl mx-auto">
            <div className="image-stack-container group cursor-pointer">
              {/* Dashboard Image - Initially on top */}
              <div className="image-stack-item dashboard-image">
                <img 
                  src="/images/dashboard-example.png" 
                  alt="Contractor Dashboard Analytics" 
                  className="w-full rounded-2xl shadow-2xl border border-gray-700"
                />
                <div className="absolute -bottom-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-white font-semibold">Real-time Analytics Dashboard</span>
                </div>
              </div>
              
              {/* Quote Image - Initially behind */}
              <div className="image-stack-item quote-image">
                <img 
                  src="/images/quote-example.png" 
                  alt="Professional Quote Generator" 
                  className="w-full rounded-2xl shadow-2xl border border-gray-700"
                />
                <div className="absolute -bottom-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-white font-semibold">Professional Quote Generation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .image-stack-container {
            position: relative;
            height: 600px;
            perspective: 1000px;
          }

          .image-stack-item {
            position: absolute;
            width: 70%;
            transition: all 0.6s ease-in-out;
          }

          .dashboard-image {
            top: 0;
            left: 0;
            z-index: 2;
            transform: translateY(0) scale(1);
          }

          .quote-image {
            top: 60px;
            right: 0;
            z-index: 1;
            transform: translateY(0) scale(0.95);
            opacity: 0.8;
          }

          /* Hover Animation */
          .group:hover .dashboard-image {
            z-index: 1;
            transform: translateY(60px) scale(0.95);
            opacity: 0.8;
          }

          .group:hover .quote-image {
            z-index: 2;
            transform: translateY(0) scale(1);
            opacity: 1;
          }

          @media (max-width: 768px) {
            .image-stack-container {
              height: 400px;
            }
            
            .image-stack-item {
              width: 85%;
            }
            
            .quote-image {
              top: 40px;
            }
            
            .group:hover .dashboard-image {
              transform: translateY(40px) scale(0.95);
            }
          }
        `}</style>
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