import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const inquiries = await prisma.purchaseInquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: { artwork: { select: { id: true, title: true, price: true } } },
    })
    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error('Failed to fetch inquiries:', error)
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
  }
}