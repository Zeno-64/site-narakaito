import { equipment } from '../data/site'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

export default function Atelier() {
  return (
    <section id="atelie" className="border-y border-ink-800 bg-ink-850 py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle
          eyebrow="O ateliê por dentro"
          title="Ferramenta boa aparece no acabamento"
          blurb="Não dá para entregar detalhe fino com equipamento improvisado. Este é o que usamos em cada etapa da peça."
        />

        <div className="mt-14 grid gap-px bg-ink-800 sm:grid-cols-2 lg:grid-cols-4">
          {equipment.map((item, i) => (
            <Reveal key={item.model} delay={i * 0.07} className="bg-ink-850">
              <div className="h-full px-7 py-9">
                <p className="eyebrow text-ember-300">{item.brand}</p>
                <h3 className="mt-3 font-display text-xl text-bone-100">{item.model}</h3>
                <p className="mt-4 text-sm leading-relaxed text-bone-500">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
