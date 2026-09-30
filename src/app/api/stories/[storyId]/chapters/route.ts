import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: { storyId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, chapterNumber } = body

    const story = await prisma.story.findUnique({
      where: { id: params.storyId },
    })

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    if (story.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const chapter = await prisma.chapter.create({
      data: {
        storyId: params.storyId,
        authorId: session.user.id,
        chapterNumber: chapterNumber || 1,
        title,
        content,
        wordCount: content.split(/\s+/).filter(Boolean).length,
        isPublished: true,
        publishedAt: new Date(),
      },
    })

    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    console.error('Create chapter error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
