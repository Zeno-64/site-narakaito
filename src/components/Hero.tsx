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
      className="relative flex min-h-[calc(100svh-12rem)] items-center overflow-hidden"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
    >
      {/* Antes havia dois véus radiais vermelho/laranja aqui (rgba(176,51,44)
          e rgba(224,112,79)) — tingiam a seção inteira de vermelho. Um véu
          preto sobre o ink-950 (#070605), que já é quase preto, não muda
          nada visualmente, então o fundo virou só a cor sólida. */}
      <div aria-hidden className="absolute inset-0 bg-ink-950" />

      {/* Halo de brasa atrás da peça: a figura não tinha de onde receber luz e
          o fundo ficava preto chapado. No mobile o halo fica no centro; no
          desktop, atrás da coluna da foto. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(46%_52%_at_50%_40%,rgba(176,51,44,0.28),transparent_72%)] lg:bg-[radial-gradient(34%_56%_at_71%_46%,rgba(176,51,44,0.34),transparent_72%)]"
      />

      {/* A chama da marca, gigante e quase apagada, ocupando o vazio atrás do
          nome da peça. É o mesmo símbolo do header, só que em escala de fundo. */}
      <img
        aria-hidden
        alt=""
        src="/images/logo-mark.png"
        className="pointer-events-none absolute -left-20 top-1/2 hidden h-[125%] max-w-none -translate-y-1/2 opacity-[0.07] lg:block"
        style={{ filter: 'brightness(2.4) saturate(1.15)' }}
      />

      {/* Poça de luz no rodapé da seção, para o hero não terminar em corte seco */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(58%_100%_at_50%_100%,rgba(224,112,79,0.16),transparent_72%)]"
      />

      <Particles />

      {/* Vinheta: fecha os cantos e empurra o olho para o centro */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(115%_85%_at_50%_45%,transparent_46%,rgba(0,0,0,0.6))]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-20 pt-12 lg:grid-cols-[1fr_1fr] lg:gap-4 lg:px-8 lg:pb-20 lg:pt-14">
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
            className="mt-6 font-display text-5xl font-normal leading-[1.05] tracking-[0.02em] text-bone-100 md:text-6xl lg:text-7xl"
            aria-label={`${peca.titulo} ${peca.subtitulo}`}
          >
            <span aria-hidden>
              <span className="block min-h-[1.05em]">{linha1}</span>
              <span className="brilho-ember block min-h-[1.05em] text-ember-400">
                {linha2}
                {digitado.length < nomeCompleto.length && (
                  <span className="ml-1 inline-block w-[0.06em] animate-pulse bg-ember-400 align-baseline text-transparent">
                    |
                  </span>
                )}
              </span>
            </span>
          </h1>

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
        </div>

        <div className="relative order-1 lg:order-2">
          {/* Sem mode="wait": a foto nova entra por cima enquanto a antiga sai,
              senão o hero fica sem imagem nenhuma durante a troca. */}
          <div className="relative mx-auto aspect-4/5 h-[min(52svh,40rem)] w-[min(41.6svh,32rem)] max-w-full">
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

      {/* Seletor de peça: bolinhas padrão de carrossel, embaixo e centradas
          na seção inteira (não mais dentro da coluna de texto). Sem
          indicador de tempo visível — troca sozinha a cada 7s por baixo
          dos panos, o clique aqui só pula direto pra peça escolhida. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 right-6 z-10 hidden items-center gap-3 lg:flex"
      >
        <span className="eyebrow text-[0.625rem] text-bone-600">Role</span>
        <span className="relative block h-14 w-px overflow-hidden bg-ink-600">
          <span className="absolute inset-x-0 top-0 block h-5 animate-[descer_2.2s_ease-in-out_infinite] bg-ember-400" />
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center gap-3">
        {destaques.map((d, i) => (
          <button
            key={d.titulo + d.subtitulo}
            type="button"
            onClick={() => irPara(i)}
            aria-label={`Ver ${d.titulo} ${d.subtitulo}`}
            aria-current={i === ativo}
            className="group p-1.5"
          >
            <span
              className={`block h-2 w-2 rounded-full transition-colors ${
                i === ativo
                  ? 'bg-ember-400 shadow-[0_0_6px_rgba(176,51,44,0.7)]'
                  : 'bg-ink-600 group-hover:bg-bone-600'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
