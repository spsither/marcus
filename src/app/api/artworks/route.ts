import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const artworks = await db.artwork.findMany({
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