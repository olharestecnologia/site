import Image from 'next/image'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

const getDoctors = unstable_cache(
  async () =>
    prisma.doctor.findMany({
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    }),
  ['team-doctors'],
  { revalidate: 60, tags: ['doctors'] }
)

function getInitials(name: string) {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`
  }
  return name[0]
}

export default async function TeamSection() {
  const doctors = await getDoctors()
  if (doctors.length === 0) return null

  return (
    <section id="corpo-clinico" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Corpo Clínico
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Equipe altamente qualificada e especializada em oftalmologia
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {doctor.photoUrl ? (
                <div className="relative h-96 bg-gray-200">
                  <Image
                    src={doctor.photoUrl}
                    alt={doctor.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              ) : (
                <div className="relative h-96 bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-5xl font-bold text-white">
                        {getInitials(doctor.name)}
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium px-4">
                      Foto em breve
                    </p>
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {doctor.name}
                </h3>
                <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                  Especialista
                </span>
                <p className={`text-sm text-gray-600 ${doctor.rqe ? 'mb-1' : 'mb-4'}`}>
                  {doctor.crm}
                </p>
                {doctor.rqe && (
                  <p className="text-sm text-gray-600 mb-4">{doctor.rqe}</p>
                )}

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Especialidades:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.areas.map((area, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
