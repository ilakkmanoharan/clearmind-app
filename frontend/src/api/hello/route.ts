// src/app/api/hello/route.ts

export const runtime = 'edge';

import { NextResponse } from 'next/server'


export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization')
  
  if (!authHeader || authHeader !== 'Bearer my-secret-token') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ message: 'Hello, authorized user!' })
}
