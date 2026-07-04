import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullable().optional(),
  price: z.number().min(0, 'Price must be 0 or greater'),
  medium: z.string().min(1, 'Medium is required'),
  dimensions: z.string().min(1, 'Dimensions are required'),
  imageUrl: z.string().url('Must be a valid URL'),
  isAvailable: z.boolean().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = createSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Get highest sortOrder
    const maxSort = await prisma.artwork.findFirst({
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    })

    const { description, isAvailable, ...rest } = result.data

    const artwork = await prisma.artwork.create({
      data: {
        ...rest,
        description: description ?? null,
        isAvailable: isAvailable ?? true,
        sortOrder: (maxSort?.sortOrder ?? 0) + 1,
      },
    })

    return NextResponse.json({ artwork }, { status: 201 })
  } catch (error) {
    console.error(
      'Artwork creation error:',
      error instanceof Error ? error.message : error
    )

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const artworks = await prisma.artwork.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ artworks })
  } catch (error) {
    console.error('Failed to fetch artworks:', error)

    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    )
  }
}