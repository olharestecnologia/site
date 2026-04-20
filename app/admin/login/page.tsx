import { Suspense } from 'react'
import LoginForm from '@/components/admin/LoginForm'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Admin Olhares</h1>
        <p className="text-sm text-gray-500 mb-6">Acesso restrito.</p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
