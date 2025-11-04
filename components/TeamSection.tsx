import Image from 'next/image'
import siteData from '@/lib/content.json'

export default function TeamSection() {
  const doctors = siteData.pages[2]?.doctors

  // Map doctors with available photos
  const doctorPhotos: Record<string, string> = {
    'Dr. Antonio Augusto de Morais Pires': '/images/doctors/dr-antonio.jpg',
    'Dra. Andreia Miriam Lopes Sansoni': '/images/doctors/dra-andreia.jpg',
    'Dr. Alvaro Ribeiro Vaz de Faria': '/images/doctors/dr-alvaro.jpg',
    'Dr. Caio Godinho Caldeira': '/images/doctors/dr-caio.jpg',
    'Dr. Gustavo Gonçalves Rodrigues': '/images/doctors/dr-gustavo.jpg',
    'Dra. Júlia Calixto Guimarães Giffoni': '/images/doctors/dra-julia.jpg',
    'Dra. Rafaela de Morais Miranda': '/images/doctors/dra-rafaela.jpg',
    'Dr. Raphael Coelho Santos': '/images/doctors/dr-raphael.jpg',
    'Dra. Silvia Nogueira Marx Gonzaga': '/images/doctors/dra-silvia.jpg',
    'Dra. Thaís Godinho Caldeira': '/images/doctors/dra-thais.png',
    'Dra. Bruna Cristina Leonel S. Barbosa': '/images/doctors/br-bruna.png',
    'Dr. Samuel B. Francisco de Souza': '/images/doctors/dr-samuel.jpg',
  }

  // Function to get initials from doctor name
  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`
    }
    return name[0]
  }

  if (!doctors) return null

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
          {doctors.map((doctor: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {doctorPhotos[doctor.name] ? (
                <div className="relative h-96 bg-gray-200">
                  <Image
                    src={doctorPhotos[doctor.name]}
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
                <p className="text-sm text-gray-600 mb-1">{doctor.crm}</p>
                <p className="text-sm text-gray-600 mb-4">{doctor.rqe}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Especialidades:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.areas.map((area: string, idx: number) => (
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

