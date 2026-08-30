import { useRef } from 'react'
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from 'framer-motion'
import { products } from '../data/site'

/**
 * Caixa em CSS 3D que abre conforme o scroll e revela a peça.
 *
 * Montagem: um "chão" no plano da cena e quatro paredes dobradas 90° a partir
 * das arestas dele, cada uma com transform-origin na própria dobra. A tampa é
 * filha da parede de trás e gira de -90° (fechada, deitada sobre a boca da
 * caixa) até +18° (aberta, tombada para trás).
 */

// As medidas da caixa (460 x 320 x 168) vivem em index.css, junto das dobras.
const INCLINACAO = 62 // de quanto a cena é vista de cima, em graus

export default function CaixaReveal() {
  const alvo = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: alvo, offset: ['start start', 'end end'] })

  // suaviza o vínculo com o scroll para o movimento não ficar granulado
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.4 })

  const tampa = useTransform(p, [0.04, 0.46], [-90, 18])
  const abaFrente = useTransform(p, [0.04, 0.4], [0, 82])
  const cena = useTransform(p, [0, 1], [INCLINACAO, 48])
  const giro = useTransform(p, [0, 1], [-16, 6])

  const pecaSobe = useTransform(p, [0.3, 0.92], [30, -196])
  const pecaOpacidade = useTransform(p, [0.3, 0.46], [0, 1])
  const pecaEscala = useTransform(p, [0.3, 0.92], [0.82, 1])
  const luz = useTransform(p, [0.26, 0.55], [0, 1])
  const textoOp = useTransform(p, [0.55, 0.75], [0, 1])
  const textoY = useTransform(p, [0.55, 0.75], [24, 0])

  const cenaTransform = useMotionTemplate`rotateX(${cena}deg) rotateZ(${giro}deg)`
  const tampaTransform = useMotionTemplate`rotateX(${tampa}deg)`
  const abaTransform = useMotionTemplate`rotateX(${abaFrente}deg)`
  const pecaTransform = useMotionTemplate`translate(-50%, 0) rotateX(-${cena}deg) translateY(${pecaSobe}px) scale(${pecaEscala})`

  const foto = products[0].fotos[6] ?? products[0].fotos[0]

  return (
    <section ref={alvo} className="relative h-[320vh] bg-ink-950">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <motion.div
          aria-hidden
          style={{ opacity: luz }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_52%,rgba(176,51,44,0.45),transparent_70%)]"
        />

        <div className="caixa-palco">
          <motion.div className="caixa-cena" style={{ transform: cenaTransform }}>
            {/* chão */}
            <div className="caixa-chao">
              {/* peça: contra-gira a inclinação da cena para encarar a câmera */}
              <motion.img
                src={foto.full}
                alt={`${products[0].name} saindo da caixa`}
                className="caixa-peca foto-sangrada"
                style={{ transform: pecaTransform, opacity: pecaOpacidade }}
                loading="lazy"
              />

              <div className="caixa-parede caixa-esq" />
              <div className="caixa-parede caixa-dir" />
              <div className="caixa-parede caixa-frente">
                <motion.div className="caixa-aba-frente" style={{ transform: abaTransform }} />
              </div>
              <div className="caixa-parede caixa-tras">
                <motion.div className="caixa-tampa" style={{ transform: tampaTransform }}>
                  <div className="caixa-tampa-interna" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: textoOp, y: textoY }}
          className="relative z-10 mt-8 max-w-md px-5 text-center"
        >
          <p className="eyebrow text-ember-300">Chega assim</p>
          <h2 className="mt-4 font-display text-3xl text-bone-100 md:text-4xl">
            Caixa reforçada, peça inteira
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-bone-500">
            Berço interno, proteção individual e um lacre que só você abre. Do ateliê até a
            sua estante, sem sustos no caminho.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
