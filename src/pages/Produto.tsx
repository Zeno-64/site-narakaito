import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { acharPeca, pecas, whatsappPeca } from '../data/site'
import Reveal from '../components/Reveal'
import { definirMeta } from '../lib/meta'

const etapas = [
  { n: '01', titulo: 'Você escolhe', texto: 'Manda a peça no WhatsApp com as customizações que quiser.' },
  { n: '02', titulo: 'A gente orça', texto: 'Volta com preço fechado, prazo e as condições de parcelamento.' },
  { n: '03', titulo: 'Entra na fila', texto: 'Com o sinal pago, a peça vai para a impressora e depois para a bancada.' },
  { n: '04', titulo: 'Chega na sua casa', texto: 'Fotos antes de despachar, caixa reforçada e rastreio até a porta.' },
]

export default function Produto() {
  const { slug } = useParams()
  const peca = acharPeca(slug)
  const [ativa, setAtiva] = useState(0)

  useEffect(() => {
    setAtiva(0)
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (!peca) return
    definirMeta(
      `${peca.nome} — ${peca.serie} em resina pintada à mão · Narakaito Lab`,
      `${peca.chamada} Impressa em resina premium e pintada à mão sob encomenda, com envio para todo o Brasil.`,
    )
  }, [peca])

  if (!peca) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
        <p className="eyebrow text-ember-300">404</p>
        <h1 className="mt-4 font-display text-4xl text-bone-100">Peça não encontrada</h1>
        <p className="mt-4 text-bone-500">
          O link pode estar velho, ou a peça saiu do catálogo.
        </p>
        <Link
          to="/"
          className="eyebrow mt-8 border border-ember-500/60 px-8 py-4 text-bone-100 transition-colors hover:bg-ember-700/30"
        >
          Voltar ao catálogo
        </Link>
      </main>
    )
  }

  const outras = pecas.filter((p) => p.slug !== peca.slug).slice(0, 3)
  const link = whatsappPeca(peca.nome)

  return (
    <main className="bg-ink-900">
      {/* trilha de navegação */}
      <div className="border-b border-ink-800 bg-ink-950">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-5 py-4 lg:px-8">
          <Link to="/" className="eyebrow text-bone-600 transition-colors hover:text-ember-200">
            Início
          </Link>
          <span aria-hidden className="text-bone-600">
            /
          </span>
          <Link to="/#catalogo" className="eyebrow text-bone-600 transition-colors hover:text-ember-200">
            Catálogo
          </Link>
          <span aria-hidden className="text-bone-600">
            /
          </span>
          <span className="eyebrow text-bone-300">{peca.nome}</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8 lg:py-20">
        {/* galeria */}
        <div>
          <motion.div
            key={peca.fotos[ativa].full}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="relative aspect-4/5 overflow-hidden border border-ink-700 bg-ink-850"
          >
            <img
              src={peca.fotos[ativa].full}
              alt={`${peca.nome} — foto ${ativa + 1} de ${peca.fotos.length}`}
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
            {peca.badges && (
              <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
                {peca.badges.map((b) => (
                  <span key={b} className="eyebrow bg-ink-950/85 px-3 py-1.5 text-[0.625rem] text-ember-200">
                    {b}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

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
        </div>

        {/* informação e conversão */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-ember-300">{peca.serie}</p>
          <h1 className="mt-4 font-display text-4xl text-bone-100 lg:text-5xl">{peca.nome}</h1>
          <p className="mt-5 text-lg leading-relaxed text-bone-300">{peca.chamada}</p>

          <div className="mt-8 border-y border-ink-700 py-6">
            <p className="text-2xl text-bone-100">{peca.preco ?? 'Orçamento sob consulta'}</p>
            <p className="mt-2 text-sm text-bone-500">
              O preço varia com tamanho, customização e acabamento. Sem compromisso.
            </p>
          </div>

          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="eyebrow mt-8 block bg-ember-500 py-5 text-center text-bone-100 transition-colors hover:bg-ember-400"
          >
            Pedir orçamento no WhatsApp →
          </a>
          <p className="mt-3 text-center text-xs text-bone-600">
            Resposta no mesmo dia, direto com quem pinta.
          </p>

          <dl className="mt-10 divide-y divide-ink-800 border-y border-ink-800">
            {peca.ficha.map((linha) => (
              <div key={linha.rotulo} className="flex items-baseline justify-between gap-6 py-3">
                <dt className="eyebrow text-[0.625rem] text-bone-600">{linha.rotulo}</dt>
                <dd className="text-right text-sm text-bone-300">{linha.valor}</dd>
              </div>
            ))}
          </dl>

          {peca.origem === 'modelo' && peca.escultor && (
            <p className="mt-6 text-xs leading-relaxed text-bone-600">
              As imagens desta página são a arte de divulgação da escultura, assinada por{' '}
              {peca.escultor}. A impressão e a pintura são feitas aqui no ateliê.
            </p>
          )}
        </div>
      </div>

      {/* descrição */}
      <section className="border-t border-ink-800 bg-ink-850 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_1fr] lg:px-8">
          <Reveal>
            <p className="eyebrow text-ember-300">Sobre a peça</p>
            <h2 className="mt-4 font-display text-3xl text-bone-100">O que você vai receber</h2>
            <div className="mt-6 space-y-5">
              {peca.paragrafos.map((p) => (
                <p key={p.slice(0, 24)} className="text-base leading-relaxed text-bone-300">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border border-ink-700 bg-ink-900 p-8">
              <p className="eyebrow text-bone-100">Vai na caixa</p>
              <ul className="mt-6 space-y-4">
                {peca.inclui.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-bone-300">
                    <span aria-hidden className="mt-1 text-ember-400">
                      ◆
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* como funciona */}
      <section className="border-y border-ink-800 bg-ink-950 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="eyebrow text-ember-300">Como funciona</p>
          <h2 className="mt-4 font-display text-3xl text-bone-100">Do pedido à estante</h2>

          <div className="mt-12 grid gap-px bg-ink-800 sm:grid-cols-2 lg:grid-cols-4">
            {etapas.map((e, i) => (
              <Reveal key={e.n} delay={i * 0.06} className="bg-ink-950">
                <div className="h-full px-6 py-8">
                  <p className="font-display text-3xl text-ember-500/70">{e.n}</p>
                  <h3 className="eyebrow mt-4 text-bone-100">{e.titulo}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone-500">{e.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* outras peças */}
      <section className="bg-ink-900 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="font-display text-2xl text-bone-100">Outras peças do ateliê</h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {outras.map((o, i) => (
              <Reveal key={o.slug} delay={i * 0.06}>
                <Link
                  to={`/peca/${o.slug}`}
                  className="group block border border-ink-700 bg-ink-850 transition-colors hover:border-ember-500/70"
                >
                  <div className="aspect-square overflow-hidden bg-ink-800">
                    <img
                      src={o.fotos[0].sm}
                      alt={o.nome}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg text-bone-100">{o.nome}</h3>
                    <p className="eyebrow mt-2 text-[0.625rem] text-bone-600">{o.serie}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* chamada final */}
      <section className="border-t border-ink-800 bg-ink-950 py-20">
        <div className="mx-auto max-w-2xl px-5 text-center lg:px-8">
          <h2 className="font-display text-3xl text-bone-100 md:text-4xl">
            Quer esta peça na sua estante?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-bone-500">
            Manda mensagem que a gente fecha o orçamento, define as customizações e te coloca
            na fila do ateliê.
          </p>
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="eyebrow mt-10 inline-block bg-ember-500 px-10 py-4 text-bone-100 transition-colors hover:bg-ember-400"
          >
            Falar com o ateliê →
          </a>
        </div>
      </section>
    </main>
  )
}
