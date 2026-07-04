import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  artworkId: z.string().min(1, 'Artwork ID is required'),
  message: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = inquirySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, phone, artworkId, message } = result.data

    // Verify the artwork exists and is available
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
    })

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      )
    }

    if (!artwork.isAvailable) {
      return NextResponse.json(
        { error: 'This artwork is no longer available' },
        { status: 400 }
      )
    }

    await prisma.purchaseInquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        artworkId,
        message: message || null,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: `Your inquiry for "${artwork.title}" has been received. Marcus will contact you shortly to discuss the purchase.`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Purchase inquiry error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}