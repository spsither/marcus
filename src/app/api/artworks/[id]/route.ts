import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  price: z.number().min(0).optional(),
  medium: z.string().optional(),
  dimensions: z.string().optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const result = updateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const existing = await prisma.artwork.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      )
    }

    const updated = await prisma.artwork.update({
      where: { id },
      data: result.data,
    })

    return NextResponse.json({ artwork: updated })
  } catch (error) {
    console.error('Artwork update error:', error)
    return NextResponse.json(
      { error: 'Something went wrong', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const existing = await prisma.artwork.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      )
    }

    await prisma.purchaseInquiry.deleteMany({
      where: { artworkId: id },
    })

    await prisma.artwork.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Artwork deletion error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}