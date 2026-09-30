import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      include: {
        chapters: {
          select: { id: true, number: true, title: true, wordCount: true },
        },
        author: {
          select: { id: true, username: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(stories)
  } catch (error) {
    console.error('Get stories error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, category, tags, maturityRating } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const story = await prisma.story.create({
      data: {
        title,
        slug,
        description,
        authorId: session.user.id,
        category,
        tags: Array.isArray(tags) ? tags : [],
        maturityRating: maturityRating === 'MATURE' ? 'MATURE' : 'EVERYONE',
        status: 'ONGOING',
      },
    })

    return NextResponse.json(story, { status: 201 })
  } catch (error) {
    console.error('Create story error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
