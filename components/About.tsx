import siteData from '@/lib/content.json'

export default function About() {
  const sections = siteData.pages[0].sections || []

  if (!sections.length || !sections[0]) return null

  return (
    <section id="sobre" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Sobre a Olhares */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white p-8 md:p-10 rounded-lg">
            <h2 className="text-2xl font-bold text-primary mb-4 text-center md:text-left">
              {sections[0].title}
            </h2>
            <div className="text-lg text-gray-700 leading-relaxed mb-4 space-y-4">
              {sections[0].content?.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-justify">{paragraph}</p>
              ))}
            </div>
            <p className="text-lg text-gray-600 italic text-justify">
              {siteData.site.tagline}
            </p>
          </div>
        </div>

        {/* O que fazemos */}
        {sections[1] && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {sections[1].title}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {sections[1].items?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-primary to-teal text-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-white/90">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <a
                href="#servicos"
                className="inline-block bg-terracota hover:bg-terracota/90 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                {sections[1].cta?.label}
              </a>
            </div>
          </div>
        )}

        {/* Atendimento Humanizado */}
        {sections[2] && (
          <div className="bg-gray-50 rounded-lg p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {sections[2].title}
            </h2>
            <ul className="grid md:grid-cols-3 gap-6">
              {sections[2].bullets?.map((bullet: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary text-2xl">✓</span>
                  <span className="text-gray-700">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Infraestrutura */}
        {sections[3] && (
          <div className="bg-teal text-white rounded-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {sections[3].title}
            </h2>
            <ul className="grid md:grid-cols-2 gap-6">
              {sections[3].bullets?.map((bullet: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-white text-2xl">✓</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

