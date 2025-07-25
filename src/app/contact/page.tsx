'use client'

import Link from 'next/link'

export default function ContactPage() {
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
              <Link href="/case-studies" className="text-gray-700 hover:text-black transition-colors">CASE STUDIES</Link>
              <Link href="/contact" className="text-black font-medium">CONTACT</Link>
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
            Get in touch
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            Need help with your account or have questions about our platform?
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-black mb-8">Support & Help</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">📧 Email Support</h3>
                  <p className="text-gray-600 mb-2">
                    For technical issues or account questions:
                  </p>
                  <a href="mailto:support@cazno.com" className="text-lime-600 hover:text-lime-700 font-medium">
                    support@cazno.com
                  </a>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">💬 Live Chat</h3>
                  <p className="text-gray-600 mb-2">
                    Available Monday-Friday, 9 AM - 6 PM EST
                  </p>
                  <button className="bg-lime-400 text-black px-4 py-2 rounded-lg hover:bg-lime-300 transition-colors font-medium">
                    Start Chat
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-black mb-2">📚 Help Center</h3>
                  <p className="text-gray-600 mb-2">
                    Browse our knowledge base and tutorials:
                  </p>
                  <Link href="/help" className="text-lime-600 hover:text-lime-700 font-medium">
                    Visit Help Center →
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-black mb-6">Quick Help</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-bold text-black mb-2">Login Issues?</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Try resetting your password or contact support.
                  </p>
                  <Link href="/login" className="text-lime-600 hover:text-lime-700 text-sm font-medium">
                    Go to Login →
                  </Link>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-bold text-black mb-2">Widget Not Working?</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Check your embed code and website integration.
                  </p>
                  <Link href="/dashboard/widgets" className="text-lime-600 hover:text-lime-700 text-sm font-medium">
                    Check Widgets →
                  </Link>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-bold text-black mb-2">Need a Demo?</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    See how other businesses use Cazno.
                  </p>
                  <Link href="/case-studies" className="text-lime-600 hover:text-lime-700 text-sm font-medium">
                    View Case Studies →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Still need help?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Our team is here to help you succeed with your lead generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="mailto:support@cazno.com" className="inline-block bg-lime-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-lime-300 transition-colors transform hover:scale-105">
              Email Support
            </a>
            <Link href="/about" className="inline-block border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}