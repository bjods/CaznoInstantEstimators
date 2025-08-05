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
        <div className="text-center max-w-5xl mx-auto relative z-10 pt-16">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Your website visitors are
            <br />
            <span className="text-red-400">leaving without buying.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed">
            73% of contractors lose qualified leads because customers can't get instant pricing. 
            <br />
            While you're writing estimates, your competitors are closing deals.
          </p>

          <p className="text-xl md:text-2xl font-semibold text-blue-400 mb-8">
            Turn website visitors into paying customers with instant quote calculators that work 24/7.
          </p>
          
          <Link href="/get-started" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-full font-bold text-lg transition-colors transform hover:scale-105 mb-8">
            Get Your Calculator In 48 Hours →
          </Link>

          <div className="flex items-center justify-center gap-6 mb-12 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-400">200+ contractors using Cazno</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-400">48hrs to go live</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-400">2-3x more leads</span>
            </div>
          </div>

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

      {/* Problem Section - Your website is a leaky bucket */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-gray-100 rounded-2xl p-8 relative">
                <div className="w-64 h-48 bg-orange-400 rounded-xl mx-auto mb-4 relative overflow-hidden">
                  <div className="absolute top-4 left-4 right-4">
                    <div className="bg-green-500 w-8 h-6 rounded mx-auto mb-2"></div>
                    <div className="bg-green-500 w-6 h-4 rounded mx-auto mb-2"></div>
                    <div className="bg-green-500 w-10 h-5 rounded mx-auto"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-orange-500 rounded-b-xl"></div>
                  {/* Money falling out */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-3 h-6 bg-green-600 rounded-sm transform rotate-12"></div>
                  </div>
                  <div className="absolute -bottom-1 left-1/3 transform -translate-x-1/2">
                    <div className="w-3 h-6 bg-green-600 rounded-sm transform -rotate-12"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Your website is a <span className="bg-blue-100 px-2 rounded">leaky bucket</span>.
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                You spend thousands on marketing to get people to your website. But 
                when they get there, do they actually call you? For most contractors, the 
                answer is "less than 7%".
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                The other 93% of your visitors—the ones you paid to get—click away and 
                are lost forever. They leave because they have one simple question you're 
                not answering: "How much will this cost?" Every visitor who leaves is a lost 
                job and wasted money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Give customers a price.
            <br />
            Get a <span className="text-orange-500 underline decoration-orange-500">qualified lead</span>.
          </h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            Cazno turns your website into an automated lead machine that works 
            for you 24/7. It's a simple, powerful exchange that wins you more business.
          </p>

          {/* 3-Step Process */}
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <div className="mb-6">
                <div className="w-16 h-16 bg-orange-500 rounded-lg mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">They get an instant quote</h3>
              <p className="text-gray-600">
                A customer answers a few simple questions and instantly receives an 
                accurate price range. No phone call needed.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <div className="mb-6">
                <div className="w-16 h-16 bg-orange-500 rounded-lg mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">You get a pre-qualified lead</h3>
              <p className="text-gray-600">
                You receive the customer's contact info. The best part? They've already seen the 
                price and are ready to talk.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <div className="mb-6">
                <div className="w-16 h-16 bg-orange-500 rounded-lg mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">You close the job</h3>
              <p className="text-gray-600">
                You spend less time on pointless estimates and more time on profitable 
                installations with serious, qualified buyers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to turn visitors into customers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for contractors who want to stop wasting time on unqualified leads
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Instant pricing for any job</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Give customers accurate quotes instantly. Fully customized to your business - 
                linear feet for fencing, square footage for concrete, or any pricing model you use.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Custom pricing for your services</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Good, Better, Best pricing tiers</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Material and labor calculations</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8">
              {/* Mock calculator interface */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold mb-4">Fence Calculator</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Linear Feet</label>
                    <div className="bg-gray-50 rounded p-2 text-sm">150 ft</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Fence Type</label>
                    <div className="bg-gray-50 rounded p-2 text-sm">Wood Privacy</div>
                  </div>
                  <div className="bg-blue-50 rounded p-4 mt-4">
                    <div className="text-lg font-bold text-blue-900">$4,200 - $5,800</div>
                    <div className="text-sm text-blue-700">Professional installation included</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 md:order-1">
              <div className="bg-gray-100 rounded-2xl p-8">
                <img src="/images/dashboard-example.png" alt="Analytics Dashboard" className="w-full rounded-lg shadow-sm" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Track your ROI with advanced reporting</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our analytics dashboard shows you exactly how many leads you're generating and where 
                they're coming from. Tag leads in your CRM to track closing rates and prove the value 
                of your marketing spend.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Measure lead volume and sources</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Make data-driven marketing decisions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Prove the ROI of your website and ad campaigns</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Map measurements</h4>
              <p className="text-gray-600 text-sm">Interactive maps for accurate surface area calculations</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Abandoned lead capture</h4>
              <p className="text-gray-600 text-sm">Capture partial information even if they don't complete the form</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12 6V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2M7 10V8a1 1 0 011-1h8a1 1 0 011 1v2m-9 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">CRM integrations</h4>
              <p className="text-gray-600 text-sm">Seamlessly connect with your existing sales workflow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Get your calculator live in 48 hours. No hidden fees, cancel anytime.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Setup Fee</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                $650 <span className="text-lg font-normal text-gray-600">CAD</span>
              </div>
              <p className="text-gray-600 mb-6">One-time setup and customization</p>
              <ul className="text-left space-y-2 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom calculator design
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Pricing configuration
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Website integration
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-orange-400 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Monthly</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                $129 <span className="text-lg font-normal text-gray-600">CAD/month</span>
              </div>
              <p className="text-gray-600 mb-6">Everything you need to convert leads</p>
              <ul className="text-left space-y-2 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited quotes
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Analytics dashboard
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Email support
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <Link href="/get-started" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-full font-bold text-xl transition-colors transform hover:scale-105">
              Get Your Calculator In 48 Hours →
            </Link>
            <p className="text-sm text-gray-500">30-day money-back guarantee • No long-term contracts</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to stop losing leads?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join 200+ contractors who are converting more website visitors into paying customers.
          </p>
          <div className="space-y-4">
            <Link href="/get-started" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-full font-bold text-xl transition-colors transform hover:scale-105 mr-4">
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