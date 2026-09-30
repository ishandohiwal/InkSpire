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
    const { chapterId, paragraphIndex, content } = body

    if (!chapterId || paragraphIndex === undefined || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const comment = await prisma.inlineComment.create({
      data: {
        chapterId,
        userId: session.user.id,
        paragraphIndex,
        content,
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
