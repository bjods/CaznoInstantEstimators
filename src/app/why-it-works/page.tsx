'use client'

import Link from 'next/link'

export default function WhyItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-black">Cazno</Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/about" className="text-gray-700 hover:text-black transition-colors">ABOUT</Link>
              <Link href="/services" className="text-gray-700 hover:text-black transition-colors">SERVICES</Link>
              <Link href="/why-it-works" className="text-black font-medium">WHY IT WORKS</Link>
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
            The science behind
            <br />
            better conversions.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            Real data from thousands of home service businesses proves our approach works.
          </p>
        </div>
      </section>

      {/* Key Stats Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            The numbers don't lie
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-lime-400 rounded-2xl p-8 text-center">
              <div className="text-6xl font-bold text-black mb-4">80%</div>
              <p className="text-xl text-black font-medium">
                of consumers expect a response within 10 minutes
              </p>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8 text-center">
              <div className="text-6xl font-bold text-black mb-4">77%</div>
              <p className="text-xl text-gray-700">
                higher conversion rates with instant quote systems
              </p>
            </div>
            <div className="bg-black rounded-2xl p-8 text-center">
              <div className="text-6xl font-bold text-white mb-4">3X</div>
              <p className="text-xl text-gray-300">
                more likely to close when you respond in 5 minutes
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
            <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed">
              "The odds of qualifying a lead drop by <span className="font-bold text-black">80%</span> 
              if you wait just 5 minutes to respond. After 10 minutes, 
              the drop is <span className="font-bold text-black">400%</span>."
            </p>
            <p className="text-gray-500 mt-4">— Harvard Business Review Study</p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            Generic forms vs. Cazno systems
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-4 px-4 font-bold text-gray-600">Feature</th>
                  <th className="text-center py-4 px-4">
                    <div className="text-gray-500 font-medium">Generic Lead Form</div>
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="text-black font-bold">Cazno System</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-6 px-4 font-medium">Response Time</td>
                  <td className="text-center py-6 px-4">
                    <span className="text-red-500">Hours or days</span>
                  </td>
                  <td className="text-center py-6 px-4">
                    <span className="text-green-500 font-bold">Instant (24/7)</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="py-6 px-4 font-medium">Lead Quality</td>
                  <td className="text-center py-6 px-4">
                    <span className="text-red-500">Mixed (lots of tire kickers)</span>
                  </td>
                  <td className="text-center py-6 px-4">
                    <span className="text-green-500 font-bold">Pre-qualified buyers</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-6 px-4 font-medium">Conversion Rate</td>
                  <td className="text-center py-6 px-4">
                    <span className="text-red-500">2-3%</span>
                  </td>
                  <td className="text-center py-6 px-4">
                    <span className="text-green-500 font-bold">15-20%</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="py-6 px-4 font-medium">Time to Quote</td>
                  <td className="text-center py-6 px-4">
                    <span className="text-red-500">Manual calculation required</span>
                  </td>
                  <td className="text-center py-6 px-4">
                    <span className="text-green-500 font-bold">Instant automated quotes</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-6 px-4 font-medium">Lead Capture Cost</td>
                  <td className="text-center py-6 px-4">
                    <span className="text-red-500">$150-300 per qualified lead</span>
                  </td>
                  <td className="text-center py-6 px-4">
                    <span className="text-green-500 font-bold">$25-50 per qualified lead</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="py-6 px-4 font-medium">Mobile Experience</td>
                  <td className="text-center py-6 px-4">
                    <span className="text-red-500">Often broken or slow</span>
                  </td>
                  <td className="text-center py-6 px-4">
                    <span className="text-green-500 font-bold">Mobile-first design</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-6 px-4 font-medium">Follow-up Required</td>
                  <td className="text-center py-6 px-4">
                    <span className="text-red-500">100% manual</span>
                  </td>
                  <td className="text-center py-6 px-4">
                    <span className="text-green-500 font-bold">Automated sequences</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pain Points & Solutions */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            We solve your biggest challenges
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="bg-red-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-red-700 mb-2">❌ The Problem</h3>
                <p className="text-red-600">
                  "We're losing leads because we can't respond fast enough. By the time we call back, they've already hired someone else."
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-700 mb-2">✅ Our Solution</h3>
                <p className="text-green-600">
                  Instant quotes and automated booking mean customers get answers immediately, even at 2 AM. You wake up to qualified appointments.
                </p>
              </div>
            </div>

            <div>
              <div className="bg-red-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-red-700 mb-2">❌ The Problem</h3>
                <p className="text-red-600">
                  "We waste hours on tire kickers who just want free estimates but never hire us."
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-700 mb-2">✅ Our Solution</h3>
                <p className="text-green-600">
                  Smart qualification questions filter out price shoppers. You only talk to customers who match your ideal project profile.
                </p>
              </div>
            </div>

            <div>
              <div className="bg-red-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-red-700 mb-2">❌ The Problem</h3>
                <p className="text-red-600">
                  "Our website gets traffic but hardly any of them actually contact us."
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-700 mb-2">✅ Our Solution</h3>
                <p className="text-green-600">
                  Interactive calculators engage visitors and capture contact info in exchange for instant value. Convert 10x more visitors.
                </p>
              </div>
            </div>

            <div>
              <div className="bg-red-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-red-700 mb-2">❌ The Problem</h3>
                <p className="text-red-600">
                  "We're spending thousands on ads but our cost per lead keeps going up."
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-700 mb-2">✅ Our Solution</h3>
                <p className="text-green-600">
                  Higher conversion rates mean every ad dollar works harder. Cut your cost per qualified lead by 75% or more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Preview */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-8">
            Calculate your potential ROI
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            See how much revenue you're leaving on the table with slow response times.
          </p>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <label className="text-sm text-gray-600 font-medium">Monthly Website Visitors</label>
                <div className="text-3xl font-bold text-black mt-2">1,000</div>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Current Conversion Rate</label>
                <div className="text-3xl font-bold text-black mt-2">2%</div>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Average Project Value</label>
                <div className="text-3xl font-bold text-black mt-2">$2,500</div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-600 mb-2">Current Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-700">$50,000</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">With Cazno System</p>
                  <p className="text-2xl font-bold text-green-600">$187,500</p>
                  <p className="text-sm text-green-500 mt-1">+275% increase</p>
                </div>
              </div>
            </div>
            
            <Link href="/onboarding" className="inline-block bg-lime-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-lime-300 transition-colors transform hover:scale-105 mt-8">
              GET YOUR CUSTOM ROI REPORT
            </Link>
          </div>
        </div>
      </section>

      {/* Time Savings */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            Save time. Make money.
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-black mb-8">
                Hours saved every week
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Phone tag with leads</span>
                    <span className="font-bold text-black">-8 hours</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div className="bg-lime-400 h-3 rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Manual quote calculations</span>
                    <span className="font-bold text-black">-12 hours</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div className="bg-lime-400 h-3 rounded-full" style={{width: '100%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Lead qualification calls</span>
                    <span className="font-bold text-black">-6 hours</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div className="bg-lime-400 h-3 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Follow-up emails/texts</span>
                    <span className="font-bold text-black">-5 hours</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div className="bg-lime-400 h-3 rounded-full" style={{width: '50%'}}></div>
                  </div>
                </div>
              </div>
              <div className="mt-8 p-6 bg-black text-white rounded-xl">
                <p className="text-3xl font-bold">31+ hours saved weekly</p>
                <p className="text-gray-300 mt-2">That's almost a full-time employee!</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
              <h3 className="text-3xl font-bold text-black mb-6">
                What you can do with 31 extra hours
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-2xl mr-4">💰</span>
                  <div>
                    <p className="font-bold text-black">Complete 5-8 more jobs</p>
                    <p className="text-gray-600">Worth $15,000-25,000 in revenue</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-4">🏡</span>
                  <div>
                    <p className="font-bold text-black">Spend time with family</p>
                    <p className="text-gray-600">Work-life balance is possible</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-4">📈</span>
                  <div>
                    <p className="font-bold text-black">Focus on growing your business</p>
                    <p className="text-gray-600">Strategic planning instead of busy work</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-4">⭐</span>
                  <div>
                    <p className="font-bold text-black">Deliver better service</p>
                    <p className="text-gray-600">Happy customers = more referrals</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Stop losing money to slow responses
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Every minute you wait is money in your competitor's pocket.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding" className="inline-block bg-lime-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-lime-300 transition-colors transform hover:scale-105">
              START CAPTURING MORE LEADS
            </Link>
            <Link href="/case-studies" className="inline-block border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-colors">
              SEE REAL RESULTS
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}