import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { destaques, duracaoDestaque } from '../data/site'
import Particles from './Particles'

/** Escreve o texto letra por letra. Devolve o trecho já digitado. */
function useMaquinaDeEscrever(texto: string, msPorLetra = 55) {
  const [escrito, setEscrito] = useState(texto)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEscrito(texto)
      return
    }
    setEscrito('')
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setEscrito(texto.slice(0, i))
      if (i >= texto.length) window.clearInterval(id)
    }, msPorLetra)
    return () => window.clearInterval(id)
  }, [texto, msPorLetra])

  return escrito
}

export default function Hero() {
  const [ativo, setAtivo] = useState(0)
  const [progresso, setProgresso] = useState(0)
  const [pausado, setPausado] = useState(false)

  const peca = destaques[ativo]
  const nomeCompleto = `${peca.titulo}\n${peca.subtitulo}`
  const digitado = useMaquinaDeEscrever(nomeCompleto)
  const [linha1, linha2 = ''] = digitado.split('\n')

  const inicio = useRef(0)

  // Barra de progresso por requestAnimationFrame, para o preenchimento ficar
  // contínuo em vez de pular de passo em passo.
  useEffect(() => {
    if (pausado) return
    let quadro = 0
    inicio.current = performance.now() - progresso * duracaoDestaque

    const tick = (agora: number) => {
      const p = Math.min((agora - inicio.current) / duracaoDestaque, 1)
      setProgresso(p)
      if (p >= 1) {
        setAtivo((v) => (v + 1) % destaques.length)
        setProgresso(0)
        return
      }
      quadro = requestAnimationFrame(tick)
    }

    quadro = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(quadro)
    // progresso fica de fora de propósito: ele é escrito aqui dentro
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ativo, pausado])

  const irPara = (i: number) => {
    setAtivo(i)
    setProgresso(0)
  }

  return (
    <section
      id="topo"
      className="relative overflow-hidden"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
    >
      <div aria-hidden className="absolute inset-0 bg-ink-950" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(115%_85%_at_75%_42%,rgba(176,51,44,0.40),transparent_63%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_60%_at_18%_100%,rgba(224,112,79,0.14),transparent_70%)]"
      />
      <Particles />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-[1fr_1fr] lg:gap-4 lg:px-8 lg:py-24">
        <div className="relative z-10 order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={`olho-${ativo}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="eyebrow text-ember-200"
            >
              {peca.eyebrow}
            </motion.p>
          </AnimatePresence>

          <h1
            className="mt-6 font-display text-5xl leading-[1.05] text-bone-100 md:text-6xl lg:text-7xl"
            aria-label={`${peca.titulo} ${peca.subtitulo}`}
          >
            <span aria-hidden>
              <span className="block min-h-[1.05em]">{linha1}</span>
              <span className="block min-h-[1.05em] text-ember-400">
                {linha2}
                {digitado.length < nomeCompleto.length && (
                  <span className="ml-1 inline-block w-[0.06em] animate-pulse bg-ember-400 align-baseline text-transparent">
                    |
                  </span>
                )}
              </span>
            </span>
          </h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={`texto-${ativo}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mt-7 max-w-lg text-base leading-relaxed text-bone-300 md:text-lg"
            >
              {peca.texto}
            </motion.p>
          </AnimatePresence>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to={`/peca/${peca.slug}`}
              className="eyebrow bg-ember-500 px-8 py-4 text-bone-100 transition-colors hover:bg-ember-400"
            >
              Quero esta peça →
            </Link>
            <a
              href="#catalogo"
              className="eyebrow border border-ink-600 px-8 py-4 text-bone-300 transition-colors hover:border-ember-500 hover:text-bone-100"
            >
              Ver o catálogo
            </a>
          </div>

          {/* Barra que carrega até trocar de peça */}
          <div className="mt-12 flex max-w-md items-center gap-3">
            {destaques.map((d, i) => (
              <button
                key={d.titulo + d.subtitulo}
                type="button"
                onClick={() => irPara(i)}
                aria-label={`Ver ${d.titulo} ${d.subtitulo}`}
                aria-current={i === ativo}
                className="group h-4 flex-1"
              >
                <span className="block h-px w-full bg-ink-600 transition-colors group-hover:bg-bone-600">
                  <span
                    className="block h-px bg-ember-400"
                    style={{
                      width: i < ativo ? '100%' : i === ativo ? `${progresso * 100}%` : '0%',
                    }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          {/* Sem mode="wait": a foto nova entra por cima enquanto a antiga sai,
              senão o hero fica sem imagem nenhuma durante a troca. */}
          <div className="relative mx-auto aspect-4/5 w-full max-w-xl">
            <AnimatePresence>
              <motion.div
                key={`foto-${ativo}`}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
              {/* Sem moldura: a máscara dissolve as bordas da foto no fundo,
                  para o retângulo não aparecer. */}
                <img
                  src={peca.foto.full}
                  alt={`${peca.titulo} ${peca.subtitulo} — peça pintada à mão`}
                  className="foto-sangrada h-full w-full object-cover"
                  fetchPriority="high"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
