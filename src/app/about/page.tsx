'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-black">Cazno</Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-black transition-colors">HOME</Link>
              <Link href="/about" className="text-black font-medium">ABOUT</Link>
              <Link href="/services" className="text-gray-700 hover:text-black transition-colors">SERVICES</Link>
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
            Empowering home service
            <br />
            businesses to grow.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            We build seamless lead capture and sales systems that turn website visitors into paying customers.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-black mb-6">Our Mission</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                At Cazno, we believe every home service business deserves enterprise-level tools without the enterprise complexity. 
                Our mission is simple: help contractors, HVAC companies, roofers, and other home service professionals capture more leads, 
                respond faster, and close more deals.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                We're not just another software company. We understand the unique challenges of running a home service business – 
                from managing seasonal demand to competing with larger companies. That's why we built Cazno.
              </p>
            </div>
            <div className="bg-gray-100 rounded-2xl p-12">
              <div className="space-y-8">
                <div>
                  <div className="text-5xl font-bold text-black mb-2">10+</div>
                  <div className="text-gray-600">Years in Home Services</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-black mb-2">1000s</div>
                  <div className="text-gray-600">Of Leads Captured</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-black mb-2">24/7</div>
                  <div className="text-gray-600">Lead Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            Why We're Different
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-lime-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Industry Focus</h3>
              <p className="text-gray-600">
                We exclusively serve home service businesses. No generic solutions – everything we build is tailored to your industry's needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-lime-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Speed First</h3>
              <p className="text-gray-600">
                We know speed wins deals. Our systems deliver instant quotes and capture leads 24/7, so you never miss an opportunity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-lime-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Data Driven</h3>
              <p className="text-gray-600">
                Every feature is backed by real data from successful home service businesses. We build what actually moves the needle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            Our Values
          </h2>
          <div className="space-y-12">
            <div className="flex items-start space-x-6">
              <div className="text-3xl">🏗️</div>
              <div>
                <h3 className="text-2xl font-bold text-black mb-2">Built for Builders</h3>
                <p className="text-gray-600">
                  We respect the hard work you do every day. Our tools are designed to make your business life easier, not more complicated.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="text-3xl">🤝</div>
              <div>
                <h3 className="text-2xl font-bold text-black mb-2">Partnership, Not Just Software</h3>
                <p className="text-gray-600">
                  We're invested in your success. When you grow, we grow. That's why we offer ongoing support and optimization.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="text-3xl">📈</div>
              <div>
                <h3 className="text-2xl font-bold text-black mb-2">Results That Matter</h3>
                <p className="text-gray-600">
                  We measure success by your success. More leads, higher conversions, and real revenue growth – that's what counts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to transform your business?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join the home service professionals who are capturing more leads and closing more deals with Cazno.
          </p>
          <Link href="/onboarding" className="inline-block bg-lime-400 text-black px-12 py-4 rounded-full font-bold text-xl hover:bg-lime-300 transition-colors transform hover:scale-105">
            GET STARTED TODAY
          </Link>
        </div>
      </section>
    </div>
  )
}