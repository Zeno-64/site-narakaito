import { useRef, useState } from 'react'
import type { PointerEvent as EventoDePonteiro } from 'react'
import { motion } from 'framer-motion'
import type { Peca } from '../data/site'
import { useArrastoHorizontal } from '../lib/arrasto'
import FotoAmpliada from './FotoAmpliada'

/**
 * Quantas vezes a lupa aumenta.
 *
 * O painel de zoom tem o mesmo formato do quadro da foto, então a janelinha
 * que anda junto do mouse é o quadro dividido por este número. Dois é o teto
 * útil aqui: as fotos têm 1080 px de largura e o quadro fica perto de 600, ou
 * seja, 2x já é praticamente pixel a pixel do arquivo.
 */
const FATOR = 2

/** Fração do quadro que a janelinha ocupa, e o quanto ela pode andar. */
const JANELA = 1 / FATOR
const LIMITE = 1 - JANELA

const entre = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

/**
 * Galeria da página da peça: foto grande, miniaturas, lupa e tela cheia.
 *
 * A lupa só responde a mouse. No celular não existe "passar por cima" e o
 * painel não teria onde caber -- lá o gesto é arrastar para trocar de foto e
 * tocar para abrir em tela cheia.
 */
export default function GaleriaPeca({ peca }: { peca: Peca }) {
  const [ativa, setAtiva] = useState(0)
  const [ampliada, setAmpliada] = useState(false)
  /** Canto superior esquerdo da janelinha, em fração do quadro. */
  const [lupa, setLupa] = useState<{ x: number; y: number } | null>(null)
  const quadro = useRef<HTMLDivElement>(null)

  const total = peca.fotos.length
  const passar = (d: number) => setAtiva((v) => (v + d + total) % total)
  const arrasto = useArrastoHorizontal({ aoArrastar: passar })

  const foto = peca.fotos[ativa]

  const mirar = (e: EventoDePonteiro) => {
    if (e.pointerType !== 'mouse') return
    const r = quadro.current?.getBoundingClientRect()
    if (!r) return
    const x = (e.clientX - r.left) / r.width - JANELA / 2
    const y = (e.clientY - r.top) / r.height - JANELA / 2
    setLupa({ x: entre(x, 0, LIMITE), y: entre(y, 0, LIMITE) })
  }

  return (
    <div className="relative">
      <motion.div
        key={foto.full}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        ref={quadro}
        className="relative aspect-4/5 touch-pan-y select-none overflow-hidden border border-ink-700 bg-ink-850"
        {...arrasto}
      >
        {/* Botão, e não a imagem solta: abrir em tela cheia precisa funcionar
            também no teclado. As setas e os selos ficam fora dele. */}
        <button
          type="button"
          onClick={() => setAmpliada(true)}
          onPointerMove={mirar}
          onPointerLeave={() => setLupa(null)}
          aria-label={`Ampliar foto ${ativa + 1} de ${total}`}
          className="absolute inset-0 cursor-zoom-in"
        >
          <img
            src={foto.full}
            alt={`${peca.nome} — foto ${ativa + 1} de ${total}`}
            className="h-full w-full object-cover"
            draggable={false}
            fetchPriority="high"
          />
        </button>

        {lupa && (
          <span
            aria-hidden
            style={{
              left: `${lupa.x * 100}%`,
              top: `${lupa.y * 100}%`,
              width: `${JANELA * 100}%`,
              height: `${JANELA * 100}%`,
            }}
            className="pointer-events-none absolute hidden border border-bone-100/60 bg-ink-950/45 lg:block"
          />
        )}

        {peca.badges && (
          <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-2">
            {peca.badges.map((b) => (
              <span key={b} className="eyebrow bg-ink-950/85 px-3 py-1.5 text-[0.625rem] text-ember-200">
                {b}
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
              className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-ink-950/70 text-bone-300 transition-colors hover:text-ember-200"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => passar(1)}
              aria-label="Próxima foto"
              className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-ink-950/70 text-bone-300 transition-colors hover:text-ember-200"
            >
              ›
            </button>
          </>
        )}
      </motion.div>

      {/* O painel do zoom sai por cima da coluna de texto, como no Mercado
          Livre. Só aparece onde há essa folga: da largura de notebook em
          diante, e enquanto o mouse está sobre a foto. */}
      {lupa && (
        <div
          aria-hidden
          style={{
            backgroundImage: `url(${foto.full})`,
            backgroundSize: `${FATOR * 100}% ${FATOR * 100}%`,
            backgroundPosition: `${(lupa.x / LIMITE) * 100}% ${(lupa.y / LIMITE) * 100}%`,
          }}
          className="pointer-events-none absolute left-full top-0 z-40 ml-4 hidden aspect-4/5 w-[26rem] border border-ink-700 bg-ink-950 bg-no-repeat shadow-2xl shadow-ink-950/70 lg:block"
        />
      )}

      <div className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-6">
        {peca.fotos.map((f, i) => (
          <button
            key={f.sm}
            type="button"
            onClick={() => setAtiva(i)}
            aria-label={`Ver foto ${i + 1}`}
            aria-current={i === ativa}
            className={`aspect-square overflow-hidden border transition-colors ${
              i === ativa ? 'border-ember-500' : 'border-ink-700 hover:border-ink-600'
            }`}
          >
            <img src={f.sm} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {ampliada && (
        <FotoAmpliada
          fotos={peca.fotos}
          nome={peca.nome}
          indice={ativa}
          aoTrocar={setAtiva}
          aoFechar={() => setAmpliada(false)}
        />
      )}
    </div>
  )
}
