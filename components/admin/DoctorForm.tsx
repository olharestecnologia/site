'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

interface DoctorInitial {
  id: string
  name: string
  crm: string
  rqe: string | null
  photoUrl: string | null
  areas: string[]
  minAge: number | null
  allAges: boolean
  displayOrder: number
}

type Props =
  | { mode: 'create'; doctor?: undefined }
  | { mode: 'edit'; doctor: DoctorInitial }

export default function DoctorForm(props: Props) {
  const router = useRouter()
  const isEdit = props.mode === 'edit'
  const initial = props.doctor

  const [name, setName] = useState(initial?.name ?? '')
  const [crm, setCrm] = useState(initial?.crm ?? '')
  const [rqe, setRqe] = useState(initial?.rqe ?? '')
  const [photoUrl, setPhotoUrl] = useState<string | null>(initial?.photoUrl ?? null)
  const [areasText, setAreasText] = useState((initial?.areas ?? []).join(', '))
  const [allAges, setAllAges] = useState(initial?.allAges ?? true)
  const [minAge, setMinAge] = useState<string>(
    initial?.minAge != null ? String(initial.minAge) : ''
  )
  const [displayOrder, setDisplayOrder] = useState<string>(
    String(initial?.displayOrder ?? 0)
  )

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) {
        setError(json?.error === 'file_too_large' ? 'Arquivo maior que 5MB.' : 'Falha no upload.')
        return
      }
      setPhotoUrl(json.url)
    } catch {
      setError('Erro de rede no upload.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const areas = areasText
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean)

    if (areas.length === 0) {
      setError('Informe ao menos uma especialidade.')
      setSaving(false)
      return
    }

    const payload = {
      name,
      crm,
      rqe: rqe.trim() || null,
      photoUrl: photoUrl || null,
      areas,
      allAges,
      minAge: allAges ? null : minAge ? Number(minAge) : null,
      displayOrder: displayOrder ? Number(displayOrder) : 0,
    }

    try {
      const url = isEdit
        ? `/api/admin/doctors/${initial!.id}`
        : '/api/admin/doctors'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => null)
        setError(
          json?.issues?.formErrors?.[0] ??
            json?.error ??
            'Falha ao salvar.'
        )
        return
      }
      router.push('/admin/medicos')
      router.refresh()
    } catch {
      setError('Erro de rede.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 bg-white border border-gray-200 rounded-lg p-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nome completo
        </label>
        <input
          id="name"
          required
          minLength={3}
          maxLength={200}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="crm" className="block text-sm font-medium text-gray-700 mb-1">
            CRM
          </label>
          <input
            id="crm"
            required
            value={crm}
            onChange={(e) => setCrm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="CRM/MG 00000"
          />
        </div>
        <div>
          <label htmlFor="rqe" className="block text-sm font-medium text-gray-700 mb-1">
            RQE (opcional)
          </label>
          <input
            id="rqe"
            value={rqe}
            onChange={(e) => setRqe(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="RQE 00000"
          />
        </div>
      </div>

      <div>
        <label htmlFor="areas" className="block text-sm font-medium text-gray-700 mb-1">
          Especialidades
        </label>
        <input
          id="areas"
          required
          value={areasText}
          onChange={(e) => setAreasText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Catarata, Retina, Glaucoma"
        />
        <p className="text-xs text-gray-500 mt-1">Separe por vírgulas.</p>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">Foto</span>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden relative shrink-0">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt="Foto do médico"
                fill
                sizes="80px"
                className="object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                s/foto
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={uploading}
              className="block text-sm"
            />
            {uploading && <p className="text-xs text-gray-500 mt-1">Enviando…</p>}
            {photoUrl && !uploading && (
              <button
                type="button"
                onClick={() => setPhotoUrl(null)}
                className="text-xs text-red-600 hover:underline mt-1"
              >
                Remover foto
              </button>
            )}
            <p className="text-xs text-gray-500 mt-1">JPG, PNG ou WEBP até 5MB.</p>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md p-4 space-y-3">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={allAges}
            onChange={(e) => setAllAges(e.target.checked)}
          />
          Atende todas as idades
        </label>
        {!allAges && (
          <div>
            <label htmlFor="minAge" className="block text-sm font-medium text-gray-700 mb-1">
              Idade mínima
            </label>
            <input
              id="minAge"
              type="number"
              min={0}
              max={120}
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-1">
          Ordem de exibição
        </label>
        <input
          id="displayOrder"
          type="number"
          min={0}
          max={9999}
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-gray-500 mt-1">
          Menor número aparece primeiro na lista pública.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2"
        >
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2 rounded-md disabled:opacity-50"
        >
          {saving ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Cadastrar médico'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/medicos')}
          className="text-gray-600 hover:text-gray-900"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
