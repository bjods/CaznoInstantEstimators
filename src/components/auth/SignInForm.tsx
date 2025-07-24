'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for the login link!')
    }
    setLoading(false)
  }

  const handleSignUp = async () => {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for the confirmation link!')
    }
    setLoading(false)
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form
        className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        onSubmit={handleSignIn}
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="••••••••"
          required
        />
        <button
          type="submit"
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <button
          type="button"
          onClick={handleSignUp}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        {message && (
          <div className="mt-4 p-4 bg-foreground/10 border border-foreground/20 rounded-md">
            {message}
          </div>
        )}
      </form>
    </div>
  )
}