import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function StoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const story = await prisma.story.findUnique({
    where: { slug: params.slug },
    include: {
      chapters: {
        select: { id: true, number: true, title: true, wordCount: true },
        orderBy: { chapterNumber: 'asc' },
      },
      author: true,
    },
  })

  if (!story) notFound()

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-sm text-ink-400 hover:text-ink-200">
          ← Back to library
        </Link>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-ink-700 bg-ink-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-ink-300">
            {story.category}
          </span>
          <span className="rounded-full border border-accent-indigo/30 bg-accent-indigo/10 px-3 py-1 text-xs text-accent-indigo">
            {story.maturityRating === 'MATURE' ? 'Mature' : 'Everyone'}
          </span>
        </div>
      </div>

      <article className="rounded-2xl border border-ink-700 bg-ink-800 p-6 shadow-2xl">
        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          <div className="overflow-hidden rounded-xl border border-ink-700 bg-ink-900">
            <div className="aspect-[2/3] bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-6">
              <div className="flex h-full items-end">
                <div className="rounded-lg bg-black/20 p-3 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/80">Serial</p>
                  <h1 className="mt-2 text-2xl font-bold text-white">{story.title}</h1>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-accent-indigo">By {story.author.username}</p>
            <h1 className="mt-3 text-4xl font-bold text-ink-100">{story.title}</h1>

            <div className="mt-6 flex flex-wrap gap-3">
              {story.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-ink-700 px-3 py-1 text-xs text-ink-300">
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-300">{story.description}</p>

            <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-ink-700 bg-ink-900 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-ink-500">Reads</p>
                <p className="mt-2 text-2xl font-bold text-ink-100">{story.totalReads}</p>
              </div>
              <div className="rounded-lg border border-ink-700 bg-ink-900 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-ink-500">Votes</p>
                <p className="mt-2 text-2xl font-bold text-ink-100">{story.totalVotes}</p>
              </div>
              <div className="rounded-lg border border-ink-700 bg-ink-900 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-ink-500">Chapters</p>
                <p className="mt-2 text-2xl font-bold text-ink-100">{story.chapters.length}</p>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              {story.chapters.length > 0 && (
                <Link
                  href={`/story/${story.slug}/chapter/${story.chapters[0].number}`}
                  className="rounded-lg bg-accent-indigo px-5 py-3 font-semibold text-ink-900 transition hover:bg-accent-indigo/90"
                >
                  Read Chapter 1
                </Link>
              )}
              <button className="rounded-lg border border-ink-700 bg-ink-900 px-5 py-3 font-semibold text-ink-100 transition hover:border-ink-600">
                Add to Library
              </button>
            </div>
          </div>
        </div>
      </article>

      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-semibold text-ink-100">Chapter List</h2>

        <div className="space-y-3">
          {story.chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/story/${story.slug}/chapter/${chapter.number}`}
              className="group flex items-center justify-between rounded-xl border border-ink-700 bg-ink-800 px-5 py-4 transition hover:border-accent-indigo/40 hover:bg-ink-800/70"
            >
              <div>
                <p className="text-sm text-ink-500">Chapter {chapter.number}</p>
                <h3 className="mt-1 text-lg font-medium text-ink-100">{chapter.title}</h3>
              </div>
              <div className="flex items-center gap-3 text-sm text-ink-400">
                <span>{chapter.wordCount} words</span>
                <span className="text-accent-indigo transition group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
