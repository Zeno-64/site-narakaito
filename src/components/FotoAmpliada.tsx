import { useEffect, useRef } from 'react'
import type { Foto } from '../data/site'
import { useArrastoHorizontal } from '../lib/arrasto'

type Props = {
  fotos: Foto[]
  nome: string
  indice: number
  aoTrocar: (i: number) => void
  aoFechar: () => void
}

/**
 * A foto ocupando a tela inteira, com seta de cada lado.
 *
 * Fica acima dos atalhos flutuantes (que são z-50), senão o botão do WhatsApp
 * aparece por cima da foto ampliada.
 */
export default function FotoAmpliada({ fotos, nome, indice, aoTrocar, aoFechar }: Props) {
  const total = fotos.length
  const caixa = useRef<HTMLDivElement>(null)

  const passar = (d: number) => aoTrocar((indice + d + total) % total)
  const arrasto = useArrastoHorizontal({ aoArrastar: passar })

  // Trava a rolagem do fundo enquanto está aberto: sem isso a roda do mouse
  // rola a página atrás da foto.
  useEffect(() => {
    const antes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = antes
    }
  }, [])

  // O foco vai para o diálogo na abertura, senão o teclado continua na página
  // de trás e as setas não chegam aqui.
  useEffect(() => {
    caixa.current?.focus()
  }, [])

  useEffect(() => {
    const noTeclado = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aoFechar()
      if (e.key === 'ArrowLeft') passar(-1)
      if (e.key === 'ArrowRight') passar(1)
    }
    window.addEventListener('keydown', noTeclado)
    return () => window.removeEventListener('keydown', noTeclado)
  })

  return (
    <div
      ref={caixa}
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos de ${nome}`}
      tabIndex={-1}
      onClick={aoFechar}
      className="fixed inset-0 z-60 flex flex-col bg-ink-950/95 outline-none backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-5 py-4 lg:px-8">
        <span className="eyebrow text-bone-500">
          {indice + 1} / {total}
        </span>
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar"
          className="flex h-10 w-10 items-center justify-center border border-ink-700 text-xl text-bone-300 transition-colors hover:border-ember-500 hover:text-bone-100"
        >
          ×
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 lg:px-20">
        {/* O clique no fundo fecha; o clique na foto, não. */}
        <img
          src={fotos[indice].full}
          alt={`${nome} — foto ${indice + 1} de ${total}`}
          draggable={false}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full touch-pan-y select-none object-contain"
          {...arrasto}
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                passar(-1)
              }}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-ink-950/70 text-2xl text-bone-300 transition-colors hover:text-ember-200 lg:left-6"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                passar(1)
              }}
              aria-label="Próxima foto"
              className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-ink-950/70 text-2xl text-bone-300 transition-colors hover:text-ember-200 lg:right-6"
            >
              ›
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex justify-center gap-2 overflow-x-auto px-5 pb-6 lg:px-8"
        >
          {fotos.map((f, i) => (
            <button
              key={f.sm}
              type="button"
              onClick={() => aoTrocar(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === indice}
              className={`h-14 w-14 shrink-0 overflow-hidden border transition-colors ${
                i === indice ? 'border-ember-500' : 'border-ink-700 hover:border-ink-600'
              }`}
            >
              <img src={f.sm} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
