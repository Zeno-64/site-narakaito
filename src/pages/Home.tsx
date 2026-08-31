import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import About from '../components/About'
import Atelier from '../components/Atelier'
import BeforeAfter from '../components/BeforeAfter'
import CaixaReveal from '../components/CaixaReveal'
import Catalog from '../components/Catalog'
import Differentials from '../components/Differentials'
import Faq from '../components/Faq'
import Hero from '../components/Hero'
import Library from '../components/Library'
import { definirMeta } from '../lib/meta'

export default function Home() {
  const { hash } = useLocation()

  // Chegando de outra página com âncora (/#catalogo), o alvo só existe
  // depois que a home monta — por isso o scroll acontece aqui.
  useEffect(() => {
    definirMeta(
      'Narakaito Lab · Colecionáveis em Resina Pintados à Mão',
      'Figures colecionáveis em resina premium, impressas em alta resolução e pintadas à mão, peça por peça. Sob encomenda, com envio para todo o Brasil.',
    )
    if (!hash) return
    const alvo = document.querySelector(hash)
    if (alvo) alvo.scrollIntoView()
  }, [hash])

  return (
    <main>
      <Hero />
      <Differentials />
      <Catalog />
      <CaixaReveal />
      <Library />
      <BeforeAfter />
      <Atelier />
      <About />
      <Faq />
    </main>
  )
}
