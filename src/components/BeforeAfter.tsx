import { comparador } from '../data/site'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

const paineis = [
  {
    src: comparador.cru,
    alt: 'A peça em resina crua, cinza, antes da pintura',
    rotulo: 'Resina crua',
    nota: 'Direto da impressora, lixada e sem cor.',
    destaque: false,
  },
  {
    src: comparador.pintado,
    alt: 'A mesma peça depois da pintura à mão',
    rotulo: 'Pintada à mão',
    nota: 'Aerógrafo, pincel e lavagem de sombra.',
    destaque: true,
  },
]

export default function BeforeAfter() {
  return (
    <section className="bg-ink-900 py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionTitle
          eyebrow="Antes & depois"
          title="O que a pintura à mão muda"
          align="center"
          blurb="Toda peça começa cinza e sem graça. O que dá vida a ela são as horas de aerógrafo, pincel e lavagem de sombra."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {paineis.map((painel, i) => (
            <Reveal key={painel.rotulo} delay={i * 0.1}>
              <figure
                className={`h-full border bg-ink-850 ${
                  painel.destaque ? 'border-ember-500/60' : 'border-ink-700'
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-ink-800">
                  <img
                    src={painel.src}
                    alt={painel.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="flex items-baseline justify-between gap-4 border-t border-ink-700 px-5 py-4">
                  <span
                    className={`eyebrow ${painel.destaque ? 'text-ember-200' : 'text-bone-500'}`}
                  >
                    {painel.rotulo}
                  </span>
                  <span className="text-xs text-bone-600">{painel.nota}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-bone-600">
          Escultura de Michel Rodrigues.
        </p>
      </div>
    </section>
  )
}
