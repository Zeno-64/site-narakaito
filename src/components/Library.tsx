import { library, whatsappUrl } from '../data/site'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

export default function Library() {
  return (
    <section className="relative border-y border-ink-800 bg-ink-950 py-24 lg:py-28">
      <div aria-hidden className="ember-field absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle
          eyebrow="Biblioteca de modelos"
          title="Escolhe o personagem que a gente esculpe"
          blurb="Trabalhamos com uma biblioteca grande de esculturas digitais e também com modelagem sob medida. Alguns nomes que já saíram daqui:"
        />

        <div className="mt-12 grid grid-cols-2 gap-px bg-ink-800 sm:grid-cols-3 lg:grid-cols-5">
          {library.map((item, i) => (
            <Reveal key={item.name} delay={(i % 5) * 0.05} className="bg-ink-900">
              <div className="h-full px-5 py-6">
                <p className="font-display text-lg text-bone-100">{item.name}</p>
                <p className="eyebrow mt-2 text-[0.625rem] text-bone-600">{item.series}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="eyebrow text-ember-200 transition-colors hover:text-ember-300"
          >
            Não achou? Manda o personagem →
          </a>
        </div>
      </div>
    </section>
  )
}
