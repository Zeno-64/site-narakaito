import { Link } from 'react-router-dom'
import { modelos } from '../data/site'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

export default function Library() {
  return (
    <section className="relative border-y border-ink-800 bg-ink-950 py-24 lg:py-28">
      <div aria-hidden className="ember-field absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle
          eyebrow="Biblioteca de modelos"
          title="Escolha um personagem!"
          blurb="Estes são modelos disponíveis para encomenda. As imagens são as artes de divulgação dos escultores que assinam cada escultura — a sua peça é impressa e pintada aqui no Lab."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modelos.map((modelo, i) => (
            <Reveal key={modelo.nome} delay={(i % 3) * 0.06}>
              <article className="group flex h-full flex-col border border-ink-700 bg-ink-900 transition-colors hover:border-ember-500/70">
                <div className="relative aspect-square overflow-hidden bg-ink-800">
                  <img
                    src={modelo.fotos[0].sm}
                    alt={`Modelo de ${modelo.nome}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg text-bone-100">{modelo.nome}</h3>
                  <p className="eyebrow mt-2 text-[0.625rem] text-bone-600">{modelo.serie}</p>
                  {modelo.escultor && (
                    <p className="mt-4 text-xs text-bone-600">
                      Escultura de {modelo.escultor}
                    </p>
                  )}
                  <Link
                    to={`/peca/${modelo.slug}`}
                    className="eyebrow mt-5 block border border-ink-600 py-3 text-center text-bone-300 transition-colors group-hover:border-ember-500 group-hover:text-bone-100"
                  >
                    Encomendar
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10">
          <a
            href="https://wa.me/5531000000000"
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
