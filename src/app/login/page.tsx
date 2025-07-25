'use client'

import Link from "next/link"
import { SignInForm } from "@/components/auth/SignInForm"

export default function Login() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-0 left-0 w-full h-full">
          <svg className="w-full h-full" viewBox="0 0 1920 1080" fill="none">
            {Array.from({ length: 60 }).map((_, i) => (
              <g key={i}>
                {Array.from({ length: 120 }).map((_, j) => (
                  <circle
                    key={j}
                    cx={j * 16 + (i % 2) * 8}
                    cy={i * 18}
                    r="1"
                    fill="white"
                    opacity={Math.random() * 0.6 + 0.2}
                  />
                ))}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Cazno
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15,18 9,12 15,6" />
            </svg>
            Back to home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome back
            </h1>
            <p className="text-xl text-gray-300">
              Sign in to your Cazno dashboard
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <SignInForm />
          </div>

          {/* Footer Links */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              Need help? <Link href="/contact" className="text-lime-400 hover:text-lime-300 transition-colors">Contact support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}