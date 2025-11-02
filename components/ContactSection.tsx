import { MapPin, Phone, Clock, Mail } from 'lucide-react'
import siteData from '@/lib/content.json'

export default function ContactSection() {
  const address = siteData.site.contact.address
  const phones = siteData.site.contact.phones

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
    `${address.street}, ${address.neighborhood}, ${address.city} - ${address.state}`
  )}`

  return (
    <section id="contato" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Fale Conosco
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos prontos para cuidar da saúde dos seus olhos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Informações de Contato */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Informações de Contato
            </h3>
            
            <div className="space-y-6">
              {/* Endereço */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Endereço</h4>
                  <p className="text-gray-600">
                    {address.street}<br />
                    {address.neighborhood}<br />
                    {address.city} - {address.state}<br />
                    CEP: {address.postal_code}
                  </p>
                </div>
              </div>

              {/* Telefones */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Telefones</h4>
                  {phones.map((phone, index) => (
                    <p key={index} className="text-gray-600">
                      <strong>{phone.label}:</strong>{' '}
                      <a
                        href={`tel:${phone.number}`}
                        className="hover:text-primary transition-colors"
                      >
                        {phone.number}
                      </a>
                    </p>
                  ))}
                </div>
              </div>

              {/* Horários */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Horário de Atendimento
                  </h4>
                  <p className="text-gray-600">
                    Segunda a Sexta: 07:45 às 18:00<br />
                    Sábado: 07:45 às 12:00
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div id="agendar" className="mt-8 bg-gradient-to-r from-primary to-teal text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Agende sua Consulta</h3>
              <p className="mb-6">
                Entre em contato conosco para marcar sua consulta ou tirar suas dúvidas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://wa.me/55${phones[1].number.replace(/[^0-9]/g, '')}?text=Olá! Gostaria de agendar uma consulta.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors text-center"
                >
                  WhatsApp
                </a>
                <a
                  href={`tel:${phones[0].number}`}
                  className="md:hidden bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors text-center"
                >
                  Ligar Agora
                </a>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Nossa Localização
            </h3>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                `${address.street}, ${address.neighborhood}, ${address.city} - ${address.state}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal transition-colors text-center mb-4"
            >
              Como Chegar
            </a>
            <div className="bg-gray-200 rounded-lg overflow-hidden h-[500px]">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Clínica Olhares"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

