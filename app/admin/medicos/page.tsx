import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DoctorList from '@/components/admin/DoctorList'

export const dynamic = 'force-dynamic'

export default async function MedicosPage() {
  const doctors = await prisma.doctor.findMany({
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Médicos</h1>
          <p className="text-sm text-gray-500">
            {doctors.length} {doctors.length === 1 ? 'médico cadastrado' : 'médicos cadastrados'}
          </p>
        </div>
        <Link
          href="/admin/medicos/novo"
          className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          Novo médico
        </Link>
      </div>
      <DoctorList doctors={doctors} />
    </div>
  )
}
