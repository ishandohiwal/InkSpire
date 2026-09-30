import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AuthorDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const stories = await prisma.story.findMany({
    where: { authorId: session.user.id },
    include: {
      chapters: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalReads = stories.reduce((sum, s) => sum + s.totalReads, 0)
  const totalVotes = stories.reduce((sum, s) => sum + s.totalVotes, 0)

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-accent-indigo">Writer Studio</p>
          <h1 className="mt-2 text-4xl font-bold text-ink-100">Your stories</h1>
        </div>

        <Link
          href="/author/new"
          className="rounded-lg bg-accent-indigo px-5 py-3 font-semibold text-ink-900"
        >
          + New Story
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-ink-700 bg-ink-800 p-5">
          <p className="text-sm text-ink-400">Total Reads</p>
          <p className="mt-4 text-3xl font-bold text-ink-100">{totalReads.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-ink-700 bg-ink-800 p-5">
          <p className="text-sm text-ink-400">Votes</p>
          <p className="mt-4 text-3xl font-bold text-ink-100">{totalVotes.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-ink-700 bg-ink-800 p-5">
          <p className="text-sm text-ink-400">Stories</p>
          <p className="mt-4 text-3xl font-bold text-ink-100">{stories.length}</p>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {stories.length === 0 ? (
          <div className="rounded-xl border border-ink-700 bg-ink-800 p-8 text-center">
            <p className="text-ink-400">No stories yet. Start writing!</p>
          </div>
        ) : (
          stories.map((story) => (
            <div
              key={story.id}
              className="flex items-center justify-between rounded-xl border border-ink-700 bg-ink-800 p-5"
            >
              <div>
                <h2 className="text-xl font-semibold text-ink-100">{story.title}</h2>
                <p className="mt-1 text-sm text-ink-400">
                  {story.totalReads.toLocaleString()} reads · {story.chapters.length} chapters
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="rounded-full border border-ink-700 bg-ink-900 px-3 py-1 text-xs uppercase tracking-[0.2em] text-ink-300">
                  {story.status}
                </span>
                <Link
                  href={`/story/${story.slug}`}
                  className="text-sm text-accent-indigo hover:text-accent-indigo/80"
                >
                  View
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
