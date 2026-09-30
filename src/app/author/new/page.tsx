'use client'

import { getServerSession } from 'next-auth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewStoryPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Fantasy')
  const [tags, setTags] = useState('#slowburn, #enemies-to-lovers')
  const [maturityRating, setMaturityRating] = useState('EVERYONE')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        category,
        tags: tags.split(',').map((t) => t.trim()),
        maturityRating,
      }),
    })

    setLoading(false)

    if (res.ok) {
      const story = await res.json()
      router.push(`/story/${story.slug}`)
      return
    }

    const data = await res.json()
    setError(data.error || 'Unable to create story.')
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <Link href="/author" className="text-sm text-ink-400 hover:text-ink-200">
          ← Back to studio
        </Link>
      </div>

      <div className="rounded-2xl border border-ink-700 bg-ink-800 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-accent-indigo">Writer Studio</p>
        <h1 className="mt-2 text-3xl font-bold text-ink-100">New Story</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm text-ink-300">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-ink-600 bg-ink-900 px-4 py-3 text-ink-100"
              placeholder="e.g. Ember & Ash"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-ink-300">Description / Synopsis</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              className="w-full rounded-lg border border-ink-600 bg-ink-900 px-4 py-3 text-ink-100"
              placeholder="Tell us about your story..."
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-ink-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-ink-600 bg-ink-900 px-4 py-3 text-ink-100"
              >
                <option>Fantasy</option>
                <option>Romance</option>
                <option>Sci-Fi</option>
                <option>Thriller</option>
                <option>Fanfiction</option>
                <option>Mystery</option>
                <option>Adventure</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-ink-300">Maturity</label>
              <select
                value={maturityRating}
                onChange={(e) => setMaturityRating(e.target.value)}
                className="w-full rounded-lg border border-ink-600 bg-ink-900 px-4 py-3 text-ink-100"
              >
                <option value="EVERYONE">Everyone</option>
                <option value="MATURE">Mature (18+)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-ink-300">Tags</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-lg border border-ink-600 bg-ink-900 px-4 py-3 text-ink-100"
              placeholder="e.g. #slowburn, #enemies-to-lovers, #fantasy"
            />
            <p className="mt-1 text-xs text-ink-500">Separate tags with commas</p>
          </div>

          {error && <div className="rounded-lg bg-red-900/20 p-3 text-sm text-red-400">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-accent-indigo px-5 py-3 font-semibold text-ink-900 disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Story'}
          </button>
        </form>
      </div>
    </main>
  )
}
