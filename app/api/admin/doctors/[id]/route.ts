import { NextResponse, type NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { doctorSchema } from '@/lib/validators'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  const doctor = await prisma.doctor.findUnique({ where: { id } })
  if (!doctor) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  return NextResponse.json({ doctor })
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  const json = await req.json().catch(() => null)
  const parsed = doctorSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_input', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data = parsed.data
  try {
    const doctor = await prisma.doctor.update({
      where: { id },
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
    return NextResponse.json({ doctor })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }
    throw e
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  try {
    await prisma.doctor.delete({ where: { id } })
    revalidateTag('doctors')
    return NextResponse.json({ ok: true })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }
    throw e
  }
}
