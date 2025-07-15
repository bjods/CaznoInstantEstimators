import Link from 'next/link'
import MobileMenu from '@/components/MobileMenu'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">Cazno</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</Link>
              <Link href="#demo" className="text-gray-600 hover:text-gray-900 transition">Demo</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</Link>
              <Link href="#about" className="text-gray-600 hover:text-gray-900 transition">About</Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition">Login</Link>
              <Link href="/dashboard" className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition">
                Start Free Trial
              </Link>
            </div>
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Instant Estimates That 
              <span className="text-green-500"> Convert Leads</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Give your customers instant, accurate quotes 24/7. Reduce sales time by 73% and increase conversions by 2.5x with our embeddable estimation widgets.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard" className="bg-green-500 text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-green-600 transition text-center">
                Start 14-Day Free Trial
              </Link>
              <Link href="#demo" className="bg-gray-100 text-gray-900 px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-200 transition text-center">
                See Live Demo
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">No credit card required • Setup in 5 minutes</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900">73%</div>
              <div className="text-gray-600 mt-2">Faster Sales Process</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900">2.5x</div>
              <div className="text-gray-600 mt-2">Higher Conversion Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900">87%</div>
              <div className="text-gray-600 mt-2">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900">$2.3M</div>
              <div className="text-gray-600 mt-2">Revenue Generated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Widgets Section */}
      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Instant Estimators That Sell
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Beautiful, conversion-optimized estimation forms that integrate seamlessly with your website. 
              Close deals before competitors even call back.
            </p>
          </div>

          {/* Widget Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fencing Widget */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <p className="font-semibold">Fencing Calculator</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fence Installation</h3>
                <p className="text-gray-600 mb-4">Let customers calculate fence costs instantly based on linear feet, material type, and gates.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Live Demo</span>
                  <button className="text-green-500 hover:text-green-600 font-semibold">Try it →</button>
                </div>
              </div>
            </div>

            {/* Concrete Widget */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="font-semibold">Concrete Calculator</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Concrete Work</h3>
                <p className="text-gray-600 mb-4">Quote driveways, patios, and slabs with automatic area calculations and finish options.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Live Demo</span>
                  <button className="text-blue-500 hover:text-blue-600 font-semibold">Try it →</button>
                </div>
              </div>
            </div>

            {/* Landscaping Widget */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <p className="font-semibold">Landscaping Calculator</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Landscaping</h3>
                <p className="text-gray-600 mb-4">Design packages with mulch, plants, and hardscaping calculated by square footage.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Live Demo</span>
                  <button className="text-purple-500 hover:text-purple-600 font-semibold">Try it →</button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">And many more industries including roofing, painting, HVAC, plumbing, and more...</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Close More Deals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to streamline your sales process and delight your customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Quotes</h3>
              <p className="text-gray-600">Generate accurate estimates in seconds, not hours. No more back-and-forth emails or phone tag.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Conversion Analytics</h3>
              <p className="text-gray-600">Track every interaction and optimize your forms for maximum conversions with detailed insights.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Integration</h3>
              <p className="text-gray-600">Embed on any website with a simple code snippet. Works with WordPress, Wix, Squarespace, and more.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-lg">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Availability</h3>
              <p className="text-gray-600">Capture leads even when you&apos;re sleeping. Your estimator works around the clock to grow your business.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional & Accurate</h3>
              <p className="text-gray-600">Build trust with professional-looking forms and accurate calculations based on your pricing rules.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lead Management</h3>
              <p className="text-gray-600">All estimates automatically saved to your dashboard. Export to CRM or follow up with built-in tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-12 text-white">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">
                See Your ROI in Real-Time
              </h2>
              <p className="text-xl mb-8 text-green-100">
                The average Cazno customer sees a 312% ROI within 60 days. Our widgets pay for themselves with just 2-3 extra sales per month.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="text-3xl font-bold">45%</div>
                  <div className="text-green-100">More Qualified Leads</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">3.2hrs</div>
                  <div className="text-green-100">Saved Per Day</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">$47k</div>
                  <div className="text-green-100">Avg Revenue Increase</div>
                </div>
              </div>
              <Link href="/dashboard" className="bg-white text-green-600 px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-100 transition inline-block">
                Calculate Your ROI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by 500+ Home Service Businesses
            </h2>
            <p className="text-xl text-gray-600">
              See why contractors are switching to Cazno for instant estimates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Cazno transformed our sales process. We&apos;re closing 3x more deals and spending way less time on estimates. Game changer!&quot;
              </p>
              <div className="font-semibold text-gray-900">Mike Johnson</div>
              <div className="text-sm text-gray-500">Premier Fencing Co.</div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Our website conversion rate went from 2% to 8% after adding Cazno. The instant quotes keep customers engaged.&quot;
              </p>
              <div className="font-semibold text-gray-900">Sarah Martinez</div>
              <div className="text-sm text-gray-500">Concrete Solutions LLC</div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Setup was incredibly easy. Within an hour, we had a professional estimator on our site generating leads 24/7.&quot;
              </p>
              <div className="font-semibold text-gray-900">David Chen</div>
              <div className="text-sm text-gray-500">GreenScape Pros</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to 10x Your Sales Process?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join 500+ home service businesses using Cazno to close more deals with less effort.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard" className="bg-green-500 text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-green-600 transition text-center">
              Start Free 14-Day Trial
            </Link>
            <Link href="#demo" className="bg-gray-100 text-gray-900 px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-200 transition text-center">
              Watch Demo
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Cazno</h3>
              <p className="text-gray-400">
                Instant estimates that convert leads into customers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#demo" className="hover:text-white transition">Demo</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#about" className="hover:text-white transition">About</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Cazno. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}