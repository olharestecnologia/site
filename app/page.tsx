import Hero from '@/components/Hero'
import About from '@/components/About'
import InstitucionalSection from '@/components/InstitucionalSection'
import TeamSection from '@/components/TeamSection'
import ServicesSection from '@/components/ServicesSection'
import ConveniosSection from '@/components/ConveniosSection'
import ContactSection from '@/components/ContactSection'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <InstitucionalSection />
      <TeamSection />
      <ServicesSection />
      <ConveniosSection />
      <ContactSection />
    </>
  )
}

