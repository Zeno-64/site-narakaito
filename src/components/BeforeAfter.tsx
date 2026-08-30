import { useCallback, useRef, useState } from 'react'
import { comparador } from '../data/site'
import SectionTitle from './SectionTitle'

/** Comparador arrastável: resina crua de um lado, peça pintada do outro. */
export default function BeforeAfter() {
  const [pos, setPos] = useState(52)
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
          blurb="Toda peça começa cinza e sem graça. O que dá vida a ela são as horas de aerógrafo, pincel e lavagem de sombra. Arraste para comparar."
        />

        <div
          ref={frame}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            moveTo(e.clientX)
          }}
          onPointerMove={(e) => {
            if (e.buttons === 1) moveTo(e.clientX)
          }}
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
          <div className="absolute inset-y-0 w-px bg-ember-400" style={{ left: `${pos}%` }} aria-hidden>
            <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ember-400 bg-ink-950 text-ember-200">
              ⟷
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(pos)}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="Comparar resina crua e peça pintada"
            className="absolute bottom-4 left-1/2 w-2/3 -translate-x-1/2 accent-ember-400 opacity-0 focus-visible:opacity-100"
          />
        </div>
      </div>
    </section>
  )
}
