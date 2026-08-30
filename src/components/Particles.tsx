import { useEffect, useRef } from 'react'

type Brasa = {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  vida: number
  duracao: number
  quente: boolean
}

/**
 * Brasas subindo no fundo do topo. Canvas em vez de nós no DOM porque são
 * dezenas de partículas redesenhadas a cada quadro.
 */
export default function Particles({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let largura = 0
    let altura = 0
    let brasas: Brasa[] = []
    let quadro = 0
    let anterior = performance.now()

    const nova = (espalhar: boolean): Brasa => ({
      x: Math.random() * largura,
      // se for o primeiro preenchimento, distribuo na tela toda em vez de
      // fazer todas nascerem juntas na base
      y: espalhar ? Math.random() * altura : altura + Math.random() * 40,
      r: 0.6 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 7,
      vy: -(9 + Math.random() * 22),
      vida: espalhar ? Math.random() : 0,
      duracao: 5 + Math.random() * 7,
      quente: Math.random() > 0.55,
    })

    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const box = canvas.getBoundingClientRect()
      largura = box.width
      altura = box.height
      canvas.width = Math.round(largura * dpr)
      canvas.height = Math.round(altura * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const alvo = Math.round((largura * altura) / 14000)
      brasas = Array.from({ length: Math.min(Math.max(alvo, 18), 90) }, () => nova(true))
    }

    const desenhar = (agora: number) => {
      const dt = Math.min((agora - anterior) / 1000, 0.05)
      anterior = agora
      ctx.clearRect(0, 0, largura, altura)

      for (const b of brasas) {
        b.vida += dt / b.duracao
        if (b.vida >= 1) Object.assign(b, nova(false))

        // sopro lateral suave, para não subirem em linha reta
        b.x += (b.vx + Math.sin(b.vida * 6 + b.duracao) * 5) * dt
        b.y += b.vy * dt

        // some nas pontas e fica cheia no miolo da vida
        const alfa = Math.sin(b.vida * Math.PI) * (b.quente ? 0.85 : 0.45)
        if (alfa <= 0.01) continue

        const cor = b.quente ? '224, 112, 79' : '176, 51, 44'
        const brilho = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 4)
        brilho.addColorStop(0, `rgba(${cor}, ${alfa})`)
        brilho.addColorStop(1, `rgba(${cor}, 0)`)
        ctx.fillStyle = brilho
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r * 4, 0, Math.PI * 2)
        ctx.fill()
      }

      quadro = requestAnimationFrame(desenhar)
    }

    medir()
    quadro = requestAnimationFrame(desenhar)

    const obs = new ResizeObserver(medir)
    obs.observe(canvas)

    return () => {
      cancelAnimationFrame(quadro)
      obs.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}
