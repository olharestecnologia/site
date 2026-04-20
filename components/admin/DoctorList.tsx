'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DoctorRow {
  id: string
  name: string
  crm: string
  rqe: string | null
  photoUrl: string | null
  areas: string[]
  displayOrder: number
  allAges: boolean
  minAge: number | null
}

export default function DoctorList({ doctors }: { doctors: DoctorRow[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remover ${name}? Essa ação não pode ser desfeita.`)) return
    setDeletingId(id)
    setError(null)
    try {
      const res = await fetch(`/api/admin/doctors/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        setError('Falha ao remover. Tente novamente.')
        return
      }
      router.refresh()
    } catch {
      setError('Erro de rede.')
    } finally {
      setDeletingId(null)
    }
  }

  if (doctors.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500">
        Nenhum médico cadastrado ainda.
        <div className="mt-3">
          <Link href="/admin/medicos/novo" className="text-primary hover:underline">
            Cadastrar o primeiro
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div
          role="alert"
          className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2"
        >
          {error}
        </div>
      )}
      <ul className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
        {doctors.map((doctor) => (
          <li
            key={doctor.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4"
            data-testid={`doctor-row-${doctor.id}`}
          >
            <div className="flex items-start gap-3 sm:items-center sm:gap-4 flex-1 min-w-0">
              <div className="w-14 h-14 shrink-0 rounded-full bg-gray-100 overflow-hidden relative">
                {doctor.photoUrl ? (
                  <Image
                    src={doctor.photoUrl}
                    alt={doctor.name}
                    fill
                    sizes="56px"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    s/foto
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900">{doctor.name}</div>
                <div className="text-xs text-gray-500">
                  {doctor.crm}
                  {doctor.rqe ? ` · ${doctor.rqe}` : ''}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {doctor.areas.slice(0, 3).join(' · ')}
                  {doctor.areas.length > 3 ? ` +${doctor.areas.length - 3}` : ''}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 shrink-0 pl-[68px] sm:pl-0">
              <Link
                href={`/admin/medicos/${doctor.id}`}
                className="text-sm text-primary hover:underline px-2 py-1"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(doctor.id, doctor.name)}
                disabled={deletingId === doctor.id}
                className="text-sm text-red-600 hover:text-red-700 px-2 py-1 disabled:opacity-50"
              >
                {deletingId === doctor.id ? 'Removendo…' : 'Remover'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
