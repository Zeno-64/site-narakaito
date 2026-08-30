import { motion } from 'framer-motion'
import { destaque, whatsappUrl } from '../data/site'

export default function Hero() {
  return (
    <section id="topo" className="relative -mt-20 overflow-hidden pt-20">
      <div aria-hidden className="absolute inset-0 bg-ink-950" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_78%_38%,rgba(176,51,44,0.42),transparent_62%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_100%,rgba(224,112,79,0.16),transparent_70%)]"
      />
      <div aria-hidden className="ember-field absolute inset-0" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow text-ember-200">{destaque.eyebrow}</p>

          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-bone-100 md:text-6xl lg:text-7xl">
            {destaque.titulo}
            <br />
            <span className="text-ember-400">{destaque.subtitulo}</span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-relaxed text-bone-300 md:text-lg">
            {destaque.texto}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="eyebrow bg-ember-500 px-8 py-4 text-bone-100 transition-colors hover:bg-ember-400"
            >
              Quero esta peça →
            </a>
            <a
              href="#catalogo"
              className="eyebrow border border-ink-600 px-8 py-4 text-bone-300 transition-colors hover:border-ember-500 hover:text-bone-100"
            >
              Ver o catálogo
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative aspect-4/5 w-full overflow-hidden border border-ink-700 bg-ink-850">
            <img
              src={destaque.foto.full}
              alt={`${destaque.titulo} ${destaque.subtitulo} — peça pintada à mão`}
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
          </div>
          <div
            aria-hidden
            className="absolute -bottom-px left-0 right-0 h-24 bg-gradient-to-t from-ink-950/90 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  )
}
