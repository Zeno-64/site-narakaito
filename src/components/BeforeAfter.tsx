import { useCallback, useRef, useState } from 'react'
import { comparador } from '../data/site'
import SectionTitle from './SectionTitle'

/** Comparador arrastável: resina crua de um lado, peça pintada do outro. */
export default function BeforeAfter() {
  const [pos, setPos] = useState(52)
  // Enquanto o cabo está na mão (ou o teclado está no controle), a emenda
  // acende. É o único momento em que o visitante compara resina crua e peça
  // pintada lado a lado -- vale marcar que ali está acontecendo alguma coisa.
  const [aceso, setAceso] = useState(false)
  const frame = useRef<HTMLDivElement>(null)

  const moveTo = useCallback((clientX: number) => {
    const box = frame.current?.getBoundingClientRect()
    if (!box) return
    const pct = ((clientX - box.left) / box.width) * 100
    setPos(Math.min(100, Math.max(0, pct)))
  }, [])

  return (
    <section className="bg-ink-900 py-24 lg:py-28">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <SectionTitle
          eyebrow="Antes & depois"
          title="O que a pintura à mão muda"
          align="center"
          blurb="Toda peça começa cinza e sem graça. O que dá vida a ela são as horas de pincel: cor, sombra, luz e detalhe, um a um. Arraste para comparar."
        />

        <div
          ref={frame}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            setAceso(true)
            moveTo(e.clientX)
          }}
          onPointerMove={(e) => {
            if (e.buttons === 1) moveTo(e.clientX)
          }}
          onPointerUp={() => setAceso(false)}
          onPointerCancel={() => setAceso(false)}
          className="relative mt-14 aspect-square w-full cursor-ew-resize touch-none select-none overflow-hidden border border-ink-700 bg-ink-850"
        >
          <img
            src={comparador.pintado}
            alt="A peça depois da pintura à mão"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />

          {/* Lado cru, recortado pela posição do cabo */}
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <img
              src={comparador.cru}
              alt="A mesma peça em resina crua, antes de pintar"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <span className="eyebrow absolute left-4 top-4 bg-ink-950/80 px-3 py-1.5 text-[0.625rem] text-bone-300">
            Resina crua
          </span>
          <span className="eyebrow absolute right-4 top-4 bg-ink-950/80 px-3 py-1.5 text-[0.625rem] text-ember-200">
            Pintada à mão
          </span>

          {/* Cabo */}
          <div className="absolute inset-y-0 w-px" style={{ left: `${pos}%` }} aria-hidden>
            {/* brilho lateral: some para os dois lados a partir da emenda */}
            <span
              className={`absolute inset-y-0 left-1/2 w-24 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(224,112,79,0.22),transparent)] transition-opacity duration-300 ${
                aceso ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <span
              className={`absolute inset-y-0 left-0 w-px bg-ember-400 transition-shadow duration-300 ${
                aceso
                  ? 'shadow-[0_0_18px_4px_rgba(224,112,79,0.55)]'
                  : 'shadow-[0_0_8px_1px_rgba(224,112,79,0.25)]'
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-ink-950 transition-all duration-300 ${
                aceso
                  ? 'border-ember-300 text-ember-200 shadow-[0_0_22px_rgba(224,112,79,0.6)]'
                  : 'border-ember-400 text-ember-200'
              }`}
            >
              ⟷
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(pos)}
            onChange={(e) => setPos(Number(e.target.value))}
            onFocus={() => setAceso(true)}
            onBlur={() => setAceso(false)}
            aria-label="Comparar resina crua e peça pintada"
            className="absolute bottom-4 left-1/2 w-2/3 -translate-x-1/2 accent-ember-400 opacity-0 focus-visible:opacity-100"
          />
        </div>
      </div>
    </section>
  )
}
