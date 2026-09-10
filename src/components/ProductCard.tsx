import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Peca } from '../data/site'
import { useArrastoHorizontal } from '../lib/arrasto'

export default function ProductCard({ product }: { product: Peca }) {
  const [i, setI] = useState(0)
  const total = product.fotos.length

  const passar = (delta: number) => setI((v) => (v + delta + total) % total)
  const arrasto = useArrastoHorizontal({ aoArrastar: passar })

  return (
    <article className="group flex h-full flex-col border border-ink-700 bg-ink-850 transition-colors hover:border-ember-500/70">
      <div
        className="relative aspect-4/5 touch-pan-y select-none overflow-hidden bg-ink-800"
        {...arrasto}
      >
        {/* A foto leva para a página da peça, igual ao botão lá embaixo. As
            setas e os pontos ficam FORA deste link, como irmãos: assim passar
            de foto não navega junto. */}
        <Link
          to={`/peca/${product.slug}`}
          aria-label={`Ver ${product.nome}`}
          draggable={false}
          className="absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ember-300"
        >
          {product.fotos.map((foto, idx) => (
            <img
              key={foto.sm}
              src={foto.sm}
              alt={`${product.nome} — foto ${idx + 1}`}
              loading={idx === 0 ? 'eager' : 'lazy'}
              draggable={false}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                idx === i ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </Link>

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
        <h3 className="font-display text-xl text-bone-100">{product.nome}</h3>
        <p className="eyebrow mt-2 text-bone-600">{product.serie}</p>

        {/* As fotos são todas do escultor, não nossas, e isso precisa estar dito. */}
        <p className="mt-3 text-xs text-bone-600">Arte de divulgação</p>
        {product.escultor && (
          <p className="text-xs text-bone-600">
            {product.escultor}
            {product.estudio && ` · ${product.estudio}`}
          </p>
        )}
        <p className="mt-5 text-sm text-bone-300">{product.preco ?? 'Orçamento sob consulta'}</p>
        <Link
          to={`/peca/${product.slug}`}
          className="eyebrow mt-6 border border-ink-600 py-3 text-center text-bone-300 transition-colors group-hover:border-ember-500 group-hover:text-bone-100"
        >
          Encomendar
        </Link>
      </div>
    </article>
  )
}
