'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUpPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })

    setLoading(false)

    if (res.ok) {
      router.push('/login')
      return
    }

    const data = await res.json()
    setError(data.error || 'Unable to create account.')
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center px-6 py-16">
      <div className="w-full rounded-2xl border border-ink-700 bg-ink-800 p-8">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-accent-indigo">Create account</p>
        <h1 className="text-3xl font-bold text-ink-100">Join InkSpire</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-ink-300">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-ink-600 bg-ink-900 px-4 py-3 text-ink-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-ink-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-ink-600 bg-ink-900 px-4 py-3 text-ink-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-ink-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-ink-600 bg-ink-900 px-4 py-3 text-ink-100"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent-indigo px-4 py-3 font-semibold text-ink-900 disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400">
          Already have an account?{' '}
          <Link href="/login" className="text-accent-indigo hover:text-accent-indigo/80">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
