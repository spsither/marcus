import { NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'marcus2024'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}