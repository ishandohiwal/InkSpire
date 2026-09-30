'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTokenDrain } from '@/hooks/useTokenDrain'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'
import InteractiveReader from '@/components/reader/InteractiveReader'

export default function ChapterPage({
  params,
}: {
  params: { slug: string; chapterNumber: string }
}) {
  const { data: session } = useSession()
  const [chapter, setChapter] = useState<any>(null)
  const [story, setStory] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tokensBalance, setTokensBalance] = useState(150)
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        // Load story
        const storyRes = await fetch(`/api/stories?slug=${params.slug}`)
        const stories = await storyRes.json()
        const foundStory = stories.find((s: any) => s.slug === params.slug)
        setStory(foundStory)

        // Load chapter
        if (foundStory) {
          const foundChapter = foundStory.chapters.find(
            (ch: any) => ch.number === Number(params.chapterNumber)
          )
          setChapter(foundChapter)

          // Load comments
          const commentsRes = await fetch(
            `/api/comments?chapterId=${foundChapter.id}`
          )
          if (commentsRes.ok) {
            setComments(await commentsRes.json())
          }
        }
      } catch (error) {
        console.error('Failed to load chapter:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.slug, params.chapterNumber])

  async function handleVote() {
    if (!chapter || hasVoted) return

    const res = await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId: chapter.id }),
    })

    if (res.ok) {
      setHasVoted(true)
    }
  }

  async function handleCommentAdd(paragraphIndex: number, content: string) {
    if (!chapter) return

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chapterId: chapter.id,
        paragraphIndex,
        content,
      }),
    })

    if (res.ok) {
      const newComment = await res.json()
      setComments([...comments, newComment])
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-center text-ink-400">Loading chapter...</div>
      </main>
    )
  }

  if (!chapter || !story) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-center text-red-400">Chapter not found</div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-ink-900">
      <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <Link href={`/story/${story.slug}`} className="text-sm text-ink-400 hover:text-ink-200">
              ← {story.title}
            </Link>
            <h1 className="mt-1 text-xl font-bold text-ink-100">{chapter.title}</h1>
          </div>

          <div className="flex items-center gap-4">
            {session && (
              <>
                <button
                  onClick={handleVote}
                  disabled={hasVoted}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    hasVoted
                      ? 'bg-accent-indigo/20 text-accent-indigo'
                      : 'bg-accent-indigo text-ink-900 hover:bg-accent-indigo/90'
                  }`}
                >
                  {hasVoted ? '⭐ Voted' : '⭐ Vote'}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <InteractiveReader
        chapterId={chapter.id}
        chapterContent={chapter.content}
        chapterTitle={chapter.title}
        storyTitle={story.title}
        tokensBalance={tokensBalance}
        subscriptionTier={session?.user?.subscriptionTier || 'FREE'}
        onTokensUpdate={setTokensBalance}
        onInlineCommentAdd={handleCommentAdd}
        inlineComments={comments.map((c: any) => ({
          id: c.id,
          paragraphIndex: c.paragraphIndex,
          userId: c.userId,
          userName: c.user.username,
          content: c.content,
          createdAt: c.createdAt,
        }))}
      />

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex items-center justify-between">
          <Link
            href={`/story/${story.slug}/chapter/${Math.max(1, chapter.number - 1)}`}
            className="rounded-lg border border-ink-700 bg-ink-800 px-4 py-2 text-sm text-ink-300 hover:border-ink-600"
          >
            ← Previous
          </Link>

          <Link
            href={`/story/${story.slug}/chapter/${chapter.number + 1}`}
            className="rounded-lg bg-accent-indigo px-4 py-2 text-sm font-semibold text-ink-900 hover:bg-accent-indigo/90"
          >
            Next Chapter →
          </Link>
        </div>
      </div>
    </div>
  )
}
