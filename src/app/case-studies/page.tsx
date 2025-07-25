'use client'

import Link from 'next/link'

export default function CaseStudiesPage() {
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
              <Link href="/services" className="text-gray-700 hover:text-black transition-colors">SERVICES</Link>
              <Link href="/why-it-works" className="text-gray-700 hover:text-black transition-colors">WHY IT WORKS</Link>
              <Link href="/case-studies" className="text-black font-medium">CASE STUDIES</Link>
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
            Real businesses.
            <br />
            Real results.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            See how home service companies are transforming their sales process with Cazno.
          </p>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-sm uppercase tracking-wide mb-4 opacity-90">FEATURED SUCCESS STORY</div>
                <h2 className="text-4xl font-bold mb-6">
                  Premier HVAC Services
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  "Cazno completely changed our business. We went from losing leads every night to waking up with a full schedule. It paid for itself in the first week."
                </p>
                <p className="font-medium">— Mike Rodriguez, Owner</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
                <div className="space-y-6">
                  <div>
                    <div className="text-5xl font-bold">+127%</div>
                    <div className="text-sm opacity-90">Lead Conversion Rate</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold">42%</div>
                    <div className="text-sm opacity-90">Reduction in Estimate Time</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold">$285K</div>
                    <div className="text-sm opacity-90">Additional Revenue (6 months)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            Success across every industry
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Roofing Case Study */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-900 p-8 text-white">
                <div className="text-sm uppercase tracking-wide mb-2">ROOFING</div>
                <h3 className="text-2xl font-bold">StormGuard Roofing Co.</h3>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <h4 className="font-bold text-black mb-2">The Challenge:</h4>
                  <p className="text-gray-600">
                    Missing storm-damage leads during busy season. Competitors were getting to customers first.
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="font-bold text-black mb-2">The Solution:</h4>
                  <p className="text-gray-600">
                    Implemented 24/7 instant roof repair calculator with storm damage assessment questions.
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="font-bold text-black mb-2">The Results:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Lead Response Time</span>
                      <span className="font-bold text-black">24 hrs → Instant</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Qualified Leads/Month</span>
                      <span className="font-bold text-black">45 → 178</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Close Rate</span>
                      <span className="font-bold text-black">12% → 31%</span>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <p className="text-gray-600 italic">
                    "During the last storm season, we booked 3x more jobs than the previous year. The ROI is insane."
                  </p>
                  <p className="text-sm text-gray-500 mt-2">— Sarah Chen, Operations Manager</p>
                </div>
              </div>
            </div>

            {/* Landscaping Case Study */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-green-700 p-8 text-white">
                <div className="text-sm uppercase tracking-wide mb-2">LANDSCAPING</div>
                <h3 className="text-2xl font-bold">GreenScape Pros</h3>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <h4 className="font-bold text-black mb-2">The Challenge:</h4>
                  <p className="text-gray-600">
                    Complex pricing for multiple services made quotes take days. Lost high-value projects to faster competitors.
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="font-bold text-black mb-2">The Solution:</h4>
                  <p className="text-gray-600">
                    Custom calculator handling 15+ services with seasonal pricing and package deals.
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="font-bold text-black mb-2">The Results:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Quote Turnaround</span>
                      <span className="font-bold text-black">3 days → 30 seconds</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Project Value</span>
                      <span className="font-bold text-black">$3,200 → $5,100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Customer Satisfaction</span>
                      <span className="font-bold text-black">4.2 → 4.9 stars</span>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <p className="text-gray-600 italic">
                    "Customers love getting instant quotes for complex projects. We're booking bigger jobs than ever."
                  </p>
                  <p className="text-sm text-gray-500 mt-2">— David Park, Founder</p>
                </div>
              </div>
            </div>

            {/* Plumbing Case Study */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-blue-700 p-8 text-white">
                <div className="text-sm uppercase tracking-wide mb-2">PLUMBING</div>
                <h3 className="text-2xl font-bold">Rapid Response Plumbing</h3>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <h4 className="font-bold text-black mb-2">The Challenge:</h4>
                  <p className="text-gray-600">
                    Emergency calls going to competitors. Losing $15K+ per month in after-hours opportunities.
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="font-bold text-black mb-2">The Solution:</h4>
                  <p className="text-gray-600">
                    24/7 emergency service portal with instant pricing and next-available booking.
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="font-bold text-black mb-2">The Results:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">After-Hours Leads</span>
                      <span className="font-bold text-black">8/month → 67/month</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Emergency Revenue</span>
                      <span className="font-bold text-black">+$42K/month</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Cost Per Lead</span>
                      <span className="font-bold text-black">$125 → $18</span>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <p className="text-gray-600 italic">
                    "We're now the go-to emergency plumber in our area. Cazno made us available when customers need us most."
                  </p>
                  <p className="text-sm text-gray-500 mt-2">— Antonio Silva, Owner</p>
                </div>
              </div>
            </div>

            {/* Concrete Case Study */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-700 p-8 text-white">
                <div className="text-sm uppercase tracking-wide mb-2">CONCRETE</div>
                <h3 className="text-2xl font-bold">Precision Concrete Solutions</h3>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <h4 className="font-bold text-black mb-2">The Challenge:</h4>
                  <p className="text-gray-600">
                    Spending 20+ hours/week on estimates. Missing out on jobs due to slow quote turnaround.
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="font-bold text-black mb-2">The Solution:</h4>
                  <p className="text-gray-600">
                    Automated calculator for driveways, patios, and walkways with material cost integration.
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="font-bold text-black mb-2">The Results:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Time on Estimates</span>
                      <span className="font-bold text-black">20 hrs → 2 hrs/week</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Jobs Completed</span>
                      <span className="font-bold text-black">12 → 19/month</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Profit Margin</span>
                      <span className="font-bold text-black">18% → 26%</span>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <p className="text-gray-600 italic">
                    "I spend my time pouring concrete, not calculating quotes. Best investment we've made."
                  </p>
                  <p className="text-sm text-gray-500 mt-2">— Marcus Johnson, Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before & After Comparison */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            The transformation is real
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-red-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-red-700 mb-6">Before Cazno</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-red-500 mr-3">❌</span>
                  <p className="text-gray-700">Missed calls = missed opportunities</p>
                </div>
                <div className="flex items-start">
                  <span className="text-red-500 mr-3">❌</span>
                  <p className="text-gray-700">24-48 hour quote turnaround</p>
                </div>
                <div className="flex items-start">
                  <span className="text-red-500 mr-3">❌</span>
                  <p className="text-gray-700">Manual calculations prone to errors</p>
                </div>
                <div className="flex items-start">
                  <span className="text-red-500 mr-3">❌</span>
                  <p className="text-gray-700">Lost leads to faster competitors</p>
                </div>
                <div className="flex items-start">
                  <span className="text-red-500 mr-3">❌</span>
                  <p className="text-gray-700">No way to capture after-hours leads</p>
                </div>
                <div className="flex items-start">
                  <span className="text-red-500 mr-3">❌</span>
                  <p className="text-gray-700">Time wasted on unqualified prospects</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-green-700 mb-6">After Cazno</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <p className="text-gray-700">24/7 lead capture and response</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <p className="text-gray-700">Instant, accurate quotes every time</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <p className="text-gray-700">Automated pricing with your rules</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <p className="text-gray-700">First to respond = win more jobs</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <p className="text-gray-700">Capture leads while you sleep</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <p className="text-gray-700">Only talk to qualified, ready buyers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            What our customers say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Game changer. We're booking 3x more estimates and our close rate went through the roof. Worth every penny."
              </p>
              <p className="font-bold text-black">James Miller</p>
              <p className="text-sm text-gray-500">Miller's HVAC Services</p>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Finally, a system that understands contractors. Set up was easy and we saw results immediately."
              </p>
              <p className="font-bold text-black">Lisa Thompson</p>
              <p className="text-sm text-gray-500">Thompson Roofing Co.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Our competitors are still calling back leads 2 days later. We're already at their house. Cazno is our secret weapon."
              </p>
              <p className="font-bold text-black">Robert Kim</p>
              <p className="text-sm text-gray-500">Kim's Landscaping</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Your success story starts here
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join hundreds of home service businesses already growing with Cazno.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding" className="inline-block bg-lime-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-lime-300 transition-colors transform hover:scale-105">
              GET YOUR CUSTOM DEMO
            </Link>
            <Link href="/why-it-works" className="inline-block border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-colors">
              SEE HOW IT WORKS
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}