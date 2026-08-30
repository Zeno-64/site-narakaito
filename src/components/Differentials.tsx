import { differentials } from '../data/site'
import Reveal from './Reveal'

export default function Differentials() {
  return (
    <section className="border-y border-ink-800 bg-ink-850">
      <div className="mx-auto grid max-w-7xl gap-px bg-ink-800 px-0 md:grid-cols-2 lg:grid-cols-4">
        {differentials.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06} className="bg-ink-850">
            <div className="h-full px-7 py-10">
              <span aria-hidden className="block h-px w-10 bg-ember-500" />
              <h3 className="eyebrow mt-5 text-bone-100">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-bone-500">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
