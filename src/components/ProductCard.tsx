import type { Product } from '../data/site'
import { whatsappUrl } from '../data/site'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col border border-ink-700 bg-ink-850 transition-colors hover:border-ember-500/70">
      <div className="relative aspect-square overflow-hidden bg-ink-800">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(65%_55%_at_50%_40%,rgba(176,51,44,0.22),transparent_72%)]"
        />
        {/* Placeholder até escolhermos quais fotos de public/images/{product.folder} entram */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <img src="/images/logo-mark.png" alt="" aria-hidden className="h-14 w-14 opacity-25" />
          <p className="eyebrow text-bone-600">{product.folder}</p>
        </div>

        {product.badges && (
          <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className="eyebrow bg-ink-950/85 px-3 py-1.5 text-[0.625rem] text-ember-200"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl text-bone-100">{product.name}</h3>
        <p className="eyebrow mt-2 text-bone-600">{product.series}</p>
        <p className="mt-5 text-sm text-bone-300">{product.price ?? 'Orçamento sob consulta'}</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="eyebrow mt-6 border border-ink-600 py-3 text-center text-bone-300 transition-colors group-hover:border-ember-500 group-hover:text-bone-100"
        >
          Encomendar
        </a>
      </div>
    </article>
  )
}
