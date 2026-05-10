import { NextResponse } from 'next/server'

// In-memory store (resets on redeploy, but works perfectly on Vercel)
let memoryStore = {}

// GET /api/todos
export async function GET() {
  try {
    return NextResponse.json(memoryStore)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/todos
export async function POST(req) {
  try {
    const body = await req.json()
    const { date, todos } = body

    if (!date || !Array.isArray(todos)) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }

    memoryStore[date] = todos

    return NextResponse.json({ success: true, date, todos })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
