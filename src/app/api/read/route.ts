import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { chapterId, storyId, scrollPosition, tokensSpent } = body

    const progress = await prisma.readingProgress.upsert({
      where: {
        userId_storyId_chapterId: {
          userId: session.user.id,
          storyId,
          chapterId,
        },
      },
      update: {
        scrollPosition,
        tokensSpentToday: { increment: tokensSpent || 0 },
        lastReadAt: new Date(),
      },
      create: {
        userId: session.user.id,
        storyId,
        chapterId,
        scrollPosition,
        tokensSpentToday: tokensSpent || 0,
      },
    })

    // Deduct tokens from user if free tier
    if (tokensSpent && tokensSpent > 0) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      })

      if (user?.subscriptionTier === 'FREE') {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            tokensBalance: { decrement: tokensSpent },
          },
        })
      }
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Read tracking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
