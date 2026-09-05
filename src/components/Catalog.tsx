import { products } from '../data/site'
import ProductCard from './ProductCard'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'
import { whatsappUrl } from '../data/site'

export default function Catalog() {
  return (
    <section id="catalogo" className="bg-ink-900 py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle
          eyebrow="Figures em destaque"
          title="Saindo da bancada"
          blurb="Peças que já passaram pela nossa bancada, fotografadas depois de prontas. Todas sob encomenda."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={(i % 3) * 0.06}>
              <ProductCard product={product} />
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
            Pedir uma peça sob medida
          </a>
        </div>
      </div>
    </section>
  )
}
