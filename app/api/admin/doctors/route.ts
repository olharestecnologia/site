import { NextResponse, type NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { doctorSchema } from '@/lib/validators'

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
  })
  return NextResponse.json({ doctors })
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null)
  const parsed = doctorSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_input', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data = parsed.data
  const doctor = await prisma.doctor.create({
    data: {
      name: data.name,
      crm: data.crm,
      rqe: data.rqe ?? null,
      photoUrl: data.photoUrl ?? null,
      areas: data.areas,
      minAge: data.allAges ? null : data.minAge ?? null,
      allAges: data.allAges,
      displayOrder: data.displayOrder,
    },
  })

  revalidateTag('doctors')
  return NextResponse.json({ doctor }, { status: 201 })
}
