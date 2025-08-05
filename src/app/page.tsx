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
        <div className="absolute top-0 left-0 right-0 px-6 py-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white">CAZNO</Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center max-w-5xl mx-auto relative z-10 pt-32">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Turn website visitors into paying customers with instant quote calculators that work 24/7.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Give the website visitors you're already getting what they want (instant pricing), and capture more, high quality leads.
          </p>
          
          <Link href="/get-started" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-full font-bold text-lg transition-colors transform hover:scale-105 mb-12">
            Get Started
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
            height: 500px;
            perspective: 1000px;
          }

          .image-stack-item {
            position: absolute;
            width: 75%;
            transition: all 0.6s ease-in-out;
          }

          .dashboard-image {
            top: 0;
            left: 0;
            z-index: 2;
            transform: translateY(0) scale(1);
          }

          .quote-image {
            top: 40px;
            right: 0;
            z-index: 1;
            transform: translateY(0) scale(0.9);
            opacity: 0.85;
          }

          /* Hover Animation */
          .group:hover .dashboard-image {
            z-index: 1;
            transform: translateY(40px) scale(0.9);
            opacity: 0.85;
          }

          .group:hover .quote-image {
            z-index: 2;
            transform: translateY(0) scale(1);
            opacity: 1;
          }

          @media (max-width: 768px) {
            .image-stack-container {
              height: 350px;
            }
            
            .image-stack-item {
              width: 90%;
            }
            
            .quote-image {
              top: 30px;
            }
            
            .group:hover .dashboard-image {
              transform: translateY(30px) scale(0.9);
            }
          }
        `}</style>
      </section>

      {/* Problem Section - Website visitors leave without engaging */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-gray-900 rounded-2xl p-8 relative border border-gray-800">
                <div className="w-64 h-48 bg-gray-800 rounded-xl mx-auto mb-4 relative overflow-hidden border border-gray-700">
                  {/* Website mockup */}
                  <div className="absolute top-3 left-3 right-3 h-8 bg-gray-700 rounded flex items-center px-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <div className="w-16 h-2 bg-gray-600 rounded"></div>
                  </div>
                  
                  {/* Content area */}
                  <div className="absolute top-14 left-3 right-3 bottom-12 bg-white rounded">
                    <div className="p-3">
                      <div className="w-20 h-3 bg-blue-500 rounded mb-2"></div>
                      <div className="w-full h-2 bg-gray-200 rounded mb-1"></div>
                      <div className="w-3/4 h-2 bg-gray-200 rounded mb-3"></div>
                      <div className="w-16 h-6 bg-blue-100 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Visitors leaving - animated dots moving away */}
                  <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full opacity-50"></div>
                  </div>
                  <div className="absolute -right-10 top-1/3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full opacity-30"></div>
                  </div>
                  <div className="absolute -right-8 bottom-1/3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full opacity-40"></div>
                  </div>
                  
                  {/* Arrow pointing away */}
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Most visitors <span className="bg-red-500 px-2 rounded text-white">leave immediately</span> without contacting you.
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                You're driving traffic to your website, but visitors bounce because they can't 
                quickly understand what their project will cost. Without instant pricing, 
                potential customers move on to competitors who can give them answers immediately.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Every day, qualified leads visit your site looking for your services, but leave 
                empty-handed because the path from interest to contact is unclear. You're missing 
                revenue opportunities while competitors with instant pricing capture those same customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customization & DFY Section */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Every business is different. <br />
              Your quote calculator should be too.
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We build custom quote calculators that match exactly how you run your business. 
              No generic templates – just a smarter way to capture online leads that fits your workflow.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Completely customizable to your business</h3>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Whether you price by linear feet, square footage, hourly rates, or complex material calculations – 
                we configure everything to match your exact pricing model and business processes.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Pricing Models</h4>
                      <p className="text-gray-400 text-sm">Linear feet, square footage, per unit, hourly, or hybrid pricing</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Service Options</h4>
                      <p className="text-gray-400 text-sm">Good/Better/Best tiers, add-ons, material choices</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Geographic Zones</h4>
                      <p className="text-gray-400 text-sm">Different pricing for different service areas</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Lead Qualification</h4>
                      <p className="text-gray-400 text-sm">Budget ranges, project timelines, property type</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Custom Questions</h4>
                      <p className="text-gray-400 text-sm">Gather specific info you need for accurate estimates</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Branding & Style</h4>
                      <p className="text-gray-400 text-sm">Match your website colors, fonts, and brand voice</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-black rounded-2xl p-8 border border-gray-800">
              <h4 className="text-lg font-semibold text-white mb-6">Multiple Flow Options</h4>
              
              {/* Flow Type Tabs */}
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                    <span className="font-medium text-white">Multi-Step Wizard</span>
                  </div>
                  <p className="text-gray-400 text-sm">Break complex projects into simple questions across multiple pages</p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                    <span className="font-medium text-white">Single Page Form</span>
                  </div>
                  <p className="text-gray-400 text-sm">Quick calculators for simple services with instant results</p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                    <span className="font-medium text-white">Interactive Map</span>
                  </div>
                  <p className="text-gray-400 text-sm">Let customers draw areas or mark locations for precise measurements</p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                    <span className="font-medium text-white">Conditional Logic</span>
                  </div>
                  <p className="text-gray-400 text-sm">Dynamic forms that adapt based on previous answers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 rounded-2xl p-8 md:p-12 border border-blue-800/30">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">100% Done-For-You Setup</h3>
              <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto">
                You don't build anything. We handle the entire setup, configuration, and integration. 
                Just tell us how you price your services and we'll create a calculator that works exactly like your business does.
              </p>
              <div className="flex flex-wrap justify-center gap-8 text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Custom pricing logic</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Website integration</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Lead management setup</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Testing & refinement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Give customers a price.
            <br />
            Get a <span className="text-blue-400 underline decoration-blue-400">qualified lead</span>.
          </h2>
          <p className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto">
            Cazno turns your website into an automated lead machine that works 
            for you 24/7. It's a simple, powerful exchange that wins you more business.
          </p>

          {/* 3-Step Process */}
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">They get an instant quote</h3>
              <p className="text-gray-400">
                A customer answers a few simple questions and instantly receives an 
                accurate price range. No phone call needed.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-400">2</span>
              </div>
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">You get a pre-qualified lead</h3>
              <p className="text-gray-400">
                You receive the customer's contact info. The best part? They've already seen the 
                price and are ready to talk.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-400">3</span>
              </div>
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">You close the job</h3>
              <p className="text-gray-400">
                You spend less time on pointless estimates and more time on profitable 
                installations with serious, qualified buyers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to turn visitors into customers
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built specifically for contractors who want to stop wasting time on unqualified leads
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Instant pricing for any job</h3>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Give customers accurate quotes instantly. Fully customized to your business - 
                linear feet for fencing, square footage for concrete, or any pricing model you use.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-gray-300">Custom pricing for your services</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-gray-300">Good, Better, Best pricing tiers</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-gray-300">Material and labor calculations</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              {/* Mock calculator interface */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h4 className="font-semibold mb-4 text-white">Fence Calculator</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Linear Feet</label>
                    <div className="bg-gray-700 rounded p-2 text-sm text-white">150 ft</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Fence Type</label>
                    <div className="bg-gray-700 rounded p-2 text-sm text-white">Wood Privacy</div>
                  </div>
                  <div className="bg-blue-900/30 border border-blue-700 rounded p-4 mt-4">
                    <div className="text-lg font-bold text-blue-400">$4,200 - $5,800</div>
                    <div className="text-sm text-blue-300">Professional installation included</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 md:order-1">
              <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                <img src="/images/dashboard-example.png" alt="Analytics Dashboard" className="w-full rounded-lg shadow-sm" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-3xl font-bold text-white mb-6">Track your ROI with advanced reporting</h3>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Our analytics dashboard shows you exactly how many leads you're generating and where 
                they're coming from. Tag leads in your CRM to track closing rates and prove the value 
                of your marketing spend.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-gray-300">Measure lead volume and sources</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-gray-300">Make data-driven marketing decisions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-gray-300">Prove the ROI of your website and ad campaigns</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Map measurements</h4>
              <p className="text-gray-400 text-sm">Interactive maps for accurate surface area calculations</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Abandoned lead capture</h4>
              <p className="text-gray-400 text-sm">Capture partial information even if they don't complete the form</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12 6V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2M7 10V8a1 1 0 011-1h8a1 1 0 011 1v2m-9 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">CRM integrations</h4>
              <p className="text-gray-400 text-sm">Seamlessly connect with your existing sales workflow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Get your calculator live in 48 hours. No hidden fees, cancel anytime.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-gray-800 rounded-2xl p-8 border-2 border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">Setup Fee</h3>
              <div className="text-4xl font-bold text-white mb-4">
                $650 <span className="text-lg font-normal text-gray-400">CAD</span>
              </div>
              <p className="text-gray-400 mb-6">One-time setup and customization</p>
              <ul className="text-left space-y-2 text-gray-300">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom calculator design
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Pricing configuration
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Website integration
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8 border-2 border-blue-400 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-400 text-white px-3 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Monthly</h3>
              <div className="text-4xl font-bold text-white mb-4">
                $129 <span className="text-lg font-normal text-gray-400">CAD/month</span>
              </div>
              <p className="text-gray-400 mb-6">Everything you need to convert leads</p>
              <ul className="text-left space-y-2 text-gray-300">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited quotes
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Analytics dashboard
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Email support
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <Link href="/get-started" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-full font-bold text-xl transition-colors transform hover:scale-105">
              Get Your Calculator In 48 Hours →
            </Link>
            <p className="text-sm text-gray-500">30-day money-back guarantee • No long-term contracts</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to stop losing leads?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join 200+ contractors who are converting more website visitors into paying customers.
          </p>
          <div className="space-y-4">
            <Link href="/get-started" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-full font-bold text-xl transition-colors transform hover:scale-105 mr-4">
              Start Free Demo
            </Link>
            <Link href="/get-started" className="inline-block border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-4 rounded-full font-bold text-xl transition-colors">
              Book a Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}