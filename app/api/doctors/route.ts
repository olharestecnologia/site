import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
  })
  return NextResponse.json({ doctors }, { headers: { 'Cache-Tag': 'doctors' } })
}
