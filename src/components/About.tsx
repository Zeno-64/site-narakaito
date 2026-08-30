import Reveal from './Reveal'
import { fotoAtelie, whatsappUrl } from '../data/site'

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
              src={fotoAtelie.full}
              alt="Peça pintada à mão no ateliê da Narakaito Lab"
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
            O Narakaito Lab nasceu de uma bancada pequena, uma impressora de resina e a
            teimosia de fazer o próprio colecionável em vez de esperar o lançamento oficial.
            De lá pra cá virou ofício: cada peça passa por impressão, lixa, primer, aerógrafo
            e pincel antes de sair daqui.
          </p>
          <p className="mt-5 text-base leading-relaxed text-bone-300">
            Não existe linha de produção. Existe fila, tempo de secagem e uma pessoa
            decidindo onde vai a próxima sombra. Você fala com quem está pintando, acompanha o
            processo por foto e recebe a peça em casa.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="eyebrow mt-10 inline-block border border-ember-500/60 px-8 py-4 text-bone-100 transition-colors hover:bg-ember-700/30"
          >
            Conversar com o ateliê →
          </a>
        </Reveal>
      </div>
    </section>
  )
}
