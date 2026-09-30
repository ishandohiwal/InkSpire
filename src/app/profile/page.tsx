import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="rounded-2xl border border-ink-700 bg-ink-800 p-8">
        <h1 className="text-3xl font-bold text-ink-100">{user.username}</h1>
        <p className="mt-2 text-ink-400">{user.email}</p>
        <p className="mt-1 inline-flex rounded-full border border-accent-indigo/40 bg-accent-indigo/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent-indigo">
          {user.role}
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-ink-700 bg-ink-900 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-500">Tokens Balance</p>
            <p className="mt-3 text-3xl font-bold text-ink-100">{user.tokensBalance}</p>
          </div>
          <div className="rounded-xl border border-ink-700 bg-ink-900 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-500">Subscription</p>
            <p className="mt-3 text-3xl font-bold text-ink-100">{user.subscriptionTier}</p>
          </div>
          <div className="rounded-xl border border-ink-700 bg-ink-900 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-500">Account Type</p>
            <p className="mt-3 text-3xl font-bold text-ink-100">{user.role}</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button className="w-full rounded-lg border border-ink-700 bg-ink-900 px-5 py-3 font-semibold text-ink-100 transition hover:border-ink-600">
            Settings
          </button>
          <button className="w-full rounded-lg border border-red-700/30 bg-red-900/20 px-5 py-3 font-semibold text-red-400 transition hover:bg-red-900/30">
            Log Out
          </button>
        </div>
      </div>
    </main>
  )
}
