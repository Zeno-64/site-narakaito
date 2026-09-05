import { useRef } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { products } from '../data/site'

// Variável de módulo, não sessionStorage: sessionStorage sobrevive a um F5,
// e o pedido era exatamente o contrário -- "só volta a funcionar com
// refresh". Uma variável aqui fora do componente mantém o valor entre
// navegações internas da SPA (o módulo não é recarregado ao trocar de rota),
// mas volta a `false` sozinha em qualquer recarregamento de página, porque
// nesse caso o bundle inteiro é reexecutado do zero.
let jaAbriuNestaCarga = false

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
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.25 })

  // Uma vez vista, a animação não repete: ao navegar pra uma página de peça
  // e voltar pra home, essa seção reaparece já aberta, sem obrigar a rolar
  // de novo pela revelação inteira. Só reinicia com F5.
  //
  // A decisão é tomada UMA vez, na montagem, e não é estado reativo de
  // propósito: trocar para a versão estática no meio da rolagem encolhia a
  // seção de 460vh para ~1 tela de uma vez, a página inteira subia debaixo do
  // usuário e o scroll caía lá embaixo, depois da revelação. Marcar o flag
  // sem re-renderizar deixa a animação terminar inteira nesta visita.
  const jaAbriu = useRef(jaAbriuNestaCarga).current

  useMotionValueEvent(p, 'change', (v) => {
    if (v < 0.72) return
    jaAbriuNestaCarga = true
  })

  // Linha do tempo. Tudo acontece antes de 0.8; o resto é a folga que segura
  // a cena montada por um instante antes de a página voltar a rolar.
  const tampa = useTransform(p, [0.02, 0.22], [-90, 18])
  const abaFrente = useTransform(p, [0.02, 0.22], [-90, -8])
  const cena = useTransform(p, [0, 0.46, 1], [INCLINACAO, 50, 50])
  const giro = useTransform(p, [0, 0.46, 1], [-16, 4, 4])

  const pecaOpacidade = useTransform(p, [0.16, 0.28], [0, 1])
  // Escala e subida bem menores que antes (eram 1.52x / -104px): com a
  // origem da transformação na base da peça, escalar pra cima faz a
  // imagem crescer só pelo topo -- em 1.52x ela furava o teto da tela e
  // sobrava um vão enorme até o texto embaixo.
  const pecaSobe = useTransform(p, [0.16, 0.38, 0.62, 1], [30, -70, -40, -40])
  const pecaEscala = useTransform(p, [0.16, 0.38, 0.62, 1], [0.82, 1, 1.15, 1.15])

  // a caixa se dissolve depois que a peça já saiu de dentro dela
  const caixaOpacidade = useTransform(p, [0.4, 0.56], [1, 0])
  const caixaDesce = useTransform(p, [0.4, 0.56], [0, 40])

  const luz = useTransform(p, [0.14, 0.36], [0, 1])
  const textoOp = useTransform(p, [0.58, 0.72], [0, 1])
  const textoY = useTransform(p, [0.58, 0.72], [20, 0])

  const cenaTransform = useMotionTemplate`rotateX(${cena}deg) rotateZ(${giro}deg)`
  const corpoTransform = useMotionTemplate`translateY(${caixaDesce}px)`
  const tampaTransform = useMotionTemplate`rotateX(${tampa}deg)`
  const abaTransform = useMotionTemplate`rotateX(${abaFrente}deg)`
  const pecaTransform = useMotionTemplate`translate(-50%, 0) rotateX(-${cena}deg) translateY(${pecaSobe}px) scale(${pecaEscala})`

  const foto = products[0].fotos[6] ?? products[0].fotos[0]

  // Versão estática: mesmo visual do fim da revelação (peça grande, caixa já
  // sumida), mas em fluxo normal de página -- sem as telas de altura extra
  // que só existiam para dar espaço de rolagem à animação.
  if (jaAbriu) {
    return (
      <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_40%,rgba(176,51,44,0.45),transparent_70%)]"
        />
        <div className="relative mx-auto flex max-w-md flex-col items-center px-5 text-center">
          <img
            src={foto.full}
            alt={`${products[0].nome} — peça pintada à mão`}
            className="foto-sangrada w-full max-w-xs"
          />
          <p className="eyebrow mt-10 text-ember-300">Chega assim</p>
          <h2 className="mt-4 font-display text-3xl text-bone-100 md:text-4xl">
            Da bancada para a sua estante
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-bone-500">
            Antes de despachar, a gente fotografa a peça pronta e manda o código de
            rastreio. Deu problema no caminho? Manda foto na hora de abrir que a gente
            resolve.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section ref={alvo} className="relative h-[240vh] bg-ink-950">
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
              {/* peça: contra-gira a inclinação da cena para encarar a câmera.
                  Fica fora de .caixa-corpo para não sumir com a caixa. */}
              <motion.img
                src={foto.full}
                alt={`${products[0].nome} saindo da caixa`}
                className="caixa-peca foto-sangrada"
                style={{ transform: pecaTransform, opacity: pecaOpacidade }}
                loading="lazy"
              />

              <motion.div
                className="caixa-corpo"
                style={{ opacity: caixaOpacidade, transform: corpoTransform }}
              >
                <div className="caixa-piso" />
                <div className="caixa-parede caixa-esq" />
                <div className="caixa-parede caixa-dir" />
                <div className="caixa-parede caixa-frente" />
                <div className="caixa-parede caixa-tras">
                  <motion.div className="caixa-tampa" style={{ transform: tampaTransform }}>
                    <div className="caixa-tampa-interna" />
                    <motion.div className="caixa-aba-frente" style={{ transform: abaTransform }} />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: textoOp, y: textoY }}
          className="absolute inset-x-0 bottom-20 z-10 mx-auto max-w-md px-5 text-center"
        >
          <p className="eyebrow text-ember-300">Chega assim</p>
          <h2 className="mt-4 font-display text-3xl text-bone-100 md:text-4xl">
            Da bancada para a sua estante
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-bone-500">
            Antes de despachar, a gente fotografa a peça pronta e manda o código de
            rastreio. Deu problema no caminho? Manda foto na hora de abrir que a gente
            resolve.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
