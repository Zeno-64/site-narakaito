import { useState } from 'react'
import type { Product } from '../data/site'
import { whatsappUrl } from '../data/site'

export default function ProductCard({ product }: { product: Product }) {
  const [i, setI] = useState(0)
  const total = product.fotos.length

  const passar = (delta: number) => setI((v) => (v + delta + total) % total)

  return (
    <article className="group flex h-full flex-col border border-ink-700 bg-ink-850 transition-colors hover:border-ember-500/70">
      <div className="relative aspect-4/5 overflow-hidden bg-ink-800">
        {product.fotos.map((foto, idx) => (
          <img
            key={foto.sm}
            src={foto.sm}
            alt={`${product.name} — foto ${idx + 1}`}
            loading={idx === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              idx === i ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {product.badges && (
          <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-2">
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

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => passar(-1)}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-ink-950/70 text-bone-300 opacity-0 transition-opacity hover:text-ember-200 focus-visible:opacity-100 group-hover:opacity-100"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => passar(1)}
              aria-label="Próxima foto"
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-ink-950/70 text-bone-300 opacity-0 transition-opacity hover:text-ember-200 focus-visible:opacity-100 group-hover:opacity-100"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {product.fotos.map((foto, idx) => (
                <span
                  key={foto.sm}
                  className={`h-1 w-4 transition-colors ${
                    idx === i ? 'bg-ember-400' : 'bg-bone-600/50'
                  }`}
                />
              ))}
            </div>
          </>
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
