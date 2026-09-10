import { pecas, whatsappUrl } from '../data/site'
import ProductCard from './ProductCard'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

/**
 * O catálogo inteiro numa seção só.
 *
 * Antes eram duas — "Saindo da bancada" com as peças fotografadas aqui e esta
 * com os modelos — em cards de desenhos diferentes, o que fazia a maior parte
 * do que a gente oferece parecer categoria inferior. Agora todas usam o mesmo
 * card, com carrossel de fotos, e o que muda entre elas é o crédito da imagem.
 *
 * O id continua sendo `catalogo`: é para cá que apontam o menu, o rodapé, o
 * botão do hero e a trilha da página de peça.
 */
export default function Library() {
  return (
    <section id="catalogo" className="relative border-y border-ink-800 bg-ink-950 py-24 lg:py-28">
      <div aria-hidden className="ember-field absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle
          eyebrow="Catálogo"
          title="Escolha um personagem!"
          blurb="Tudo que dá para encomendar. As imagens são a arte de divulgação de quem esculpiu cada modelo — a sua peça é impressa e pintada aqui no lab."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pecas.map((peca, i) => (
            <Reveal key={peca.slug} delay={(i % 3) * 0.06}>
              <ProductCard product={peca} />
            </Reveal>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="eyebrow inline-block border border-ember-500/60 px-10 py-4 text-bone-100 transition-colors hover:bg-ember-700/30"
          >
            Não achou? Manda o personagem →
          </a>
        </div>
      </div>
    </section>
  )
}
