import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DoctorForm from '@/components/admin/DoctorForm'

export const dynamic = 'force-dynamic'

export default async function EditarMedicoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const doctor = await prisma.doctor.findUnique({ where: { id } })
  if (!doctor) notFound()

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/medicos" className="text-sm text-primary hover:underline">
          ← Voltar para a lista
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          Editar: {doctor.name}
        </h1>
      </div>
      <DoctorForm
        mode="edit"
        doctor={{
          id: doctor.id,
          name: doctor.name,
          crm: doctor.crm,
          rqe: doctor.rqe,
          photoUrl: doctor.photoUrl,
          areas: doctor.areas,
          minAge: doctor.minAge,
          allAges: doctor.allAges,
          displayOrder: doctor.displayOrder,
        }}
      />
    </div>
  )
}
