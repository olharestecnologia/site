export default function InstitucionalSection() {
  return (
    <section id="institucional" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nossa Essência
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça os princípios que norteiam nossa atuação
          </p>
        </div>

        {/* Missão e Visão */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Missão */}
          <div className="bg-white p-8 md:p-10 rounded-lg">
            <h3 className="text-2xl font-bold text-primary mb-4 text-center md:text-left">Missão</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Oferecer cuidados oftalmológicos de excelência, com foco no bem-estar visual dos nossos pacientes, 
              por meio de profissionais qualificados, tecnologia de ponta e um atendimento humanizado a toda 
              população do Centro-oeste de Minas Gerais.
            </p>
          </div>

          {/* Visão */}
          <div className="bg-white p-8 md:p-10 rounded-lg">
            <h3 className="text-2xl font-bold text-primary mb-4 text-center md:text-left">Visão</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Ser referência em saúde ocular, reconhecida pela qualidade dos serviços prestados e 
              compromisso com a satisfação dos pacientes.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="bg-white rounded-lg p-8 md:p-12">
          <h3 className="text-2xl font-bold text-primary mb-8 text-center">Nossos Valores</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Ética e Transparência</h4>
              <p className="text-gray-700">
                Atuamos com honestidade, responsabilidade e clareza em todas as nossas ações.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Compromisso com o paciente</h4>
              <p className="text-gray-700">
                Colocamos o paciente no centro de tudo o que fazemos, garantindo um atendimento dedicado e respeitoso.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Humanização</h4>
              <p className="text-gray-700">
                Tratamos cada paciente com empatia, acolhimento e atenção às suas necessidades individuais.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Excelência</h4>
              <p className="text-gray-700">
                Buscamos sempre a qualidade em cada serviço prestado, com profissionais qualificados e tecnologia de ponta.
              </p>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Valorização dos colaboradores</h4>
              <p className="text-gray-700">
                Reconhecemos que o sucesso da clínica depende do trabalho de nossa equipe. Investimos no 
                desenvolvimento profissional e pessoal de nossos colaboradores, criando um ambiente de trabalho 
                respeitoso, colaborativo e motivador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

