import { useCallback, useRef, useState } from 'react'
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
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
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
          className="relative mt-14 aspect-16/9 w-full cursor-ew-resize touch-none select-none overflow-hidden border border-ink-700 bg-ink-850"
        >
          {/* Lado pintado (base) */}
          <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_50%,rgba(176,51,44,0.30),transparent_72%)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="eyebrow text-bone-500">Pintada à mão</p>
            </div>
          </div>

          {/* Lado cru, recortado pela posição do cabo */}
          <div
            className="absolute inset-0 bg-ink-800"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="eyebrow text-bone-600">Resina crua</p>
            </div>
          </div>

          {/* Cabo */}
          <div
            className="absolute inset-y-0 w-px bg-ember-400"
            style={{ left: `${pos}%` }}
            aria-hidden
          >
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
