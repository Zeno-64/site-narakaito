import Reveal from './Reveal'
import { fotoSobre, whatsappUrl } from '../data/site'

export default function About() {
  return (
    <section id="sobre" className="relative overflow-hidden bg-ink-900 py-24 lg:py-32">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_80%_at_15%_50%,rgba(176,51,44,0.18),transparent_65%)]"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div className="relative aspect-4/5 overflow-hidden border border-ink-700 bg-ink-850">
            <img
              src={fotoSobre.full}
              alt="Figure em resina do catálogo da Narakaito"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow text-ember-300">Sobre o</p>
          <h2 className="mt-4 font-display text-4xl text-bone-100 lg:text-5xl">Narakaito Lab</h2>
          <span aria-hidden className="mt-6 block h-px w-20 bg-ember-500" />

          <p className="mt-7 text-base leading-relaxed text-bone-300">
            O que começou como um hobby foi, aos poucos, se transformando em um trabalho.
          </p>
          <p className="mt-5 text-base leading-relaxed text-bone-300">
            No início, a ideia era simplesmente produzir figures e explorar as
            possibilidades da impressão 3D. Com o tempo, a experiência foi aumentando,
            novas técnicas foram aprendidas e a busca por qualidade passou a fazer parte
            de cada etapa do processo.
          </p>
          <p className="mt-5 text-base leading-relaxed text-bone-300">
            A impressão deixou de ser apenas o ponto final de um arquivo digital. Vieram
            a preparação das peças, o cuidado com a superfície, o primer, a pintura
            manual, o acabamento e a montagem. Cada etapa trouxe novos aprendizados e,
            consequentemente, peças cada vez mais bem executadas.
          </p>
          <p className="mt-5 text-base leading-relaxed text-bone-300">
            Foi essa evolução constante que transformou uma atividade feita por hobby em
            um negócio voltado à produção de figures colecionáveis.
          </p>
          <p className="mt-5 text-base leading-relaxed text-bone-300">
            Ainda existe a mesma curiosidade de quando tudo começou, mas hoje existe
            também o compromisso de entregar uma peça que represente todo o trabalho,
            tempo e atenção dedicados a ela.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="eyebrow mt-10 inline-block border border-ember-500/60 px-8 py-4 text-bone-100 transition-colors hover:bg-ember-700/30"
          >
            Conversar com o Narakaito →
          </a>
        </Reveal>
      </div>
    </section>
  )
}
