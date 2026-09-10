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
            <Seta lado="anterior" aoClicar={() => passar(-1)} />
            <Seta lado="proxima" aoClicar={() => passar(1)} />
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

/**
 * Seta de passar foto.
 *
 * O alvo é a faixa inteira da lateral, da altura toda -- o desenho no meio é
 * só a marca visual. Botão do tamanho do ícone obriga mira, e aqui a pessoa
 * está olhando a foto, não caçando o controle.
 */
function Seta({ lado, aoClicar }: { lado: 'anterior' | 'proxima'; aoClicar: () => void }) {
  const anterior = lado === 'anterior'
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        aoClicar()
      }}
      aria-label={anterior ? 'Foto anterior' : 'Próxima foto'}
      className={`group absolute top-0 flex h-full w-20 items-center justify-center lg:w-28 ${
        anterior ? 'left-0' : 'right-0'
      }`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-950/70 text-bone-300 transition-colors group-hover:bg-ink-950/90 group-hover:text-ember-200 lg:h-16 lg:w-16">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 lg:h-9 lg:w-9"
          aria-hidden
        >
          <path d={anterior ? 'M15 4 7 12l8 8' : 'M9 4l8 8-8 8'} />
        </svg>
      </span>
    </button>
  )
}
