import { useState } from 'react'
import { faq } from '../data/site'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="border-t border-ink-800 bg-ink-950 py-24 lg:py-28">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <SectionTitle eyebrow="Dúvidas frequentes" title="Antes de encomendar" align="center" />

        <div className="mt-12 border-t border-ink-800">
          {faq.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal key={item.q} delay={i * 0.04}>
                <div className="border-b border-ink-800">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-lg text-bone-100">{item.q}</span>
                    <span
                      aria-hidden
                      className={`shrink-0 text-ember-300 transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      ＋
                    </span>
                  </button>
                  {isOpen && (
                    <p className="pb-7 pr-10 text-sm leading-relaxed text-bone-500">{item.a}</p>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
