import Link from 'next/link'
import DoctorForm from '@/components/admin/DoctorForm'

export const dynamic = 'force-dynamic'

export default function NovoMedicoPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/medicos" className="text-sm text-primary hover:underline">
          ← Voltar para a lista
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">Novo médico</h1>
      </div>
      <DoctorForm mode="create" />
    </div>
  )
}
