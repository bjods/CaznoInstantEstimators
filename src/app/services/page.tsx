'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ServicesPage() {
  const [activeService, setActiveService] = useState('quotes')

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-black">Cazno</Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-black transition-colors">HOME</Link>
              <Link href="/about" className="text-gray-700 hover:text-black transition-colors">ABOUT</Link>
              <Link href="/services" className="text-black font-medium">SERVICES</Link>
              <Link href="/why-it-works" className="text-gray-700 hover:text-black transition-colors">WHY IT WORKS</Link>
              <Link href="/case-studies" className="text-gray-700 hover:text-black transition-colors">CASE STUDIES</Link>
              <Link href="/login" className="text-gray-700 hover:text-black transition-colors">
                SIGN IN
              </Link>
              <Link href="/onboarding" className="bg-lime-400 text-black px-6 py-2 rounded-full font-medium hover:bg-lime-300 transition-colors">
                GET STARTED
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            Custom solutions for
            <br />
            home service pros.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            Stop losing leads to slow response times. Our smart systems capture, qualify, and convert visitors automatically.
          </p>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            Everything you need to grow
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Instant Quote System */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="mb-6">
                <span className="inline-block bg-lime-400 text-black px-4 py-2 rounded-full text-sm font-medium">
                  MOST POPULAR
                </span>
              </div>
              <h3 className="text-3xl font-bold text-black mb-4">Instant Quote System</h3>
              <p className="text-gray-600 mb-6">
                Give customers prices in seconds, not days. Our smart calculators work 24/7 to capture leads when they're ready to buy.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-lime-500 mr-3">✓</span>
                  <span className="text-gray-700">Custom pricing logic for your services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lime-500 mr-3">✓</span>
                  <span className="text-gray-700">Mobile-optimized for on-the-go customers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lime-500 mr-3">✓</span>
                  <span className="text-gray-700">Integrates with your existing website</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lime-500 mr-3">✓</span>
                  <span className="text-gray-700">Real-time lead notifications</span>
                </li>
              </ul>
              <div className="text-sm text-gray-600">
                Perfect for: HVAC, Roofing, Fencing, Concrete, Landscaping
              </div>
            </div>

            {/* Smart Lead Qualification */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-black mb-4">Smart Lead Qualification</h3>
              <p className="text-gray-600 mb-6">
                Stop wasting time on tire kickers. Our system pre-qualifies leads so you only talk to serious buyers.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-lime-500 mr-3">✓</span>
                  <span className="text-gray-700">Budget verification questions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lime-500 mr-3">✓</span>
                  <span className="text-gray-700">Service area validation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lime-500 mr-3">✓</span>
                  <span className="text-gray-700">Timeline and urgency scoring</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lime-500 mr-3">✓</span>
                  <span className="text-gray-700">Lead quality scoring dashboard</span>
                </li>
              </ul>
              <div className="text-sm text-gray-600">
                Perfect for: Plumbing, Electrical, Painting, Remodeling
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Showcase */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-4">
            See it in action
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Watch how our systems transform the customer experience for different home service industries.
          </p>

          {/* Service Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveService('quotes')}
              className={`px-6 py-3 rounded-full transition-colors ${
                activeService === 'quotes'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              INSTANT QUOTES
            </button>
            <button
              onClick={() => setActiveService('booking')}
              className={`px-6 py-3 rounded-full transition-colors ${
                activeService === 'booking'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              SMART BOOKING
            </button>
            <button
              onClick={() => setActiveService('followup')}
              className={`px-6 py-3 rounded-full transition-colors ${
                activeService === 'followup'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              AUTOMATED FOLLOW-UP
            </button>
          </div>

          {/* Service Display */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              {activeService === 'quotes' && (
                <div>
                  <h3 className="text-2xl font-bold text-black mb-6">Instant Quote Calculator</h3>
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl h-64 mb-6 flex items-center justify-center">
                    <span className="text-white text-6xl">💰</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-black mb-2">For Your Customers:</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Get prices instantly, 24/7</li>
                        <li>• No waiting for callbacks</li>
                        <li>• Clear, transparent pricing</li>
                        <li>• Book appointments immediately</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-black mb-2">For Your Business:</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Capture leads while they're hot</li>
                        <li>• Pre-qualified contact info</li>
                        <li>• Reduce estimating time by 80%</li>
                        <li>• Higher conversion rates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeService === 'booking' && (
                <div>
                  <h3 className="text-2xl font-bold text-black mb-6">Smart Booking System</h3>
                  <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl h-64 mb-6 flex items-center justify-center">
                    <span className="text-white text-6xl">📅</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-black mb-2">For Your Customers:</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Book appointments instantly</li>
                        <li>• See real-time availability</li>
                        <li>• Get confirmation texts</li>
                        <li>• Easy rescheduling options</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-black mb-2">For Your Business:</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Eliminate phone tag</li>
                        <li>• Optimize route planning</li>
                        <li>• Reduce no-shows by 40%</li>
                        <li>• Sync with your calendar</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeService === 'followup' && (
                <div>
                  <h3 className="text-2xl font-bold text-black mb-6">Automated Follow-Up</h3>
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl h-64 mb-6 flex items-center justify-center">
                    <span className="text-white text-6xl">🔄</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-black mb-2">For Your Customers:</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Timely project updates</li>
                        <li>• Easy communication channel</li>
                        <li>• Review requests at the right time</li>
                        <li>• Maintenance reminders</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-black mb-2">For Your Business:</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Never lose a lead again</li>
                        <li>• Increase repeat business</li>
                        <li>• Build 5-star reviews</li>
                        <li>• Save 10+ hours per week</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Industry-Specific Solutions */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            Built for your industry
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-xl font-bold text-black mb-2">HVAC</h3>
              <p className="text-gray-600">
                Quote repairs, installations, and maintenance plans instantly. Handle seasonal demand spikes effortlessly.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔨</div>
              <h3 className="text-xl font-bold text-black mb-2">Roofing</h3>
              <p className="text-gray-600">
                Calculate material costs, labor, and timelines. Capture storm-damage leads before competitors.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🌳</div>
              <h3 className="text-xl font-bold text-black mb-2">Landscaping</h3>
              <p className="text-gray-600">
                Price complex projects with multiple services. Show customers beautiful possibilities instantly.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🚿</div>
              <h3 className="text-xl font-bold text-black mb-2">Plumbing</h3>
              <p className="text-gray-600">
                Provide emergency and scheduled service quotes. Build trust with transparent pricing.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-black mb-2">Electrical</h3>
              <p className="text-gray-600">
                Quote everything from simple repairs to whole-home rewiring. Educate customers on safety.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-black mb-2">Painting</h3>
              <p className="text-gray-600">
                Calculate by square footage, room count, or project type. Show color options and finishes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to capture more leads?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Get a custom solution built for your specific home service business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding" className="inline-block bg-lime-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-lime-300 transition-colors transform hover:scale-105">
              START FREE TRIAL
            </Link>
            <Link href="/case-studies" className="inline-block border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-colors">
              SEE SUCCESS STORIES
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}