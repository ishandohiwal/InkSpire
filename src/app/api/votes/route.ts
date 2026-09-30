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
    const { chapterId } = body

    if (!chapterId) {
      return NextResponse.json({ error: 'Missing chapterId' }, { status: 400 })
    }

    const existing = await prisma.vote.findUnique({
      where: {
        chapterId_userId: {
          chapterId,
          userId: session.user.id,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Already voted' }, { status: 409 })
    }

    const vote = await prisma.vote.create({
      data: {
        chapterId,
        userId: session.user.id,
      },
    })

    await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        votes: { increment: 1 },
      },
    })

    return NextResponse.json(vote, { status: 201 })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
