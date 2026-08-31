import { collections } from '../data/site'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

export default function Collections() {
  return (
    <section id="colecoes" className="border-t border-ink-800 bg-ink-900 py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle
          eyebrow="Mais procuradas"
          title="Coleções em alta"
          align="center"
          blurb="Três frentes que saem do ateliê o ano inteiro. Se a sua ideia não cabe em nenhuma delas, a gente esculpe do zero."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {collections.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <a
                href="#catalogo"
                className="group relative flex h-full min-h-72 flex-col justify-end overflow-hidden border border-ink-700 bg-ink-850 p-7 transition-colors hover:border-ember-500/70"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_120%,rgba(176,51,44,0.30),transparent_70%)] transition-opacity duration-500 group-hover:opacity-150"
                />
                <div className="relative">
                  <p className="eyebrow text-ember-300">{item.caption}</p>
                  <h3 className="mt-3 font-display text-2xl text-bone-100">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone-500">{item.blurb}</p>
                  <p className="eyebrow mt-6 text-bone-300 transition-colors group-hover:text-ember-200">
                    Ver coleção →
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
